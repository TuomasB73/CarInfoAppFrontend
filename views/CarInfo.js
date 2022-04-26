import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const CarInfo = ({navigation}) => {
  return (
    <View>
      <Text>This is car info screen</Text>
    </View>
  );
};

CarInfo.propTypes = {
  navigation: PropTypes.object,
};

export default CarInfo;
