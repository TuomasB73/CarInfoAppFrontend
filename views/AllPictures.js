import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadAllPictures} from '../hooks/ApiHooks';
import {Ionicons} from '@expo/vector-icons';
import {UPLOADS_URL} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {usePicture} from '../hooks/ApiHooks';

const AllPictures = ({navigation}) => {
  const picturesArray = useLoadAllPictures();
  const {user, updatePictures, setUpdatePictures} = useContext(MainContext);
  const {deletePicture} = usePicture();

  const deleteMyPicture = async (pictureId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const deletedPicture = await deletePicture(
        {deleteMyPictureId: pictureId},
        userToken
      );
      if (deletedPicture) {
        setUpdatePictures(updatePictures + 1);
      }
    } catch (e) {
      console.log('deletePicture error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>User posted pictures</Text>
            <View style={styles.listContainer}>
              {picturesArray.length > 0 ? (
                <FlatList
                  data={picturesArray.reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View style={styles.pictureContainer}>
                      <View style={styles.userContainer}>
                        <Text style={styles.usernameText}>
                          {item.user.nickname}
                        </Text>
                        <View style={styles.iconButtonsContainer}>
                          {user.id === item.user.id && (
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => {
                                Alert.alert(
                                  'Delete',
                                  'Are you sure you want to delete this picture?',
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Delete',
                                      onPress: () => deleteMyPicture(item.id),
                                    },
                                  ],
                                  {cancelable: false}
                                );
                              }}
                            >
                              <Ionicons name="trash" size={30} />
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="heart-outline" size={30} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.pictureText}>{item.text}</Text>
                      <Image
                        source={{
                          uri: `${UPLOADS_URL}${item.imageFilename}`,
                        }}
                        style={styles.image}
                        resizeMode="contain"
                      ></Image>
                    </View>
                  )}
                ></FlatList>
              ) : (
                <Text style={styles.text}>No pictures yet</Text>
              )}
            </View>
          </>
        }
      ></FlatList>
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
    margin: 20,
  },
  listContainer: {
    backgroundColor: '#d5e3eb',
    margin: 10,
    borderRadius: 10,
  },
  pictureContainer: {
    backgroundColor: 'lightblue',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usernameText: {
    fontSize: 20,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    margin: 4,
  },
  pictureText: {
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    height: 220,
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    margin: 12,
  },
});

AllPictures.propTypes = {
  navigation: PropTypes.object,
};

export default AllPictures;
