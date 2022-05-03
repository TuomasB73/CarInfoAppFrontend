import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadAllPictures} from '../hooks/ApiHooks';
import PictureListItem from '../components/PictureListItem';

const AllPictures = ({navigation}) => {
  const picturesArray = useLoadAllPictures();

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
                    <PictureListItem
                      picture={item}
                      allPictures={true}
                    ></PictureListItem>
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
    margin: 10,
  },
  listContainer: {
    backgroundColor: '#d5e3eb',
    margin: 10,
    borderRadius: 10,
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
