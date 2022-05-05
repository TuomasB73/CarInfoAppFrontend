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
import useEditCarForm from '../hooks/EditCarHooks';
import {useCar} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {StackActions} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const EditCar = ({navigation, route}) => {
  const {carModel} = route.params;
  const {editCarInputs, handleEditCarInputChange} = useEditCarForm();
  const {modifyCar, postCarImage} = useCar();
  const [isLoading, setIsLoading] = useState(false);
  const {
    updateBrands,
    setUpdateBrands,
    updateCarModels,
    setUpdateCarModels,
    updateCarModel,
    setUpdateCarModel,
  } = useContext(MainContext);
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');

  const saveCar = async () => {
    if (Object.values(editCarInputs).some((x) => x === '')) {
      Alert.alert('Brand, model and year fields are required.');
    } else {
      setIsLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        let defaultImageFilename;
        if (image) {
          defaultImageFilename = await postCarImage(image, fileType, userToken);
        }
        const editCarFormData = {
          modifyCarId: carModel.id,
          ...editCarInputs,
          bodyStyles: getAddedBodyStyleNames(),
          numbersOfDoors: getAddedNumberOfDoorsNumbers(),
          drivetrains: getAddedDrivetrainNames(),
          variants: getAddedVariantObjects(),
        };
        if (defaultImageFilename) {
          editCarFormData.defaultImageFilename = defaultImageFilename;
        }
        const editedCar = await modifyCar(editCarFormData, userToken);
        setIsLoading(false);
        if (editedCar) {
          const popAction = StackActions.pop();
          navigation.dispatch(popAction);
          setUpdateCarModel(updateCarModel + 1);
          setUpdateBrands(updateBrands + 1);
          setUpdateCarModels(updateCarModels + 1);
        } else {
          Alert.alert(
            'Error in saving edited car info',
            'This car already exists.'
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.error('saveCar error', error.message);
      }
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
    handleEditCarInputChange('brand', carModel.brand.name);
    handleEditCarInputChange('model', carModel.model);
    handleEditCarInputChange('year', carModel.year);

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
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>Edit car info</Text>
            <Text style={styles.text}>
              Please fill in the correct information
            </Text>
            <View style={styles.formContainer}>
              <TextInput
                placeholder="Brand"
                defaultValue={carModel.brand.name}
                onChangeText={(txt) => handleEditCarInputChange('brand', txt)}
                style={styles.inputField}
              ></TextInput>
              <TextInput
                placeholder="Model"
                defaultValue={carModel.model}
                onChangeText={(txt) => handleEditCarInputChange('model', txt)}
                style={styles.inputField}
              ></TextInput>
              <TextInput
                placeholder="Year"
                defaultValue={carModel.year.toString()}
                keyboardType="number-pad"
                onChangeText={(txt) =>
                  handleEditCarInputChange('year', parseInt(txt))
                }
                style={styles.inputField}
              ></TextInput>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Body style(s)</Text>
                <BodyStylePickerCreator
                  bodyStyles={carModel.bodyStyles}
                ></BodyStylePickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Number(s) of doors</Text>
                <NumberOfDoorsPickerCreator
                  numbersOfDoors={carModel.numbersOfDoors}
                ></NumberOfDoorsPickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Drivetrain(s)</Text>
                <DrivetrainPickerCreator
                  drivetrains={carModel.drivetrains}
                ></DrivetrainPickerCreator>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.text}>Variant(s)</Text>
                <VariantFormCreator
                  variants={carModel.variants}
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

EditCar.propTypes = {
  navigation: PropTypes.object,
};

export default EditCar;
