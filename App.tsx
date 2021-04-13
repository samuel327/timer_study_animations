import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CircularProgressBar } from './components/CircularProgressBar';
import { Audio } from 'expo-av';
import { EditModal } from './components/EditModal';
import { AppColors } from './constants/AppColors';
import { Header } from './components/Header';
interface TIMER_STATES {
  [x: string]: boolean;
  countdown: boolean;
  hangTime: boolean;
  restTime: boolean;
  breakTime: boolean;
}
const countdownActive: TIMER_STATES = {
  countdown: true,
  hangTime: false,
  restTime: false,
  breakTime: false,
};

export interface Workout_Details_Props {
  [x: string]: number;
  countdown: number;
  hangtime: number;
  resttime: number;
  breaktime: number;
  totalSets: number;
  reps: number;
}

const workout_details: Workout_Details_Props = {
  countdown: 10,
  hangtime: 7,
  resttime: 3,
  breaktime: 10,
  totalSets: 1,
  reps: 3,
};

export default function App() {
  const [timer_state, setTimerState] = useState({ ...countdownActive });
  const [workoutDetails, setWorkoutDetails] = useState<Workout_Details_Props>({
    ...workout_details,
  });
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  /*sounds*/
  const [beep_G2, setBeepG2] = useState<any>();
  const [beep_C3, setBeepC3] = useState<any>();
  useEffect(() => {
    getG2();
    getC3();
  }, []);

  async function getG2() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sounds/beep_G2.wav')
    );
    setBeepG2(sound);
  }

  async function getC3() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sounds/beep_C3.wav')
    );
    setBeepC3(sound);
  }

  async function playG2() {
    try {
      await beep_G2.replayAsync();
    } catch (e) {
      console.log(e);
    }
  }

  async function playC3() {
    try {
      await beep_C3.replayAsync();
    } catch (e) {
      console.log(e);
    }
  }

  function toggleModal() {
    setIsPaused(true);
    setHasStarted(false);
    setVisible(!visible);
  }

  function onSave(updatedWorkoutDetails: Workout_Details_Props) {
    setWorkoutDetails(updatedWorkoutDetails);
    toggleModal();
  }

  function nextState(prevState: string, nextState: string) {
    setTimerState((prev: TIMER_STATES) => {
      let updated = { ...prev };
      updated[prevState] = false;
      updated[nextState] = true;
      return updated;
    });
  }

  function reset() {
    setTimerState({ ...countdownActive });
  }

  function determineNextState(prev: string, next: string) {
    // setCurrentRep((prev: number) => prev + 1);
    if (currentRep + 1 > workoutDetails.reps) {
      if (currentSet + 1 > workoutDetails.totalSets) {
        setComplete(true);
        //no need to proceed to next step
      } else {
        setCurrentSet((prev: number) => prev + 1);
        setCurrentRep(1);
        nextState(prev, 'breakTime');
      }
    } else {
      if (next === 'hangTime') {
        setCurrentRep((prev: number) => prev + 1);
      }

      nextState(prev, next);
    }
  }

  function displayHeaderAndCircle(
    title: string,
    prev: string,
    next: string,
    duration: number,
    color: string
  ) {
    if (workoutDetails) {
      return (
        <View style={styles.stateView}>
          <View>
            <CircularProgressBar
              color={color}
              setDone={() => {
                determineNextState(prev, next);
              }}
              workout_details={workoutDetails}
              duration={duration}
              //duration={workoutDetails[next]}
              hasStarted={hasStarted}
              isPaused={isPaused}
              title={title}
              playG2={playG2}
              playC3={playC3}
            />
          </View>
        </View>
      );
    }
  }

  return (
    <>
      <Header
        workoutDetails={workoutDetails}
        currentSet={currentSet}
        currentRep={currentRep}
      />
      <View style={styles.container}>
        {timer_state.countdown &&
          displayHeaderAndCircle(
            'Get Ready!',
            'countdown',
            'hangTime',
            workoutDetails.countdown,
            AppColors.accent
          )}
        {timer_state.hangTime &&
          displayHeaderAndCircle(
            'Hang!',
            'hangTime',
            'restTime',
            workoutDetails.hangtime,
            'gold'
          )}
        {timer_state.restTime &&
          displayHeaderAndCircle(
            'Rest.',
            'restTime',
            'hangTime',
            workoutDetails.resttime,
            'grey'
          )}
        {timer_state.breakTime &&
          displayHeaderAndCircle(
            'Take a break!',
            'breakTime',
            'countdown',
            workoutDetails.breaktime,
            'purple'
          )}
        <View
          style={{
            backgroundColor: 'grey',
            width: '100%',
            height: 300,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              justifyContent: 'center',
              marginVertical: 10,
            }}
          >
            {visible && (
              <>
                <Text>Visible</Text>
                <EditModal
                  visible={visible}
                  workout_details={workoutDetails}
                  cancel={toggleModal}
                  save={onSave}
                />
              </>
            )}
            <Button title='Edit' onPress={() => toggleModal()} />
            <Button
              title='Start'
              onPress={() => {
                setHasStarted(true);
                setIsPaused(false);
              }}
            />

            <Button
              title='Pause'
              onPress={() => {
                setIsPaused(true);
                setHasStarted(false);
              }}
            />
            {complete && (
              <Button
                title='Replay'
                onPress={() => {
                  setCurrentRep(0);
                  setCurrentSet(1);
                  setIsPaused(false);
                  setHasStarted(true);
                  setComplete(false);
                  nextState('hangTime', 'countdown');
                }}
              />
            )}
          </View>

          {complete && (
            <View>
              <Text style={styles.txt}>COMPLETE!</Text>
            </View>
          )}
          {!complete && (
            <View>
              <Text style={styles.txt}>Workout In-Progress!</Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: '100%',
    height: '100%',
  },
  stateView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 20,
    color: AppColors.accent,
    textAlign: 'center',
  },
});
