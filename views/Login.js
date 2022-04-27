import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Button,
  Keyboard,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import useLoginForm from '../hooks/LoginHooks';
import useSignUpForm from '../hooks/RegisterHooks';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setIsUsingAnonymously, setUser} =
    useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {postLogin, postRegister, checkToken} = useUser();
  const [loading, setLoading] = useState(false);
  const {loginInputs, handleLoginInputChange} = useLoginForm();
  const {
    registerInputs,
    handleRegisterInputChange,
    handleRegisterInputEnd,
    checkEmailAvailable,
    checkNicknameAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();

  // Function for checking whether a user is already logged in or used the app anonymously, and checking the authentication token.
  const getToken = async () => {
    const anonymousUser = await AsyncStorage.getItem('anonymousUser');
    if (anonymousUser === 'true') {
      setIsUsingAnonymously(true);
    } else {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('token', userToken);
      if (userToken) {
        try {
          const userData = await checkToken(userToken);
          setIsLoggedIn(true);
          setUser(userData);
        } catch (error) {
          console.log('token check failed', error.message);
        }
      }
    }
  };

  // Function for skipping the login and using the app anonymously.
  const skipLogin = async () => {
    setIsUsingAnonymously(true);
    await AsyncStorage.setItem('anonymousUser', 'true');
  };

  const doLogin = async () => {
    setLoading(true);
    try {
      const userData = await postLogin({
        username: loginInputs.email,
        password: loginInputs.password,
      });
      setUser(userData);
      setIsLoggedIn(true);
      console.log('TESTIIII', JSON.stringify(userData));
      await AsyncStorage.setItem('userToken', userData.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('postLogin error', error.message);
      Alert.alert('Invalid username or password');
    }
  };

  const doRegister = async () => {
    if (!validateOnSend()) {
      Alert.alert('Input validation failed');
      console.log('validate on send failed');
      return;
    }
    delete registerInputs.confirmPassword;
    try {
      const result = await postRegister({
        username: registerInputs.email,
        nickname: registerInputs.nickname,
        password: registerInputs.password,
      });
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      // do automatic login after registering
      const userData = await postLogin({
        username: registerInputs.email,
        password: registerInputs.password,
      });
      await AsyncStorage.setItem('userToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData);
    } catch (error) {
      console.log('registration error', error);
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View>
              {formToggle ? <Text>Login</Text> : <Text>Register</Text>}
              <View>
                {formToggle ? (
                  <View>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Email"
                      onChangeText={(txt) =>
                        handleLoginInputChange('email', txt)
                      }
                    ></TextInput>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Password"
                      onChangeText={(txt) =>
                        handleLoginInputChange('password', txt)
                      }
                      secureTextEntry={true}
                    ></TextInput>
                    <Button title="Login" onPress={doLogin} loading={loading} />
                  </View>
                ) : (
                  <View>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Email"
                      onChangeText={(txt) =>
                        handleRegisterInputChange('email', txt)
                      }
                      onEndEditing={(event) => {
                        checkEmailAvailable(event);
                        handleRegisterInputEnd('email', event.nativeEvent.text);
                      }}
                      errorMessage={registerErrors.email}
                    ></TextInput>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Nickname"
                      onChangeText={(txt) =>
                        handleRegisterInputChange('nickname', txt)
                      }
                      onEndEditing={(event) => {
                        checkNicknameAvailable(event);
                        handleRegisterInputEnd(
                          'nickname',
                          event.nativeEvent.text
                        );
                      }}
                      errorMessage={registerErrors.nickname}
                    ></TextInput>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Password"
                      onChangeText={(txt) =>
                        handleRegisterInputChange('password', txt)
                      }
                      onEndEditing={(event) => {
                        handleRegisterInputEnd(
                          'password',
                          event.nativeEvent.text
                        );
                      }}
                      secureTextEntry={true}
                      errorMessage={registerErrors.password}
                    ></TextInput>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Confirm password"
                      onChangeText={(txt) =>
                        handleRegisterInputChange('confirmPassword', txt)
                      }
                      onEndEditing={(event) => {
                        handleRegisterInputEnd(
                          'confirmPassword',
                          event.nativeEvent.text
                        );
                      }}
                      secureTextEntry={true}
                      errorMessage={registerErrors.confirmPassword}
                    ></TextInput>
                    <Button title="Register" onPress={doRegister} />
                  </View>
                )}
              </View>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => {
                  setFormToggle(!formToggle);
                }}
              >
                <Text>
                  {formToggle
                    ? 'New user? Register here.'
                    : 'Already registered? Login here.'}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={skipLogin}
              >
                <Text>Continue without logging in</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
