import {
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "./ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from "./ui/radio-group";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createGoal } from "../http/create-goal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createGoalForm = z.object({
  title: z.string().min(1, "Informe a atividade que deseja realizar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type CreateGoalForm = z.infer<typeof createGoalForm>;

export function CreateGoal() {
  const queryClient = useQueryClient();
  const { register, formState, control, reset, handleSubmit } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    });

  const handleCreateGoal = async (data: CreateGoalForm) => {
    try {
      await createGoal(data);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["summary", "pending-goals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-goals"],
      });
      toast.success("Meta criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar a meta, tente novamente!");
    }
  };

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar Meta</DialogTitle>
            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex flex-col justify-between flex-1"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="Praticar exercicios, meditar e etc..."
                {...register("title")}
              />

              {formState.errors.title && (
                <p className="text-red-400 text-sm">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                defaultValue={3}
                name="desiredWeeklyFrequency"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      {[...Array(7).keys()].map((v) => (
                        <RadioGroupItem key={v} value={`${v + 1}`}>
                          <RadioGroupIndicator />
                          <span className="text-zinc-300 text-sm font-medium leading-none">
                            {v + 1}x na semana
                          </span>
                          <span className="text-lg leading-none">
                            {v === 0 && "🥱"}
                            {v === 1 && "🙂"}
                            {v === 2 && "😎"}
                            {v === 3 && "😜"}
                            {v === 4 && "🤨"}
                            {v === 5 && "🤯"}
                            {v === 6 && "🔥"}
                          </span>
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
