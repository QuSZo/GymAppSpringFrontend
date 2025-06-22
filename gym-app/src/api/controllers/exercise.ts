import { exerciseSetDto } from "@/api/controllers/exerciseSet";
import { UUID } from "node:crypto";
import { customCommand } from "@/api/customFetch";

export type exerciseDto = {
  id: UUID;
  exerciseNumber: number;
  exerciseTypeName: string;
  exerciseSets: exerciseSetDto[];
};

export type createExerciseCommand = {
  exerciseTypeId: UUID;
  workoutId: UUID;
};

export type updateExerciseCommand = {
  changeDirection: ChangeDirectionEnum;
};

export enum ChangeDirectionEnum {
  Up,
  Down,
}

export async function addExercise(command: createExerciseCommand) {
  await customCommand<createExerciseCommand>("exercises", "POST", command);
}

export async function deleteExercise(id: UUID) {
  await customCommand<createExerciseCommand>(`exercises/${id}`, "DELETE");
}

export async function updateExerciseNumber(id: UUID, command: updateExerciseCommand) {
  await customCommand<updateExerciseCommand>(`exercises/${id}/exercise-number`, "PATCH", command);
}
