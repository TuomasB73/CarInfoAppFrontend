import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const CarModelPictures = ({navigation}) => {
  return (
    <View>
      <Text>This is car model pictures screen</Text>
    </View>
  );
};

CarModelPictures.propTypes = {
  navigation: PropTypes.object,
};

export default CarModelPictures;
