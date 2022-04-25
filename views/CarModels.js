import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const CarModels = ({navigation}) => {
  return (
    <View>
      <Text>This is car models screen</Text>
    </View>
  );
};

CarModels.propTypes = {
  navigation: PropTypes.object,
};

export default CarModels;
