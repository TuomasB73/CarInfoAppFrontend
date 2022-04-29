import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const Variant = ({navigation, variantIndex, variant}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.variantTitle}>Variant {variantIndex + 1}</Text>
      <Text style={styles.text}>Fuel type: {variant.fuelType}</Text>
      <Text style={styles.text}>
        Engine displacement: {variant.engineDisplacement}
      </Text>
      <Text style={styles.text}>Transmission: {variant.transmission}</Text>
      <Text style={styles.text}>Power: {variant.powerHp} hp</Text>
      <Text style={styles.text}>
        Acceleration 0-100 km/h: {variant.acceleration0_100KmhS} s
      </Text>
      <Text style={styles.text}>
        Fuel consumption: {variant.fuelConsumptionL100Km}L/100 km
      </Text>
      <Text style={styles.text}>
        Co2 emissions: {variant.co2EmissionsGkm} g/km
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    margin: 14,
    padding: 10,
  },
  variantTitle: {
    fontSize: 20,
    margin: 10,
    marginStart: 6,
  },
  text: {
    fontSize: 18,
    margin: 4,
  },
});

Variant.propTypes = {
  navigation: PropTypes.object,
  variantIndex: PropTypes.number,
  variant: PropTypes.object,
};

export default Variant;
