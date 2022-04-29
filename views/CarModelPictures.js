import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const CarModelPictures = ({navigation, route}) => {
  const {carId} = route.params;

  return (
    <View>
      <Text>This is car model pictures screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

CarModelPictures.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarModelPictures;
