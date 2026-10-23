import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const URL_EXPIRATION_SECONDS = 300;

// Cloudflare R2 is S3-compatible: files go straight from the client to the bucket via presigned URLs.
@Injectable()
export class StorageService {
    private client: S3Client | null = null;
    private bucket: string;

    constructor(private readonly configService: ConfigService) { }

    // Lazily configured so the rest of the API still boots when R2 variables are missing.
    private getClient(): S3Client {
        if (this.client)
            return this.client;

        const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
        const bucket = this.configService.get<string>('R2_BUCKET_NAME');

        if (!accountId || !accessKeyId || !secretAccessKey || !bucket)
            throw new InternalServerErrorException('Le stockage de documents n\'est pas configuré.');

        this.bucket = bucket;
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
        });
        return this.client;
    }

    async getUploadUrl(key: string, contentType: string): Promise<string> {
        const client = this.getClient();
        const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
        return getSignedUrl(client, command, { expiresIn: URL_EXPIRATION_SECONDS });
    }

    // "inline" lets the browser display the file (viewer), "attachment" forces a download.
    async getDownloadUrl(key: string, fileName: string, disposition: 'inline' | 'attachment' = 'attachment'): Promise<string> {
        const client = this.getClient();
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ResponseContentDisposition: `${disposition}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        });
        return getSignedUrl(client, command, { expiresIn: URL_EXPIRATION_SECONDS });
    }

    async getObjectSize(key: string): Promise<number | null> {
        const client = this.getClient();
        try {
            const head = await client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
            return head.ContentLength ?? null;
        } catch {
            return null;
        }
    }

    async deleteObject(key: string): Promise<void> {
        const client = this.getClient();
        await client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
}
