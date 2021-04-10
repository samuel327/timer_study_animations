import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { CircularProgressBar } from './components/CircularProgressBar';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App() {
  const [timer_state, setTimerState] = useState({
    countdown: true,
    hangTime: false,
    restTime: false,
  });

  return (
    <View style={styles.container}>
      {timer_state.countdown && (
        <CircularProgressBar
          setDone={() => {
            setTimerState(() => {
              return {
                countdown: false,
                hangTime: true,
                restTime: false,
              };
            });
          }}
        />
      )}
      {timer_state.hangTime && (
        <CircularProgressBar
          color="blue"
          setDone={() => {
            setTimerState(() => {
              return {
                countdown: false,
                hangTime: false,
                restTime: true,
              };
            });
          }}
        />
      )}
      {timer_state.restTime && (
        <CircularProgressBar
          color="green"
          setDone={() => {
            setTimerState(() => {
              return {
                countdown: false,
                hangTime: true,
                restTime: false,
              };
            });
          }}
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
