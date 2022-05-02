import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';
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

  const saveReview = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const addedReview = await postReview(
        {car: carId, ...addReviewInputs},
        userToken
      );
      if (addedReview) {
        const popAction = StackActions.pop();
        navigation.dispatch(popAction);
        setUpdateReviews(updateReviews + 1);
      } else {
        Alert.alert('Error in saving review');
      }
    } catch (e) {
      console.log('saveReview error', e.message);
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
        <Button title="Save" onPress={saveReview}></Button>
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
    margin: 50,
  },
});

AddReview.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default AddReview;
