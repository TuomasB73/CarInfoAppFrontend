import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

let drivetrainNamesArray;

const DrivetrainPickerCreator = ({drivetrains}) => {
  const [refreshDrivetrainPickers, setRefreshDrivetrainPickers] = useState(0);
  const [renderCopyArray, setRenderCopyArray] = useState([]);

  const addAnotherDrivetrain = () => {
    drivetrainNamesArray.push('front-wheel drive');
    setRefreshDrivetrainPickers(refreshDrivetrainPickers + 1);
  };

  useEffect(() => {
    if (refreshDrivetrainPickers === 0) {
      drivetrainNamesArray = drivetrains;
    }
    setRenderCopyArray(drivetrainNamesArray);
  }, [refreshDrivetrainPickers]);

  return (
    <View>
      <FlatList
        listKey="drivetrains"
        data={renderCopyArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <DrivetrainPickerObject
            drivetrainPickerObjectIndex={index}
            drivetrainPickerObjectValue={item}
          />
        )}
      ></FlatList>
      <TouchableOpacity style={styles.addButton} onPress={addAnotherDrivetrain}>
        <Ionicons name="add" size={30} />
        <Text style={styles.addButtonText}>Add another drivetrain</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrivetrainPickerObject = ({
  drivetrainPickerObjectIndex,
  drivetrainPickerObjectValue,
}) => {
  const [selectedDrivetrain, setSelectedDrivetrain] = useState();

  const updateValue = (itemValue) => {
    setSelectedDrivetrain(itemValue);
    drivetrainNamesArray[drivetrainPickerObjectIndex] = itemValue;
  };

  useEffect(() => {
    if (drivetrainPickerObjectValue) {
      setSelectedDrivetrain(drivetrainPickerObjectValue);
    }
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedDrivetrain}
        onValueChange={(itemValue, itemIndex) => updateValue(itemValue)}
      >
        <Picker.Item label="front-wheel drive" value="front-wheel drive" />
        <Picker.Item label="rear-wheel drive" value="rear-wheel drive" />
        <Picker.Item label="four-wheel drive" value="four-wheel drive" />
        <Picker.Item label="all-wheel drive" value="all-wheel drive" />
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

const getAddedDrivetrainNames = () => {
  return drivetrainNamesArray;
};

DrivetrainPickerCreator.propTypes = {
  drivetrains: PropTypes.array,
};

DrivetrainPickerObject.propTypes = {
  drivetrainPickerObjectIndex: PropTypes.number,
  drivetrainPickerObjectValue: PropTypes.string,
};

export {DrivetrainPickerCreator, getAddedDrivetrainNames};
