import axios from "axios";
import type { CreateMilestonePayload, ProjectMilestone, UpdateMilestonePayload } from "../types/project/milestones";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const milestonesUrl = (projectId: string) => `${apiUrl}/projects/${projectId}/milestones`;

export const getProjectMilestones = async (projectId: string): Promise<ProjectMilestone[]> =>
  axios
    .get<ProjectMilestone[]>(milestonesUrl(projectId), { headers: headers() })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data ?? error;
    });

export const createProjectMilestone = async (projectId: string, payload: CreateMilestonePayload): Promise<ProjectMilestone> =>
  axios
    .post<ProjectMilestone>(milestonesUrl(projectId), payload, { headers: headers() })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data ?? error;
    });

export const updateProjectMilestone = async (projectId: string, milestoneId: string, payload: UpdateMilestonePayload): Promise<ProjectMilestone> =>
  axios
    .patch<ProjectMilestone>(`${milestonesUrl(projectId)}/${milestoneId}`, payload, { headers: headers() })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data ?? error;
    });

export const deleteProjectMilestone = async (projectId: string, milestoneId: string): Promise<void> =>
  axios
    .delete(`${milestonesUrl(projectId)}/${milestoneId}`, { headers: headers() })
    .then(() => undefined)
    .catch((error) => {
      throw error.response?.data ?? error;
    });
