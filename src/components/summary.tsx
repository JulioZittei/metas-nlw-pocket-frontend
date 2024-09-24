import { DialogTrigger } from "@radix-ui/react-dialog";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { PendingGoals } from "./pending-goals";

dayjs.locale(ptBR);

export function Summary() {
  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 segundos
  });

  if (!summary) {
    return null;
  }

  const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

  const progress = (summary?.completed / summary?.total) * 100;

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar Meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={summary?.total} value={summary?.completed}>
          <ProgressIndicator
            style={{
              width: `${progress}%`,
            }}
          />
        </Progress>

        <div className="flex items-center text-xs justify-between text-zinc-400">
          <span>
            Você completou{" "}
            <span className="text-zinc-100">{summary?.completed}</span> de{" "}
            <span className="text-zinc-100">{summary?.total}</span> metas nessa
            semana.
          </span>
          <span>{progress.toFixed()}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {Object.entries(summary.goals_per_day).map(([date, goals]) => {
          const weekDay = dayjs(date).format("dddd");
          const dayOfMonth = dayjs(date).format("D [de] MMMM");
          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize"> {weekDay} </span>
                <span className="text-zinc-400 text-xs">({dayOfMonth})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map((goal) => {
                  const completedDate = dayjs(goal.completed_at).format(
                    "HH:mm[h]"
                  );
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" às{" "}
                        <span className="text-zinc-100">{completedDate}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
