import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import AddCar from '../views/AddCar';
import AllPictures from '../views/AllPictures';
import CarModels from '../views/CarModels';
import CarInfo from '../views/CarInfo';
import CarModelPictures from '../views/CarModelPictures';
import Reviews from '../views/Reviews';
import Login from '../views/Login';
import {Ionicons} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Add car':
              iconName = 'add-circle';
              break;
            case 'Pictures':
              iconName = 'images';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Add car" component={AddCar} />
      <Tab.Screen name="Pictures" component={AllPictures} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn, isUsingAnonymously} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn || isUsingAnonymously ? (
        <>
          <Stack.Screen
            name="Tab screen"
            component={TabScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Car models" component={CarModels} />
          <Stack.Screen name="Car info" component={CarInfo} />
          <Stack.Screen name="Reviews" component={Reviews} />
          <Stack.Screen
            name="Car model pictures"
            component={CarModelPictures}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
