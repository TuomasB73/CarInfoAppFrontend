import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import useAddPictureForm from '../hooks/AddPictureHooks';
import {useCar, usePicture} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {StackActions} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const AddPicture = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const {addPictureInputs, handleAddPictureInputChange} = useAddPictureForm();
  const {postPicture} = usePicture();
  const {updatePictures, setUpdatePictures} = useContext(MainContext);
  const {postCarImage} = useCar();
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');

  const savePicture = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const imageFilename = await postCarImage(image, fileType, userToken);
      const addedPicture = await postPicture(
        {car: carId, imageFilename, ...addPictureInputs},
        userToken
      );
      if (addedPicture) {
        const popAction = StackActions.pop();
        navigation.dispatch(popAction);
        setUpdatePictures(updatePictures + 1);
      } else {
        Alert.alert('Error in saving picture');
      }
    } catch (e) {
      console.log('savePicture error', e.message);
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
      <Text style={styles.titleText}>Add a picture</Text>
      <Text style={styles.text}>{carModelName}</Text>
      <TextInput
        placeholder="Picture text"
        onChangeText={(txt) => handleAddPictureInputChange('text', txt)}
        style={styles.inputField}
      ></TextInput>
      <View style={styles.chooseImageContainer}>
        <TouchableOpacity
          style={styles.chooseImageButton}
          onPress={chooseImage}
        >
          <Text style={styles.text}>Choose an image</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: image}}
            style={styles.image}
            resizeMode="contain"
          ></Image>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={savePicture}></Button>
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
    fontSize: 20,
    textAlign: 'center',
    margin: 12,
  },
  inputField: {
    fontSize: 18,
    margin: 20,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  chooseImageContainer: {
    backgroundColor: '#d0d8db',
    borderRadius: 10,
    margin: 20,
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
    width: '60%',
    height: 100,
    margin: 10,
  },
  buttonContainer: {
    margin: 50,
  },
});

AddPicture.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default AddPicture;
