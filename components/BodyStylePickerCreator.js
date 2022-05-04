import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

let bodyStyleNamesArray;

const BodyStylePickerCreator = ({bodyStyles}) => {
  const [refreshBodyStylePickers, setRefreshBodyStylePickers] = useState(0);
  const [renderCopyArray, setRenderCopyArray] = useState([]);

  const addAnotherBodyStyle = () => {
    bodyStyleNamesArray.push('hatchback');
    setRefreshBodyStylePickers(refreshBodyStylePickers + 1);
  };

  useEffect(() => {
    if (refreshBodyStylePickers === 0) {
      bodyStyleNamesArray = bodyStyles;
    }
    setRenderCopyArray(bodyStyleNamesArray);
  }, [refreshBodyStylePickers]);

  return (
    <View>
      <FlatList
        listKey="bodyStyles"
        data={renderCopyArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <BodyStylePickerObject
            bodyStylePickerObjectIndex={index}
            bodyStylePickerObjectValue={item}
          />
        )}
      ></FlatList>
      <TouchableOpacity style={styles.addButton} onPress={addAnotherBodyStyle}>
        <Ionicons name="add" size={30} />
        <Text style={styles.addButtonText}>Add another body style</Text>
      </TouchableOpacity>
    </View>
  );
};

const BodyStylePickerObject = ({
  bodyStylePickerObjectIndex,
  bodyStylePickerObjectValue,
}) => {
  const [selectedBodyStyle, setSelectedBodyStyle] = useState();

  const updateValue = (itemValue) => {
    setSelectedBodyStyle(itemValue);
    bodyStyleNamesArray[bodyStylePickerObjectIndex] = itemValue;
  };

  useEffect(() => {
    if (bodyStylePickerObjectValue) {
      setSelectedBodyStyle(bodyStylePickerObjectValue);
    }
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <Picker
        mode="dropdown"
        selectedValue={selectedBodyStyle}
        onValueChange={(itemValue, itemIndex) => updateValue(itemValue)}
      >
        <Picker.Item label="hatchback" value="hatchback" />
        <Picker.Item label="sedan" value="sedan" />
        <Picker.Item label="coupe" value="coupe" />
        <Picker.Item label="wagon" value="wagon" />
        <Picker.Item label="SUV" value="SUV" />
        <Picker.Item label="truck" value="truck" />
        <Picker.Item label="sports car" value="sports car" />
        <Picker.Item label="convertible" value="convertible" />
        <Picker.Item label="minivan" value="minivan" />
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

const getAddedBodyStyleNames = () => {
  return bodyStyleNamesArray;
};

BodyStylePickerCreator.propTypes = {
  bodyStyles: PropTypes.array,
};

BodyStylePickerObject.propTypes = {
  bodyStylePickerObjectIndex: PropTypes.number,
  bodyStylePickerObjectValue: PropTypes.string,
};

export {BodyStylePickerCreator, getAddedBodyStyleNames};
