import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>This is home screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
