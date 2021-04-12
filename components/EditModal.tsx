import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal, View, Text, StyleSheet, TextInput } from 'react-native';
import { Workout_Details_Props } from '../App';

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
      <View style={{ flexDirection: 'row' }}>
        <Text>{title}: </Text>
        <TextInput
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
    <Modal visible={visible}>
      <View style={styles.screen}>
        <Text>Workout Details: </Text>
        {displayInputSection('Countdown', 'countdown')}
        {displayInputSection('Hang time', 'hangtime')}
        {displayInputSection('Rest time', 'resttime')}
        {displayInputSection('break time', 'breaktime')}
        {displayInputSection('total sets', 'totalSets')}
        {displayInputSection('reps', 'reps')}
        <Button title='Cancel' onPress={cancel} />
        <Button title='Save' onPress={() => save(modalWorkoutDetails)} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
