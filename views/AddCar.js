import React, {useContext, useState, useEffect} from 'react';
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
  Platform,
  ActivityIndicator,
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
  const {isLoggedIn, updateBrands, setUpdateBrands} = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');
  const [bodyStylePickerInitialValue, setBodyStylePickerInitialValue] =
    useState(['hatchback']);
  const [numberOfDoorsPickerInitialValue, setNumberOfDoorsPickerInitialValue] =
    useState([1]);
  const [drivetrainPickerInitialValue, setDrivetrainPickerInitialValue] =
    useState(['front-wheel drive']);
  const [variantFormInitialValue, setVariantFormInitialValue] = useState([
    {fuelType: 'gasoline'},
  ]);

  const saveCar = async () => {
    setIsLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      let defaultImageFilename;
      if (image) {
        defaultImageFilename = await postCarImage(image, fileType, userToken);
      }
      const addCarFormData = {
        ...addCarInputs,
        bodyStyles: getAddedBodyStyleNames(),
        numbersOfDoors: getAddedNumberOfDoorsNumbers(),
        drivetrains: getAddedDrivetrainNames(),
        variants: getAddedVariantObjects(),
      };
      if (defaultImageFilename) {
        addCarFormData.defaultImageFilename = defaultImageFilename;
      }
      const addedCar = await postCar(addCarFormData, userToken);
      setIsLoading(false);
      if (addedCar) {
        setBodyStylePickerInitialValue(['hatchback']);
        setNumberOfDoorsPickerInitialValue([1]);
        setDrivetrainPickerInitialValue(['front-wheel drive']);
        setVariantFormInitialValue([{fuelType: 'gasoline'}]);

        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Add car'}],
        });
        navigation.dispatch(resetAction);
        navigation.navigate('Home');
        setUpdateBrands(updateBrands + 1);
      } else {
        Alert.alert('Error in saving car');
      }
    } catch (error) {
      setIsLoading(false);
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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Camera roll permissions are required for choosing an image!');
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
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
                  <BodyStylePickerCreator
                    bodyStyles={bodyStylePickerInitialValue}
                  ></BodyStylePickerCreator>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.text}>Number(s) of doors</Text>
                  <NumberOfDoorsPickerCreator
                    numbersOfDoors={numberOfDoorsPickerInitialValue}
                  ></NumberOfDoorsPickerCreator>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.text}>Drivetrain(s)</Text>
                  <DrivetrainPickerCreator
                    drivetrains={drivetrainPickerInitialValue}
                  ></DrivetrainPickerCreator>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.text}>Variant(s)</Text>
                  <VariantFormCreator
                    variants={variantFormInitialValue}
                  ></VariantFormCreator>
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
                  {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                  ) : (
                    <Button title="Save" onPress={saveCar}></Button>
                  )}
                </View>
              </View>
            </>
          }
        ></FlatList>
      ) : (
        <Text style={styles.loginPromptText}>
          You must login/register to add a car
        </Text>
      )}
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
  loginPromptText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 40,
  },
});

AddCar.propTypes = {
  navigation: PropTypes.object,
};

export default AddCar;
