import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal, View, Text, StyleSheet, TextInput } from 'react-native';
import { Workout_Details_Props } from '../App';
import { AppColors } from '../constants/AppColors';

interface EditModalProps {
  visible: boolean;
  workout_details: Workout_Details_Props;
  cancel: () => void;
  save: (details: Workout_Details_Props) => void;
}
export const EditModal = (props: EditModalProps) => {
  const { cancel, visible, workout_details, save } = props;

  const [
    modalWorkoutDetails,
    setModalWorkoutDetails,
  ] = useState<Workout_Details_Props>({ ...workout_details });

  function displayInputSection(title: string, field: string) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.text}>{title}: </Text>
        <TextInput
          style={styles.text}
          onChangeText={(text: string) => {
            setModalWorkoutDetails((prev: Workout_Details_Props) => {
              let updated = { ...prev };
              updated[field] = Number(text);

              return updated;
            });
          }}
          keyboardType={'numeric'}
        >
          {workout_details[field]}
        </TextInput>
      </View>
    );
  }
  return (
    <Modal visible={visible} animationType='slide'>
      <View style={styles.screen}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Workout Details: </Text>
        </View>

        <View style={styles.workoutDetailsSection}>
          {displayInputSection('Countdown', 'countdown')}
          {displayInputSection('Hang time', 'hangtime')}
          {displayInputSection('Rest time', 'resttime')}
          {displayInputSection('break time', 'breaktime')}
          {displayInputSection('total sets', 'totalSets')}
          {displayInputSection('reps', 'reps')}
        </View>
        <View style={styles.modalBtns}>
          <Button title='Cancel' onPress={cancel} />
          <Button title='Save' onPress={() => save(modalWorkoutDetails)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
  },
  titleView: {},
  title: {
    fontSize: 20,
    color: AppColors.accent,
  },
  text: {
    fontSize: 16,
    color: AppColors.accent,
    marginVertical: 5,
  },
  workoutDetailsSection: {
    width: '50%',
    marginVertical: 100,
  },
  modalBtns: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
