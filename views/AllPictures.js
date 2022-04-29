import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const AllPictures = ({navigation}) => {
  return (
    <View>
      <Text>This is all pictures screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

AllPictures.propTypes = {
  navigation: PropTypes.object,
};

export default AllPictures;
