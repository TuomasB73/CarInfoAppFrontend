/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import AddCar from '../views/AddCar';
import AllPictures from '../views/AllPictures';
import CarModels from '../views/CarModels';
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
      <Stack.Screen
        name="Home"
        component={TabScreen}
        options={({route}) => ({
          headerTitle: getFocusedRouteNameFromRoute(route),
        })}
      />
      <Stack.Screen name="CarModels" component={CarModels} />
      {/* <Stack.Screen name="CarInfo" component={CarInfo} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="CarModelPictures" component={CarModelPictures} /> */}
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
