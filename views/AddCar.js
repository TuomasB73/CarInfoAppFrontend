import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  BodyStylePickerCreator,
  getAddedBodyStyleNames,
} from '../components/BodyStylePickerCreator';
import {
  NumberOfDoorsPickerCreator,
  getAddedNumberOfDoorsNumbers,
} from '../components/NumberOfDoorsPickerCreator';
import {
  DrivetrainPickerCreator,
  getAddedDrivetrainNames,
} from '../components/DrivetrainPickerCreator';
import {Picker} from '@react-native-picker/picker';

const AddCar = ({navigation}) => {
  const [selectedFuelType, setSelectedFuelType] = useState();

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>
              Add a car model to the database
            </Text>
            <Text style={styles.text}>
              Please fill in the correct information
            </Text>
            <View style={styles.formContainer}>
              <TextInput
                placeholder="Brand"
                onChangeText={(txt) => handleAddCarInputChange('brand', txt)}
                style={styles.inputField}
              ></TextInput>
              <TextInput
                placeholder="Model"
                onChangeText={(txt) => handleAddCarInputChange('model', txt)}
                style={styles.inputField}
              ></TextInput>
              <TextInput
                placeholder="Year"
                keyboardType="number-pad"
                onChangeText={(txt) => handleAddCarInputChange('year', txt)}
                style={styles.inputField}
              ></TextInput>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Body style(s)</Text>
                <BodyStylePickerCreator></BodyStylePickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Number(s) of doors</Text>
                <NumberOfDoorsPickerCreator></NumberOfDoorsPickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Drivetrain(s)</Text>
                <DrivetrainPickerCreator></DrivetrainPickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Variant(s)</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedFuelType}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedFuelType(itemValue)
                    }
                  >
                    <Picker.Item label="gasoline" value="gasoline" />
                    <Picker.Item label="diesel" value="diesel" />
                    <Picker.Item label="hybrid" value="hybrid" />
                    <Picker.Item
                      label="plug-in hybrid"
                      value="plug-in hybrid"
                    />
                    <Picker.Item label="electric" value="electric" />
                    <Picker.Item label="hydrogen" value="hydrogen" />
                    <Picker.Item label="ethanol" value="ethanol" />
                  </Picker>
                </View>
                <TextInput
                  placeholder="Engine displacement"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('engineDisplacement', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
                <TextInput
                  placeholder="Transmission"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('transmission', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
                <TextInput
                  placeholder="Power (hp)"
                  keyboardType="number-pad"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('powerHp', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
                <TextInput
                  placeholder="Acceleration 0-100 km/h s"
                  keyboardType="decimal-pad"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('acceleration0_100KmhS', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
                <TextInput
                  placeholder="Fuel consumption"
                  keyboardType="decimal-pad"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('fuelConsumptionL100Km', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
                <TextInput
                  placeholder="Co2 emissions (g/km)"
                  keyboardType="number-pad"
                  onChangeText={(txt) =>
                    handleAddCarInputChange('co2EmissionsGkm', txt)
                  }
                  style={styles.inputField}
                ></TextInput>
              </View>

              <Button title="Save"></Button>
            </View>
          </>
        }
      ></FlatList>
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
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    marginTop: 20,
    marginStart: 60,
    marginEnd: 60,
    padding: 8,
  },
  inputField: {
    fontSize: 18,
    margin: 6,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sectionContainer: {
    backgroundColor: '#d0d8db',
    margin: 4,
  },
});

AddCar.propTypes = {
  navigation: PropTypes.object,
};

export default AddCar;
