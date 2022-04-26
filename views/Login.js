import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const Login = ({navigation}) => {
  return (
    <View>
      <Text>This is login screen</Text>
    </View>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
