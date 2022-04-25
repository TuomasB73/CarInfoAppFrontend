import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const AllPictures = ({navigation}) => {
  return (
    <View>
      <Text>This is all pictures screen</Text>
    </View>
  );
};

AllPictures.propTypes = {
  navigation: PropTypes.object,
};

export default AllPictures;
