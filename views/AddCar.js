import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableOpacity,
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
import {
  VariantFormCreator,
  getAddedVariantObjects,
} from '../components/VariantFormCreator';
import useAddCarForm from '../hooks/AddCarHooks';
import {useCar} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {CommonActions} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const AddCar = ({navigation}) => {
  const {addCarInputs, handleAddCarInputChange} = useAddCarForm();
  const {postCar, postCarImage} = useCar();
  const {updateBrands, setUpdateBrands} = useContext(MainContext);
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');

  const saveCar = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const defaultImageFilename = await postCarImage(
        image,
        fileType,
        userToken
      );
      const addCarFormData = {
        ...addCarInputs,
        bodyStyles: getAddedBodyStyleNames(),
        numbersOfDoors: getAddedNumberOfDoorsNumbers(),
        drivetrains: getAddedDrivetrainNames(),
        variants: getAddedVariantObjects(),
        defaultImageFilename,
      };
      const addedCar = await postCar(addCarFormData, userToken);
      if (addedCar) {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Add car'}],
        });
        navigation.dispatch(resetAction);
        setUpdateBrands(updateBrands + 1);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error in saving car');
      }
    } catch (error) {
      console.error('saveCar error', error.message);
    }
  };

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setFileType(result.type);
      setImage(result.uri);
    }
  };

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
                onChangeText={(txt) =>
                  handleAddCarInputChange('year', parseInt(txt))
                }
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
                <VariantFormCreator></VariantFormCreator>
              </View>
              <View style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.chooseImageButton}
                  onPress={chooseImage}
                >
                  <Text style={styles.text}>Choose a default image</Text>
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: image}}
                    style={styles.image}
                    resizeMode="contain"
                  ></Image>
                </View>
              </View>
              <View style={styles.saveButton}>
                <Button title="Save" onPress={saveCar}></Button>
              </View>
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
    margin: 20,
    marginStart: 36,
    marginEnd: 36,
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
  chooseImageButton: {
    backgroundColor: '#72b1d6',
    borderRadius: 10,
    margin: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#d5e3eb',
    borderRadius: 10,
    margin: 10,
  },
  image: {
    width: '40%',
    height: 60,
    margin: 10,
  },
  saveButton: {
    margin: 20,
  },
});

AddCar.propTypes = {
  navigation: PropTypes.object,
};

export default AddCar;
