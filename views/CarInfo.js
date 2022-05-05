import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModel} from '../hooks/ApiHooks';
import {Ionicons} from '@expo/vector-icons';
import Variant from '../components/Variant';
import {UPLOADS_URL} from '../utils/Variables';
import {MainContext} from '../contexts/MainContext';

const CarInfo = ({navigation, route}) => {
  const {carId} = route.params;
  const carModel = useLoadCarModel({getCarByIdId: carId});
  const {isLoggedIn} = useContext(MainContext);

  return (
    <View style={styles.container}>
      {carModel && (
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.titleText}>
                {carModel.fullModelName.name}
              </Text>
              {/* <View style={styles.imageContainer}> */}
              {carModel.defaultImageFilename ? (
                <Image
                  source={{
                    uri: `${UPLOADS_URL}${carModel.defaultImageFilename}`,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                ></Image>
              ) : (
                <Image
                  source={require('../assets/no_picture.png')}
                  style={styles.image}
                  resizeMode="contain"
                ></Image>
              )}
              {/* </View> */}
              <View style={styles.buttonsContainer}>
                <Button
                  title="Reviews"
                  onPress={() => {
                    navigation.navigate('Reviews', {
                      carId: carModel.id,
                      carModelName: carModel.fullModelName.name,
                    });
                  }}
                />
                <Button
                  title="Pictures"
                  onPress={() => {
                    navigation.navigate('Car model pictures', {
                      carId: carModel.id,
                      carModelName: carModel.fullModelName.name,
                    });
                  }}
                />
              </View>
              <View style={styles.detailsHeaderContainer}>
                <Text style={styles.headerText}>Details:</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    if (isLoggedIn) {
                      navigation.navigate('Edit car', {carModel});
                    } else {
                      Alert.alert('You must login/register to edit a car');
                    }
                  }}
                >
                  <Ionicons name="pencil" size={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.text}>Brand: {carModel.brand.name}</Text>
                <Text style={styles.text}>Model: {carModel.model}</Text>
                <Text style={styles.text}>Year: {carModel.year}</Text>
                <Text style={styles.text}>
                  Body style(s): {carModel.bodyStyles.join(', ')}
                </Text>
                <Text style={styles.text}>
                  Number(s) of doors: {carModel.numbersOfDoors.join(', ')}
                </Text>
                <Text style={styles.text}>
                  Drivetrain(s): {carModel.drivetrains.join(', ')}
                </Text>
                <View style={styles.variantsContainer}>
                  <Text style={styles.variantsTitle}>Variants:</Text>
                  <FlatList
                    data={carModel.variants}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <Variant
                        navigation={navigation}
                        variantIndex={index}
                        variant={item}
                      ></Variant>
                    )}
                  ></FlatList>
                </View>
              </View>
            </>
          }
        ></FlatList>
      )}
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
    marginTop: 20,
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: '90%',
    height: 220,
    margin: 10,
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  detailsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 26,
    margin: 10,
    marginStart: 20,
  },
  editButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    marginEnd: 20,
    padding: 4,
  },
  detailsContainer: {
    backgroundColor: 'lightblue',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    margin: 4,
  },
  variantsContainer: {
    backgroundColor: '#d0d8db',
    borderRadius: 10,
    margin: 4,
    marginTop: 18,
  },
  variantsTitle: {
    fontSize: 24,
    margin: 10,
  },
});

CarInfo.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarInfo;
