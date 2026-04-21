import { useState } from "react";
import { UserPlus, Loader2, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { respondToInvitation } from "../../../../../requests/memberRequests";
import type { NotificationCardProps } from "../NotificationsDropdown";

export default function ProjectInvitationCard({
    notification,
    onMarkAsRead,
    timeAgo,
}: NotificationCardProps) {
    const { inviterName, projectName, projectId, memberId } =
        notification.metadata ?? {};

    const queryClient = useQueryClient();
    const [responded, setResponded] = useState<"accepted" | "declined" | null>(
        null,
    );

    const { mutate: respond, isPending } = useMutation({
        mutationFn: (accept: boolean) =>
            respondToInvitation(projectId, memberId, accept),
        onSuccess: (_data, accept) => {
            setResponded(accept ? "accepted" : "declined");
            onMarkAsRead(notification.id);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({
                queryKey: ["notifications", "unread-count"],
            });
            // Si accepté -> rafraîchir la liste des projets
            if (accept) {
                queryClient.invalidateQueries({ queryKey: ["projects"] });
            }
        },
    });

    const handleAccept = (e: React.MouseEvent) => {
        e.stopPropagation();
        respond(true);
    };

    const handleRefuse = (e: React.MouseEvent) => {
        e.stopPropagation();
        respond(false);
    };

    // Déterminer si l'invitation a déjà reçu une réponse (via metadata ou état local)
    const alreadyResponded = responded || notification.isRead;

    return (
        <div
            className={`p-3 rounded-xl transition-colors ${
                !alreadyResponded
                    ? "bg-blue-50/60 hover:bg-blue-50"
                    : "hover:bg-gray-50 opacity-60"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <UserPlus size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                        <span className="font-UberMoveBold">
                            {inviterName ?? "Quelqu'un"}
                        </span>{" "}
                        vous invite à rejoindre le projet{" "}
                        <span className="font-UberMoveBold">
                            {projectName ?? "un projet"}
                        </span>
                    </p>

                    {/* Boutons d'action ou message de réponse */}
                    {responded === "accepted" ? (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 font-medium">
                            <Check size={12} />
                            Invitation acceptée
                        </div>
                    ) : responded === "declined" ? (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
                            <X size={12} />
                            Invitation refusée
                        </div>
                    ) : (
                        !notification.isRead && (
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={handleAccept}
                                    disabled={isPending}
                                    className="px-3 py-1 text-xs font-UberMoveBold text-white bg-[#388160] hover:bg-[#2e6b4e] rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <Loader2
                                            size={12}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        "Accepter"
                                    )}
                                </button>
                                <button
                                    onClick={handleRefuse}
                                    disabled={isPending}
                                    className="px-3 py-1 text-xs font-UberMoveBold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Refuser
                                </button>
                            </div>
                        )
                    )}

                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
                </div>
                {!alreadyResponded && (
                    <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                )}
            </div>
        </div>
    );
}
