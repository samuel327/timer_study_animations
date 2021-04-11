import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CircularProgressBar } from './components/CircularProgressBar';
import { Audio } from 'expo-av';
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

const workout_details = {
  countdown: 10,
  hangtime: 7,
  resttime: 3,
  breaktime: 10,
  totalSets: 1,
  reps: 3,
};

export default function App() {
  const [timer_state, setTimerState] = useState({ ...countdownActive });
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  /*sounds*/
  const [beep_G2, setBeepG2] = useState<any>();
  useEffect(() => {
    console.log('GET G2!');
    getG2();
  }, []);

  async function getG2() {
    console.log('loading g2');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sounds/beep_G2.wav')
    );
    setBeepG2(sound);
  }

  async function playG2() {
    try {
      await beep_G2.replayAsync();
    } catch (e) {
      console.log('STATUS: ', beep_G2.getStatusAsync());
      console.log(e);
    }
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
    if (currentRep + 1 > workout_details.reps) {
      if (currentSet + 1 > workout_details.totalSets) {
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
    return (
      <View style={styles.stateView}>
        <View>
          <CircularProgressBar
            color={color}
            setDone={() => {
              determineNextState(prev, next);
            }}
            workout_details={workout_details}
            duration={duration}
            hasStarted={hasStarted}
            isPaused={isPaused}
            title={title}
            playG2={playG2}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {complete && <Text>COMPLETE!</Text>}
      {timer_state.countdown &&
        displayHeaderAndCircle(
          'Get Ready',
          'countdown',
          'hangTime',
          workout_details.countdown,
          'red'
        )}
      {timer_state.hangTime &&
        displayHeaderAndCircle(
          'Hang!',
          'hangTime',
          'restTime',
          workout_details.hangtime,
          'gold'
        )}
      {timer_state.restTime &&
        displayHeaderAndCircle(
          'Rest.',
          'restTime',
          'hangTime',
          workout_details.resttime,
          'grey'
        )}
      {timer_state.breakTime &&
        displayHeaderAndCircle(
          'Take a break!',
          'breakTime',
          'countdown',
          workout_details.breaktime,
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Text>{`${currentSet} / ${workout_details.totalSets}`}</Text>
          <Text>{`${currentRep} / ${workout_details.reps}`}</Text>
        </View>

        {complete && (
          <View>
            <Text style={{ textAlign: 'center' }}>COMPLETE!</Text>
          </View>
        )}
        {!complete && (
          <View>
            <Text style={{ textAlign: 'center' }}>Workout In-Progress!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
