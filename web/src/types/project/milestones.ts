export type ProjectMilestone = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
  isCompleted: boolean;
  completedAt: string | null;
  completedBy: string | null;
  completedByName: string | null;
  createdAt: string;
};

export type CreateMilestonePayload = {
  title: string;
  description?: string | null;
  dueDate?: string | null;
};

export type UpdateMilestonePayload = Partial<CreateMilestonePayload> & {
  isCompleted?: boolean;
};
