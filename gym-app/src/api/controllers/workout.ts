import { exerciseDto } from "@/api/controllers/exercise";
import { UUID } from "node:crypto";
import { customCommand, customQuery } from "@/api/customFetch";

export type workoutsDto = {
  id: UUID;
  date: Date;
};

export type workoutDetailsDto = {
  id: UUID;
  date: Date;
  exercises: exerciseDto[];
};

export type createWorkoutCommand = {
  date: string;
  exerciseTypeId: UUID;
};

export type copyWorkoutCommand = {
  destinationDate: string;
  sourceDate: string;
};

export async function getWorkouts(): Promise<workoutsDto[]> {
  const response = await customQuery("workouts");
  return response.json();
}

export async function getWorkout(id: UUID, ): Promise<workoutDetailsDto> {
  const response = await customQuery("workouts/" + `${id}`);
  return response.json();
}

export async function getWorkoutByDate(date: Date): Promise<workoutDetailsDto> {
  const dateString = date.toLocaleDateString("sv-SE");
  const response = await customQuery("workouts/by-date/" + `${dateString}`);
  return response.json();
}

export async function createWorkout(command: createWorkoutCommand) {
  await customCommand<createWorkoutCommand>("workouts", "POST", command);
}

export async function copyWorkout(destinationDate: Date, sourceDate: Date) {
  const command: copyWorkoutCommand = {
    destinationDate: destinationDate.toLocaleDateString("sv-SE"),
    sourceDate: sourceDate.toLocaleDateString("sv-SE"),
  };
  await customCommand<copyWorkoutCommand>("workouts/copy", "POST", command);
}
