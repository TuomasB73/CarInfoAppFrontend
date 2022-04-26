import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const Reviews = ({navigation}) => {
  return (
    <View>
      <Text>This is reviews screen</Text>
    </View>
  );
};

Reviews.propTypes = {
  navigation: PropTypes.object,
};

export default Reviews;
