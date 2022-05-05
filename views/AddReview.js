import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import useAddReviewForm from '../hooks/AddReviewHooks';
import {useReview} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {StackActions} from '@react-navigation/native';

const AddReview = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const {addReviewInputs, handleAddReviewInputChange} = useAddReviewForm();
  const {postReview} = useReview();
  const {updateReviews, setUpdateReviews} = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(false);

  const saveReview = async () => {
    // If required fields are empty, an alert will be shown.
    if (Object.values(addReviewInputs).some((x) => x === '')) {
      Alert.alert('Review text can not be empty.');
    } else {
      setIsLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const addedReview = await postReview(
          {car: carId, ...addReviewInputs},
          userToken
        );
        setIsLoading(false);
        if (addedReview) {
          const popAction = StackActions.pop();
          navigation.dispatch(popAction);
          setUpdateReviews(updateReviews + 1);
        } else {
          Alert.alert('Error in saving review');
        }
      } catch (e) {
        setIsLoading(false);
        console.log('saveReview error', e.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Add a review</Text>
      <Text style={styles.text}>{carModelName}</Text>
      <TextInput
        placeholder="Review text"
        onChangeText={(txt) => handleAddReviewInputChange('text', txt)}
        style={styles.inputField}
        multiline={true}
      ></TextInput>
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <Button title="Save" onPress={saveReview}></Button>
        )}
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
    margin: 26,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    height: 260,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    margin: 10,
    marginStart: 50,
    marginEnd: 50,
  },
});

AddReview.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default AddReview;
