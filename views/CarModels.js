import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModels} from '../hooks/ApiHooks';

const CarModels = ({navigation, route}) => {
  const {brand} = route.params;
  const carModelsArray = useLoadCarModels({brand: brand.id});

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{brand.name}</Text>
      <Text style={styles.text}>Select a car model</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={carModelsArray.sort((a, b) =>
            a.fullModelName.name.localeCompare(b.fullModelName.name)
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                navigation.navigate('Car info', {carId: item.id});
              }}
            >
              <Text style={styles.listItemText}>
                {item.model} ({item.year})
              </Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginTop: 34,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 12,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginTop: 20,
    marginStart: 60,
    marginEnd: 60,
    padding: 8,
  },
  listItem: {
    backgroundColor: '#e6e6e6',
    margin: 4,
  },
  listItemText: {
    fontSize: 20,
    margin: 8,
  },
});

CarModels.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarModels;
