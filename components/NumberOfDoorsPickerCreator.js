import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

let numberOfDoorsNumbersArray = [1];

const NumberOfDoorsPickerCreator = ({numbersOfDoors}) => {
  const [refreshNumberOfDoorsPickers, setRefreshNumberOfDoorsPickers] =
    useState(0);
  const [renderCopyArray, setRenderCopyArray] = useState([]);

  const addAnotherNumberOfDoors = () => {
    numberOfDoorsNumbersArray.push(1);
    setRefreshNumberOfDoorsPickers(refreshNumberOfDoorsPickers + 1);
  };

  useEffect(() => {
    if (numbersOfDoors && refreshNumberOfDoorsPickers === 0) {
      numberOfDoorsNumbersArray = numbersOfDoors;
    }
    setRenderCopyArray(numberOfDoorsNumbersArray);
  }, [refreshNumberOfDoorsPickers]);

  return (
    <View>
      <FlatList
        listKey="numbersOfDoors"
        data={renderCopyArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <NumberOfDoorsPickerObject
            numberOfDoorsPickerObjectIndex={index}
            numberOfDoorsPickerObjectValue={item}
          />
        )}
      ></FlatList>
      <TouchableOpacity
        style={styles.addButton}
        onPress={addAnotherNumberOfDoors}
      >
        <Ionicons name="add" size={30} />
        <Text style={styles.addButtonText}>Add another number of doors</Text>
      </TouchableOpacity>
    </View>
  );
};

const NumberOfDoorsPickerObject = ({
  numberOfDoorsPickerObjectIndex,
  numberOfDoorsPickerObjectValue,
}) => {
  const [selectedNumberOfDoors, setSelectedNumberOfDoors] = useState();

  const updateValue = (itemValue) => {
    setSelectedNumberOfDoors(itemValue);
    numberOfDoorsNumbersArray[numberOfDoorsPickerObjectIndex] = itemValue;
  };

  useEffect(() => {
    if (numberOfDoorsPickerObjectValue) {
      setSelectedNumberOfDoors(numberOfDoorsPickerObjectValue);
    }
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedNumberOfDoors}
        onValueChange={(itemValue, itemIndex) => updateValue(itemValue)}
      >
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        <Picker.Item label="4" value={4} />
        <Picker.Item label="5" value={5} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: 'lightgray',
    margin: 4,
  },
  addButton: {
    flexDirection: 'row',
    margin: 4,
    justifyContent: 'center',
  },
  addButtonText: {
    alignSelf: 'center',
  },
});

const getAddedNumberOfDoorsNumbers = () => {
  return numberOfDoorsNumbersArray;
};

NumberOfDoorsPickerCreator.propTypes = {
  numbersOfDoors: PropTypes.array,
};

NumberOfDoorsPickerObject.propTypes = {
  numberOfDoorsPickerObjectIndex: PropTypes.number,
  numberOfDoorsPickerObjectValue: PropTypes.number,
};

export {NumberOfDoorsPickerCreator, getAddedNumberOfDoorsNumbers};
