import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const AddCar = ({navigation}) => {
  return (
    <View>
      <Text>This is add car screen</Text>
    </View>
  );
};

AddCar.propTypes = {
  navigation: PropTypes.object,
};

export default AddCar;
