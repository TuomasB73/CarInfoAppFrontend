import React from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadReviews} from '../hooks/ApiHooks';

const Reviews = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const reviewsArray = useLoadReviews({car: carId});

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
                  navigation.navigate('Add review', {carId, carModelName});
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
                      <Text style={styles.usernameText}>
                        {item.user.nickname}
                      </Text>
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
  usernameText: {
    fontSize: 20,
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
