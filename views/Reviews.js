import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadReviews} from '../hooks/ApiHooks';
import {useReview} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';

const Reviews = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const reviewsArray = useLoadReviews({car: carId});
  const {isLoggedIn, updateReviews, setUpdateReviews, user} =
    useContext(MainContext);
  const {deleteReview} = useReview();

  const deleteMyReview = async (reviewId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const deletedReview = await deleteReview(
        {deleteMyReviewId: reviewId},
        userToken
      );
      if (deletedReview) {
        setUpdateReviews(updateReviews + 1);
      }
    } catch (e) {
      console.log('deleteReview error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>{carModelName}</Text>
            <Text style={styles.text}>User reviews</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Add a review"
                onPress={() => {
                  if (isLoggedIn) {
                    navigation.navigate('Add review', {carId, carModelName});
                  } else {
                    Alert.alert('You must login/register to add a review');
                  }
                }}
              ></Button>
            </View>
            <View style={styles.listContainer}>
              {reviewsArray.length > 0 ? (
                <FlatList
                  data={reviewsArray.reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View style={styles.reviewContainer}>
                      <View style={styles.userContainer}>
                        <Text style={styles.usernameText}>
                          {item.user.nickname}
                        </Text>
                        {user.id === item.user.id && (
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {
                              Alert.alert(
                                'Delete',
                                'Are you sure you want to delete this review?',
                                [
                                  {
                                    text: 'Cancel',
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Delete',
                                    onPress: () => deleteMyReview(item.id),
                                  },
                                ],
                                {cancelable: false}
                              );
                            }}
                          >
                            <Ionicons name="trash" size={30} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <Text style={styles.reviewText}>{item.text}</Text>
                    </View>
                  )}
                ></FlatList>
              ) : (
                <Text style={styles.text}>No reviews for this car yet</Text>
              )}
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
    marginTop: 34,
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    margin: 12,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 10,
  },
  listContainer: {
    backgroundColor: '#d5e3eb',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  reviewContainer: {
    backgroundColor: 'lightblue',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usernameText: {
    fontSize: 20,
  },
  iconButton: {
    margin: 4,
  },
  reviewText: {
    fontSize: 16,
    margin: 4,
  },
});

Reviews.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Reviews;
