import React, { useEffect, useRef } from 'react';
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
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgressBar(props: any) {
  const percentage = 100;
  const radius = 40;
  const strokeWidth = 10;
  const duration = 500;
  const color = props.color || 'red';
  const delay = 0;
  const max = 100;
  const textColor = 'blue';
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>();
  const animation = (toValue: any, duration: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration: duration * 1000,
      delay,
      useNativeDriver: true,
    }).start(() => {
      props?.setDone();
    });
  };

  useEffect(() => {
    if (props.hasStarted) {
      animation(percentage, props?.duration);

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

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [props.hasStarted]);

  return (
    <View style={styles.container}>
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
