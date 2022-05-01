import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

let variantObjectsArray = [{fuelType: 'gasoline'}];

const VariantFormCreator = () => {
  const [refreshVariantForms, setRefreshVariantForms] = useState(0);
  const [renderCopyArray, setRenderCopyArray] = useState([]);

  const addAnotherVariant = () => {
    variantObjectsArray.push({fuelType: 'gasoline'});
    setRefreshVariantForms(refreshVariantForms + 1);
  };

  useEffect(() => {
    setRenderCopyArray(variantObjectsArray);
  }, [refreshVariantForms]);

  return (
    <View>
      <FlatList
        listKey="variants"
        data={renderCopyArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <VariantFormObject variantFormObjectIndex={index} />
        )}
      ></FlatList>
      <TouchableOpacity style={styles.addButton} onPress={addAnotherVariant}>
        <Ionicons name="add" size={30} />
        <Text style={styles.addButtonText}>Add another variant</Text>
      </TouchableOpacity>
    </View>
  );
};

const VariantFormObject = ({variantFormObjectIndex}) => {
  const [selectedFuelType, setSelectedFuelType] = useState();

  const updateValue = (itemValue) => {
    setSelectedFuelType(itemValue);
    variantObjectsArray[variantFormObjectIndex].fuelType = itemValue;
  };

  const handleAddVariantInputChange = (field, value) => {
    variantObjectsArray[variantFormObjectIndex][field] = value;
  };

  return (
    <View style={styles.variantContainer}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedFuelType}
          onValueChange={(itemValue, itemIndex) => updateValue(itemValue)}
        >
          <Picker.Item label="gasoline" value="gasoline" />
          <Picker.Item label="diesel" value="diesel" />
          <Picker.Item label="hybrid" value="hybrid" />
          <Picker.Item label="plug-in hybrid" value="plug-in hybrid" />
          <Picker.Item label="electric" value="electric" />
          <Picker.Item label="hydrogen" value="hydrogen" />
          <Picker.Item label="ethanol" value="ethanol" />
        </Picker>
      </View>
      <TextInput
        placeholder="Engine displacement"
        onChangeText={(txt) =>
          handleAddVariantInputChange('engineDisplacement', txt)
        }
        style={styles.inputField}
      ></TextInput>
      <TextInput
        placeholder="Transmission"
        onChangeText={(txt) => handleAddVariantInputChange('transmission', txt)}
        style={styles.inputField}
      ></TextInput>
      <TextInput
        placeholder="Power (hp)"
        keyboardType="number-pad"
        onChangeText={(txt) =>
          handleAddVariantInputChange('powerHp', parseInt(txt))
        }
        style={styles.inputField}
      ></TextInput>
      <TextInput
        placeholder="Acceleration 0-100 km/h (s)"
        keyboardType="decimal-pad"
        onChangeText={(txt) =>
          handleAddVariantInputChange('acceleration0_100KmhS', parseFloat(txt))
        }
        style={styles.inputField}
      ></TextInput>
      <TextInput
        placeholder="Fuel consumption (L/100 km)"
        keyboardType="decimal-pad"
        onChangeText={(txt) =>
          handleAddVariantInputChange('fuelConsumptionL100Km', parseFloat(txt))
        }
        style={styles.inputField}
      ></TextInput>
      <TextInput
        placeholder="Co2 emissions (g/km)"
        keyboardType="number-pad"
        onChangeText={(txt) =>
          handleAddVariantInputChange('co2EmissionsGkm', parseInt(txt))
        }
        style={styles.inputField}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  variantContainer: {
    backgroundColor: '#d5e3eb',
    borderRadius: 10,
    margin: 10,
    padding: 4,
  },
  pickerContainer: {
    backgroundColor: 'lightgray',
    margin: 4,
  },
  inputField: {
    fontSize: 18,
    margin: 6,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'white',
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

const getAddedVariantObjects = () => {
  return variantObjectsArray;
};

VariantFormObject.propTypes = {
  variantFormObjectIndex: PropTypes.number,
};

export {VariantFormCreator, getAddedVariantObjects};
