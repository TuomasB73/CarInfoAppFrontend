import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.androidSafeArea}>
      <Text>This is home screen</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
