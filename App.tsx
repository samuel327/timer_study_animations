import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CircularProgressBar } from './components/CircularProgressBar';

interface TIMER_STATES {
  [x: string]: boolean;
  countdown: boolean;
  hangTime: boolean;
  restTime: boolean;
}
const countdownActive: TIMER_STATES = {
  countdown: true,
  hangTime: false,
  restTime: false,
};

const workout_details = {
  countdown: 10,
  hangtime: 7,
  resttime: 3,
  breaktime: 60,
  totalSets: 1,
  reps: 3,
};

export default function App() {
  const [timer_state, setTimerState] = useState({ ...countdownActive });
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);

  function nextState(prevState: string, nextState: string) {
    setTimerState((prev: TIMER_STATES) => {
      let updated = { ...prev };
      updated[prevState] = false;
      updated[nextState] = true;
      return updated;
    });
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
              nextState(prev, next);
            }}
            workout_details={workout_details}
            duration={duration}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          'Rest',
          'restTime',
          'hangTime',
          workout_details.resttime,
          'grey'
        )}
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
