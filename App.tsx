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

  return (
    <View style={styles.container}>
      {timer_state.countdown && (
        <View style={{ backgroundColor: 'yellow', width: 300 }}>
          <Text>Countdown</Text>
          <CircularProgressBar
            setDone={() => {
              nextState('countdown', 'hangTime');
            }}
            workout_details={workout_details}
            duration={workout_details.countdown}
          />
        </View>
      )}
      {timer_state.hangTime && (
        <View
          style={{
            backgroundColor: 'green',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text>Hang!</Text>
          </View>
          <View>
            <CircularProgressBar
              color="blue"
              setDone={() => {
                nextState('hangTime', 'restTime');
              }}
              workout_details={workout_details}
              duration={workout_details.hangtime}
            />
          </View>
        </View>
      )}
      {timer_state.restTime && (
        <View style={{ backgroundColor: 'orange', flex: 1 }}>
          <Text>Rest!</Text>
          <CircularProgressBar
            color="green"
            setDone={() => {
              nextState('restTime', 'hangTime');
            }}
            workout_details={workout_details}
            duration={workout_details.resttime}
          />
        </View>
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
