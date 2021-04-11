import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CircularProgressBar } from './components/CircularProgressBar';

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
  breaktime: 60,
  totalSets: 2,
  reps: 3,
};

export default function App() {
  const [timer_state, setTimerState] = useState({ ...countdownActive });
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  function nextState(prevState: string, nextState: string) {
    setTimerState((prev: TIMER_STATES) => {
      let updated = { ...prev };
      updated[prevState] = false;
      updated[nextState] = true;
      return updated;
    });
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
        <View style={styles.headerView}>
          <Text>{title}</Text>
        </View>
        <View>
          <CircularProgressBar
            color={color}
            setDone={() => {
              determineNextState(prev, next);
            }}
            workout_details={workout_details}
            duration={duration}
            hasStarted={hasStarted}
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
          height: 500,
          borderRadius: 5,
        }}
      >
        <Button title='Start' onPress={() => setHasStarted(true)} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text>{`${currentSet} / ${workout_details.totalSets}`}</Text>
          <Text>{`${currentRep} / ${workout_details.reps}`}</Text>
        </View>

        {complete && (
          <View style={{ flex: 2 }}>
            <Text style={{ textAlign: 'center' }}>COMPLETE!</Text>
          </View>
        )}
        {!complete && (
          <View style={{ flex: 2 }}>
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
  headerView: { marginBottom: 25, alignItems: 'center' },
});
