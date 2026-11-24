import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { respondToInvitation } from "../../../../requests/memberRequests";
import type { NotificationResponse } from "../../../../requests/notificationRequests";

type InvitationBodyProps = { notification: NotificationResponse; onAnswered: () => void };

export default function InvitationBody({ notification, onAnswered }: InvitationBodyProps) {
  const queryClient = useQueryClient();
  const { projectId, memberId } = notification.metadata ?? {};
  const { mutate, isPending, variables } = useMutation({
    mutationFn: (accept: boolean) => respondToInvitation(projectId ?? "", memberId ?? "", accept),
    onSuccess: (_data, accept) => {
      onAnswered();
      if (accept) queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (notification.isRead || !projectId || !memberId)
    return <p className="text-xs font-medium text-[#82828c]">Invitation traitée</p>;

  return (
    <div className="flex items-start gap-2">
      <button
        onClick={() => mutate(true)}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-[7px] bg-[#1c1c1e] px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60 dark:bg-[#fafafa] dark:text-[#1c1c1e]"
      >
        {isPending && variables && <Loader2 className="h-3 w-3 animate-spin" />}
        Accepter
      </button>
      <button
        onClick={() => mutate(false)}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-[7px] border border-[#1c1c1e]/14 px-3 py-1.5 text-xs font-semibold text-[#52525b] transition-colors hover:bg-[#1c1c1e]/5 disabled:opacity-60 dark:border-white/16 dark:text-[#d4d4d8] dark:hover:bg-white/5"
      >
        {isPending && variables === false && <Loader2 className="h-3 w-3 animate-spin" />}
        Refuser
      </button>
    </div>
  );
}
