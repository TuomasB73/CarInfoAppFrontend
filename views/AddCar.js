import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const AddCar = ({navigation}) => {
  return (
    <View>
      <Text>This is add car screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

AddCar.propTypes = {
  navigation: PropTypes.object,
};

export default AddCar;
