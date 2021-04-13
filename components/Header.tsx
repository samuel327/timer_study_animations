import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Workout_Details_Props } from '../App';
import { AppColors } from '../constants/AppColors';

interface HeaderProps {
  workoutDetails: Workout_Details_Props;
  currentSet: number;
  currentRep: number;
}
export const Header = (props: HeaderProps) => {
  const { workoutDetails, currentSet, currentRep } = props;
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.txt}>
          Sets: {currentSet}/{workoutDetails.totalSets}
        </Text>
        <Text style={styles.txt}>
          Reps: {currentRep}/{workoutDetails.reps}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textView: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  txt: {
    fontSize: 30,
    color: AppColors.accent,
  },
});
