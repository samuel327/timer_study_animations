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
import { AppColors } from '../constants/AppColors';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export function CircularProgressBar(props: any) {
  const [percentage, setPercentage] = useState<number>(100);
  const [duration, setDuration] = useState<any>(props?.duration);
  const radius = 100;
  const strokeWidth = 10;
  //const duration = 500;
  const color = props.color || 'red';
  const delay = 0;
  const max = 100;
  const textColor = 'blue';
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>();
  const timer = useRef<any>(null);

  const animation = (toValue: any, duration: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration: duration * 1000,
      delay,
      useNativeDriver: true,
    }).start(() => {
      if (Number.parseInt(JSON.stringify(animatedValue)) === 100) {
        props.setDone();
      }
    });
  };

  useEffect(() => {
    if (props.hasStarted && !props.isPaused) {
      animation(percentage, props?.duration);
      setTimer();
      animatedValue.addListener((v) => {
        if (circleRef?.current) {
          const maxPerc = (100 * v.value) / max;
          const strokeDashoffset =
            circleCircumference - (circleCircumference * maxPerc) / 100;
          circleRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      });
    }
    if (props.isReset) {
      animatedValue.setValue(0);
      props.setIsReset(false);
    }
    if (props.isPaused) {
      animatedValue.stopAnimation((e) => {
        clearInterval(timer.current);
      });
    }

    if (props?.duration !== duration && props.isPaused) {
      setDuration(props?.duration);
      animatedValue.setValue(0);
    }
    return () => {
      animatedValue.removeAllListeners();
      clearInterval(timer.current);
    };
  }, [props.hasStarted, props.isPaused, props?.duration, props?.isReset]);

  function setTimer() {
    timer.current = setInterval(() => {
      setDuration((prev: any) => {
        if (prev - 1 >= 0) {
          let num = prev - 1;
          if (num <= 3) {
            props?.playG2();
          }
          return num;
        } else {
          clearInterval(timer.current);
          return 0;
        }
      });
    }, 1000);
  }

  return (
    <View style={styles.container}>
      {props?.title && <Text style={styles.title}>{props.title}</Text>}
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx='50%'
            cy='50%'
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill='transparent'
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            ref={circleRef}
            cx='50%'
            cy='50%'
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill='transparent'
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap={'round'}
          />
        </G>
      </Svg>

      <AnimatedInput
        underlineColorAndroid='transparent'
        editable={false}
        value={duration.toString()}
        style={[
          StyleSheet.absoluteFillObject,
          {
            fontSize: radius / 2,
            color: AppColors.accent,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.primary,
  },
  txtInput: {},
  title: {
    color: AppColors.accent,
    fontSize: 20,
  },
});
