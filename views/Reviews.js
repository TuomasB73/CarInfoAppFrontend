import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const Reviews = ({navigation, route}) => {
  const {carId} = route.params;

  return (
    <View>
      <Text>This is reviews screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

Reviews.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Reviews;
