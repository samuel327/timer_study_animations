import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
  totalSets: 3,
  reps: 6,
};

export default function App() {
  const [timer_state, setTimerState] = useState({ ...countdownActive });

  function nextState(prevState: string, nextState: string) {
    setTimerState((prev: TIMER_STATES) => {
      let updated = { ...prev };
      updated[prevState] = false;
      updated[nextState] = true;
      return updated;
    });
  }

  return (
    <View style={styles.container}>
      {timer_state.countdown && (
        <CircularProgressBar
          setDone={() => {
            nextState('countdown', 'hangTime');
          }}
          workout_details={workout_details}
          duration={workout_details.countdown}
        />
      )}
      {timer_state.hangTime && (
        <CircularProgressBar
          color="blue"
          setDone={() => {
            nextState('hangTime', 'restTime');
          }}
          workout_details={workout_details}
          duration={workout_details.hangtime}
        />
      )}
      {timer_state.restTime && (
        <CircularProgressBar
          color="green"
          setDone={() => {
            nextState('restTime', 'hangTime');
          }}
          workout_details={workout_details}
          duration={workout_details.resttime}
        />
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
});
