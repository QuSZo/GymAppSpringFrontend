"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { getWorkouts, workoutsDto, workoutDetailsDto, getWorkoutByDate, createWorkout } from "@/api/controllers/workout";
import AddExerciseDialog from "@/app/(afterSignIn)/_components/AddExerciseDialog";
import { addExercise } from "@/api/controllers/exercise";
import { exerciseCategory, getExerciseCategories } from "@/api/controllers/exerciseCategory";
import { exerciseTypeDetails, getExerciseTypes } from "@/api/controllers/exerciseType";
import { UUID } from "node:crypto";
import Workout from "@/common/components/Workout/Workout";
import { dateOnly } from "@/utils/dateOnly";
import { useAuthContext } from "@/common/contexts/authContext";
import Button from "@/common/components/Button/Button";
import { Icon } from "@/common/components/Icons/Icon/Icon";
import Calendar from "@/common/components/ReactCalendar/Calendar/Calendar";
import * as React from "react";
import SummaryWorkoutDialog from "@/app/(afterSignIn)/_components/SummaryWorkoutDialog";
import Loader from "@/common/components/Loader/Loader";
import { useLoaderContext } from "@/common/contexts/loaderContext";
import dynamic from 'next/dynamic';

type WorkoutForDatePageProps = {
  params: {
    date: string;
  };
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const WeeklyDayPicker = dynamic(() => import('react-weekly-day-picker'), {ssr: false,}) as any;

export default function WorkoutForDatePage({ params }: WorkoutForDatePageProps) {
  const [selectedDate, setSelectedDate] = useState(dateOnly(new Date(params.date)));
  const [workouts, setWorkouts] = useState<workoutsDto[]>([]);
  const [workout, setWorkout] = useState<workoutDetailsDto>();
  const [showPortal, setShowPortal] = useState(false);
  const [exerciseCategories, setExerciseCategories] = useState<exerciseCategory[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<exerciseTypeDetails[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [workoutToCopy, setWorkoutToCopy] = useState<Date | undefined>();
  const { reload, setReload } = useAuthContext();
  const { loading, setLoading } = useLoaderContext();

  const loadWorkoutData = async () => {
    setLoading(true);

    try {
      const [allWorkouts, selectedWorkout] = await Promise.all([
        getWorkouts(),
        getWorkoutByDate(selectedDate).catch(() => undefined),
      ]);

      setWorkouts(allWorkouts);
      setWorkout(selectedWorkout);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reload) {
      setSelectedDate(dateOnly(new Date()));
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    if (!reload) {
      history.pushState({}, "", `/workout/${selectedDate.toLocaleDateString("sv-SE")}`);
      loadWorkoutData();
    }
  }, [selectedDate]);

  useEffect(() => {
    const exerciseCategories = async () => {
      setExerciseCategories(await getExerciseCategories());
    };

    const exerciseTypes = async () => {
      setExerciseTypes(await getExerciseTypes());
    };
    exerciseCategories();
    exerciseTypes();
  }, []);

  let workoutsDates: Date[] = [];
  workoutsDates = workouts.map((workout) => new Date(workout.date));

  async function onAddExercise(exerciseTypeId: UUID) {
    setLoading(true);
    if (workout == undefined) {
      createWorkout({ exerciseTypeId: exerciseTypeId, date: selectedDate.toLocaleDateString("sv-SE") })
        .then(async () => loadWorkoutData())
        .finally(() => setLoading(false));
    } else {
      addExercise({ exerciseTypeId: exerciseTypeId, workoutId: workout.id })
        .then(async () => loadWorkoutData())
        .finally(() => setLoading(false));
    }
  }

  const classNames = {
    dayCircleContainer : styles.dayCircleContainer,
    dayCircleTodayText : styles.dayCircleTodayText
  }

  return (
    <>
      <div className={styles.main}>
        {!reload && (
          <>
            <WeeklyDayPicker classNames={classNames} beforeToday={true} multipleDaySelect={false} selectedDays={[selectedDate]} selectDay={(day:Date[]) => setSelectedDate(dateOnly(new Date(day[0])))} />
            <Workout workout={workout} onRefresh={() => loadWorkoutData()} />
          </>
        )}
        <div className={styles.iconWrapper} data-centered={(!workout).toString()}>
          {!workout && (
            <Button onClick={() => setShowCalendar(true)} className={styles.buttonWithIcon} styling={"cancel"}>
              <Icon name={"calendar"} classNameSvg={styles.svg} classNameIcon={styles.icon} />
              Skopiuj trening
            </Button>
          )}
          <Button onClick={() => setShowPortal(true)} className={styles.buttonWithIcon}>
            <Icon name="add" classNameSvg={styles.svg} classNameIcon={styles.icon} />
            Dodaj ćwiczenie
          </Button>
        </div>
        {loading && <Loader className={styles.loader} />}
      </div>
      <AddExerciseDialog
        portalRoot={"dialog"}
        show={showPortal}
        onClose={() => setShowPortal(false)}
        onAddExercise={onAddExercise}
        exerciseCategories={exerciseCategories}
        exerciseTypes={exerciseTypes}
      />
      <Calendar
        showCalendar={showCalendar}
        onClose={() => setShowCalendar(false)}
        labeledDays={workoutsDates}
        mode={"single"}
        onDayClick={(date: Date) => {
          setWorkoutToCopy(date);
        }}
        selected={selectedDate}
        defaultMonth={selectedDate}
      ></Calendar>
      {workoutToCopy && (
        <SummaryWorkoutDialog
          destinationDate={selectedDate}
          sourceDate={workoutToCopy ?? new Date()}
          portalRoot={"dialog"}
          show={true}
          onClose={() => setWorkoutToCopy(undefined)}
          onRefresh={() => loadWorkoutData()}
          onPrevious={() => {
            setWorkoutToCopy(undefined);
            setShowCalendar(true);
          }}
        ></SummaryWorkoutDialog>
      )}
    </>
  );
}
