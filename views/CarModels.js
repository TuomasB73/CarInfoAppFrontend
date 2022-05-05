import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModels} from '../hooks/ApiHooks';
import {Picker} from '@react-native-picker/picker';

const CarModels = ({navigation, route}) => {
  const {brand} = route.params;
  let carModelsArray = useLoadCarModels({
    brand: brand.id,
  }).sort((a, b) => a.fullModelName.name.localeCompare(b.fullModelName.name));
  const [carModelsArrayToDisplay, setCarModelsArrayToDisplay] = useState([]);
  const [modelPickerCarModelsArray, setModelPickerCarModelsArray] = useState(
    []
  );
  const [yearPickerCarModelsArray, setYearPickerCarModelsArray] = useState([]);
  const [selectedModelPickerValue, setSelectedModelPickerValue] = useState();
  const [selectedYearPickerValue, setSelectedYearPickerValue] = useState();
  let filteredCarModelsArray = [];

  // Depending which picker value is changed and if the other picker value is set, filter the array.
  const pickerItemSelected = (picker, itemValue) => {
    if (picker === 'modelPicker') {
      setSelectedModelPickerValue(itemValue);
      if (itemValue === 'All models') {
        if (selectedYearPickerValue && selectedYearPickerValue != 'All years') {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.year === selectedYearPickerValue
          );
        } else {
          filteredCarModelsArray = carModelsArray;
        }
      } else {
        if (selectedYearPickerValue && selectedYearPickerValue != 'All years') {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.model === itemValue && e.year === selectedYearPickerValue
          );
        } else {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.model === itemValue
          );
        }
      }
    } else {
      setSelectedYearPickerValue(itemValue);
      if (itemValue === 'All years') {
        if (
          selectedModelPickerValue &&
          selectedModelPickerValue != 'All models'
        ) {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.model === selectedModelPickerValue
          );
        } else {
          filteredCarModelsArray = carModelsArray;
        }
      } else {
        if (
          selectedModelPickerValue &&
          selectedModelPickerValue != 'All models'
        ) {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.year === itemValue && e.model === selectedModelPickerValue
          );
        } else {
          filteredCarModelsArray = carModelsArray.filter(
            (e) => e.year === itemValue
          );
        }
      }
    }
    setCarModelsArrayToDisplay(filteredCarModelsArray);
  };

  useEffect(() => {
    // Set values to the pickers
    setCarModelsArrayToDisplay(carModelsArray);
    const filteredByModelCarModelsArray = carModelsArray.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.model === value.model)
    );
    setModelPickerCarModelsArray(filteredByModelCarModelsArray);
    const filteredByYearCarModelsArray = carModelsArray.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.year === value.year)
    );
    setYearPickerCarModelsArray(filteredByYearCarModelsArray);
  }, [carModelsArray]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{brand.name}</Text>
      <Text style={styles.text}>Select a car model</Text>
      <View style={styles.pickersContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            mode="dropdown"
            selectedValue={selectedModelPickerValue}
            onValueChange={(itemValue, itemIndex) =>
              pickerItemSelected('modelPicker', itemValue)
            }
          >
            <Picker.Item label={'All models'} value={'All models'} />
            {modelPickerCarModelsArray.map((item, index) => {
              return (
                <Picker.Item
                  label={item.model}
                  value={item.model}
                  key={index}
                />
              );
            })}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            mode="dropdown"
            selectedValue={selectedYearPickerValue}
            onValueChange={(itemValue, itemIndex) =>
              pickerItemSelected('yearPicker', itemValue)
            }
          >
            <Picker.Item label={'All years'} value={'All years'} />
            {yearPickerCarModelsArray.map((item, index) => {
              return (
                <Picker.Item
                  label={item.year.toString()}
                  value={item.year}
                  key={index}
                />
              );
            })}
          </Picker>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={carModelsArrayToDisplay}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                navigation.navigate('Car info', {carId: item.id});
              }}
            >
              <Text style={styles.listItemText}>
                {item.model} ({item.year})
              </Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginTop: 34,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 12,
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  pickerContainer: {
    backgroundColor: '#d5e3eb',
    width: 160,
    borderRadius: 22,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    marginTop: 20,
    marginStart: 60,
    marginEnd: 60,
    padding: 8,
  },
  listItem: {
    backgroundColor: '#e6e6e6',
    margin: 4,
  },
  listItemText: {
    fontSize: 20,
    margin: 8,
  },
});

CarModels.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarModels;
