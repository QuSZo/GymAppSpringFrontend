import { workoutDetailsDto } from "@/api/controllers/workout";
import ExerciseSummary from "@/common/components/WorkoutSummary/ExerciseSummary/ExerciseSummary";
import styles from "./WorkoutSummary.module.scss";
import Loader from "@/common/components/Loader/Loader";
import * as React from "react";

type WorkoutSummaryProps = {
  isLoading: boolean;
  workout?: workoutDetailsDto;
};

export default function WorkoutSummary(props: WorkoutSummaryProps) {
  return (
    <div className={styles.container}>
      {props.workout ? (
        props.workout.exercises.map((exercise, key) => <ExerciseSummary key={key} exercise={exercise} />)
      ) : (
        <p>Nie znaleziono treningu</p>
      )}
      {props.isLoading && <Loader className={styles.loader} />}
    </div>
  );
}
