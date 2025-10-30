import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Docker = require('dockerode');
import { RegionConfig, ContainerConfig } from '../types/region.types';
import * as path from 'path';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class DockerContainerService implements OnModuleInit {
  private readonly logger = new Logger(DockerContainerService.name);
  private docker: Docker;

  async onModuleInit() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });

    try {
      await this.docker.ping();
      this.logger.log('Connexion à Docker établie');
    } catch (error) {
      this.logger.error('Impossible de se connecter à Docker', error);
      throw new Error("Docker n'est pas accessible");
    }
  }

  private async isDataImported(dataPath: string): Promise<boolean> {
    const graphPath = path.join(dataPath, 'default-gh');

    try {
      const stats = await fs.promises.stat(graphPath);
      if (stats.isDirectory()) {
        // Vérifier qu'il y a des fichiers dedans (pas juste dossier vide)
        const files = await fs.promises.readdir(graphPath);
        const hasData =
          files.length > 0 && files.some((f) => !f.startsWith('.'));
        this.logger.debug(
          `Données GraphHopper ${hasData ? 'présentes' : 'absentes'} dans ${graphPath}`,
        );
        return hasData;
      }
    } catch (error) {
      this.logger.debug(`Pas de données importées dans ${graphPath}`);
    }

    return false;
  }

  /**
   * Importe les données OSM (première fois uniquement)
   */
  private async importData(
    region: RegionConfig,
    containerConfig: ContainerConfig,
  ): Promise<void> {
    this.logger.log(`Import des données OSM pour ${region.name}...`);

    const dataPath = path.resolve(process.cwd(), region.dataPath);

    // Vérifier que le fichier OSM existe
    const osmPath = path.join(dataPath, region.osmFile);
    if (!fs.existsSync(osmPath)) {
      throw new Error(`Fichier OSM introuvable: ${osmPath}`);
    }

    try {
      // Créer et démarrer le conteneur d'import
      const importContainer = await this.docker.createContainer({
        name: `${region.containerName}-import`,
        Image: containerConfig.image,
        Env: [`JAVA_OPTS=${containerConfig.javaOpts}`],
        HostConfig: {
          Binds: [`${dataPath}:/data`],
          Memory: containerConfig.memory,
          AutoRemove: true,
        },
        Cmd: [
          '--input',
          `/data/${region.osmFile}`,
          '--config',
          `/data/${region.configFile}`,
          '--import',
        ],
      });

      await importContainer.start();
      this.logger.log(`Import en cours pour ${region.name}`);

      // Attendre la fin de l'import (stream des logs)
      const stream = await importContainer.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      stream.on('data', (chunk) => {
        const log = chunk.toString('utf8');
        if (log.includes('ERROR') || log.includes('Exception')) {
          this.logger.error(`Import: ${log.substring(0, 500)}`);
        } else if (log.includes('finished') || log.includes('Took:')) {
          this.logger.log(`Import: ${log.substring(0, 200)}`);
        }
      });

      await importContainer.wait();
      this.logger.log(`Import terminé pour ${region.name}`);
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'import des données pour ${region.name}`,
        error,
      );
      try {
        const container = await this.findContainer(
          `${region.containerName}-import`,
        );
        if (container) {
          await container.remove({ force: true });
        }
      } catch {}
      throw error;
    }
  }

  /**
   * Démarre un conteneur GraphHopper pour une région
   */
  async startContainer(
    region: RegionConfig,
    containerConfig: ContainerConfig,
  ): Promise<string> {
    this.logger.log(` Démarrage du conteneur pour ${region.name}...`);

    try {
      const existingContainer = await this.findContainer(region.containerName);

      if (existingContainer) {
        const info = await existingContainer.inspect();

        if (info.State.Running) {
          this.logger.log(
            `Le conteneur ${region.containerName} est déjà en cours d'exécution`,
          );
          return existingContainer.id;
        }

        // Si le conteneur existe mais est arrêté -> supprimer
        this.logger.log(
          `Suppression de l'ancien conteneur ${region.containerName}`,
        );
        await existingContainer.remove({ force: true });
      }

      const dataPath = path.resolve(process.cwd(), region.dataPath);
      this.logger.debug(`Chemin des données: ${dataPath}`);

      const dataImported = await this.isDataImported(dataPath);

      if (!dataImported) {
        this.logger.warn(
          `Pas de données importées pour ${region.name}. Lancement de l'import.`,
        );
        await this.importData(region, containerConfig);
      } else {
        this.logger.log(`Données déjà importées pour ${region.name}`);
      }

      const container = await this.docker.createContainer({
        name: region.containerName,
        Image: containerConfig.image,
        Env: [`JAVA_OPTS=${containerConfig.javaOpts}`],
        ExposedPorts: {
          '8989/tcp': {},
        },
        HostConfig: {
          PortBindings: {
            '8989/tcp': [{ HostPort: region.port.toString() }],
          },
          Binds: [`${dataPath}:/data`],
          Memory: containerConfig.memory,
          AutoRemove: false,
        },
        Cmd: [
          '--input',
          `/data/${region.osmFile}`,
          '--config',
          `/data/${region.configFile}`,
        ],
      });

      await container.start();
      this.logger.log(
        `Conteneur ${region.containerName} démarré (ID: ${container.id})`,
      );

      return container.id;
    } catch (error) {
      this.logger.error(
        `Erreur lors du démarrage du conteneur ${region.name}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Arrête un conteneur
   */
  async stopContainer(
    containerName: string,
    timeout: number = 30,
  ): Promise<void> {
    this.logger.log(`Arrêt du conteneur ${containerName}.`);

    try {
      const container = await this.findContainer(containerName);

      if (!container) {
        this.logger.warn(`Le conteneur ${containerName} n'existe pas`);
        return;
      }

      const info = await container.inspect();

      if (!info.State.Running) {
        this.logger.log(`Le conteneur ${containerName} est déjà arrêté`);
        await container.remove({ force: true });
        return;
      }

      await container.stop({ t: timeout });
      await container.remove({ force: true });

      this.logger.log(`Conteneur ${containerName} arrêté et supprimé`);
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'arrêt du conteneur ${containerName}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Vérifie si GraphHopper est prêt à recevoir des requêtes
   */
  async waitForHealthy(
    region: RegionConfig,
    timeout: number = 120000,
  ): Promise<boolean> {
    this.logger.log(
      `Attente que GraphHopper soit prêt pour ${region.name}.`,
    );

    const startTime = Date.now();
    const healthUrl = `http://localhost:${region.port}/health`;
    let attemptCount = 0;

    while (Date.now() - startTime < timeout) {
      attemptCount++;

      try {
        const container = await this.findContainer(region.containerName);
        if (container) {
          const info = await container.inspect();
          if (!info.State.Running) {
            this.logger.error(
              `Le conteneur ${region.containerName} s'est arrêté`,
            );
            this.logger.error('Logs du conteneur:');
            const logs = await container.logs({
              stdout: true,
              stderr: true,
              tail: 100,
            });
            this.logger.error(logs.toString());
            return false;
          }
        }

        const response = await axios.get(healthUrl, { timeout: 5000 });

        if (response.status === 200) {
          this.logger.log(
            `GraphHopper est prêt pour ${region.name} (tentative ${attemptCount})`,
          );
          return true;
        }
      } catch (error) {
        if (attemptCount % 15 === 0) {
          const elapsed = Math.round((Date.now() - startTime) / 1000);
          this.logger.log(
            `Tentative ${attemptCount} (${elapsed}s écoulées): GraphHopper pas encore prêt pour ${region.name}...`,
          );

          try {
            const container = await this.findContainer(region.containerName);
            if (container) {
              const logs = await container.logs({
                stdout: true,
                stderr: true,
                tail: 5,
              });
              const logStr = logs.toString('utf8').trim();
              if (logStr) {
                this.logger.debug(
                  `Derniers logs: ${logStr.substring(logStr.length - 300)}`,
                );
              }
            }
          } catch (logError) {}
        }

        await this.sleep(2000);
      }
    }

    this.logger.error(
      `Timeout: GraphHopper n'est pas devenu prêt pour ${region.name} après ${attemptCount} tentatives`,
    );

    try {
      const container = await this.findContainer(region.containerName);
      if (container) {
        const logs = await container.logs({
          stdout: true,
          stderr: true,
          tail: 100,
        });
        this.logger.error('=== LOGS DU CONTENEUR ===');
        this.logger.error(logs.toString());
      }
    } catch (error) {
      this.logger.error('Impossible de récupérer les logs du conteneur');
    }

    return false;
  }

  /**
   * Trouve un conteneur par son nom
   */
  private async findContainer(name: string): Promise<Docker.Container | null> {
    const containers = await this.docker.listContainers({ all: true });
    const containerInfo = containers.find((c) =>
      c.Names.some((n) => n === `/${name}` || n === name),
    );

    return containerInfo ? this.docker.getContainer(containerInfo.Id) : null;
  }

  /**
   * Liste tous les conteneurs GraphHopper actifs
   */
  async listGraphHopperContainers(): Promise<string[]> {
    const containers = await this.docker.listContainers({ all: true });
    return containers
      .filter((c) => c.Names.some((n) => n.includes('graphhopper')))
      .map((c) => c.Names[0].replace('/', ''));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
