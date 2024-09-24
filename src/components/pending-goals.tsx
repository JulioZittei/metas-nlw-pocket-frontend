import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
  const queryClient = useQueryClient();
  const { data: pendingGoals, isLoading } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60, // 60 segundos
  });

  if (isLoading || !pendingGoals) {
    return null;
  }

  const handleCompleteGoal = async (goalId: string) => {
    await createGoalCompletion(goalId);
    queryClient.invalidateQueries({
      queryKey: ["summary"],
    });
    queryClient.invalidateQueries({
      queryKey: ["pending-goals"],
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {pendingGoals.map((pendingGoal) => (
        <OutlineButton
          key={pendingGoal.id}
          onClick={() => handleCompleteGoal(pendingGoal.id)}
          disabled={
            pendingGoal.completion_count >= pendingGoal.desired_weekly_frequency
          }
        >
          <Plus className="size-4 text-zinc-600" />
          {pendingGoal.title}
        </OutlineButton>
      ))}
    </div>
  );
}
