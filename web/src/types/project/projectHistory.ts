export enum ActivityEventType {
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  PROJECT_NOTES_UPDATED = "PROJECT_NOTES_UPDATED",
  MEMBER_INVITED = "MEMBER_INVITED",
  MEMBER_ACCEPTED = "MEMBER_ACCEPTED",
  MEMBER_DECLINED = "MEMBER_DECLINED",
  MEMBER_ROLE_UPDATED = "MEMBER_ROLE_UPDATED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
}


export type ActivityEventPayload =
  | { type: ActivityEventType.PROJECT_CREATED; projectName: string }
  | {
      type: ActivityEventType.PROJECT_UPDATED;
      changedFields: string[];
      projectName: string;
    }
  | { type: ActivityEventType.PROJECT_NOTES_UPDATED; projectName: string }
  | {
      type: ActivityEventType.MEMBER_INVITED;
      invitedEmail: string;
      invitedUserId: string;
      role: string;
      projectName: string;
    }
  | { type: ActivityEventType.MEMBER_ACCEPTED; memberId: string; projectName: string }
  | { type: ActivityEventType.MEMBER_DECLINED; memberId: string; projectName: string }
  | {
      type: ActivityEventType.MEMBER_ROLE_UPDATED;
      targetUserId: string;
      targetDisplayName: string;
      previousRole: string;
      newRole: string;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_REMOVED;
      removedUserId: string;
      removedDisplayName: string;
      role: string;
      projectName: string;
    };


export interface ActivityEventResponse {
  id: string;
  projectId: string;
  actorUserId: string | null;
  actorDisplayName: string;
  eventType: ActivityEventType;
  payload: ActivityEventPayload;
  version: number;
  createdAt: string; // ISO 8601
}

export interface ActivityHistoryPage {
  items: ActivityEventResponse[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type EventStyle = {
    icon: React.ReactNode;
    bg: string;
    color: string;
};
