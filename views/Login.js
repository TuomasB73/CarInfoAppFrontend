import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button,
  Keyboard,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
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
  const [isLoading, setIsLoading] = useState(false);
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
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.log('token check failed', error.message);
        }
      }
    }
  };

  // Function for skipping the login and using the app anonymously.
  const skipLogin = async () => {
    await AsyncStorage.setItem('anonymousUser', 'true');
    setIsUsingAnonymously(true);
  };

  const doLogin = async () => {
    setIsLoading(true);
    try {
      const userData = await postLogin({
        username: loginInputs.email,
        password: loginInputs.password,
      });
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem('userToken', userData.token);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Invalid username or password');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('doLogin error', error.message);
    }
  };

  const doRegister = async () => {
    if (!validateOnSend()) {
      Alert.alert('Invalid inputs');
      console.log('validate on send failed');
      return;
    }
    delete registerInputs.confirmPassword;
    setIsLoading(true);
    try {
      await postRegister({
        username: registerInputs.email,
        nickname: registerInputs.nickname,
        password: registerInputs.password,
      });
      // do automatic login after registering
      const userData = await postLogin({
        username: registerInputs.email,
        password: registerInputs.password,
      });
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem('userToken', userData.token);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('doRegister', error);
      Alert.alert('Registration failed');
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.formContainer}>
              {formToggle ? (
                <Text style={styles.formTitle}>Login</Text>
              ) : (
                <Text style={styles.formTitle}>Register</Text>
              )}
              {formToggle ? (
                <View>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={(txt) => handleLoginInputChange('email', txt)}
                    style={styles.inputField}
                  ></TextInput>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={(txt) =>
                      handleLoginInputChange('password', txt)
                    }
                    secureTextEntry={true}
                    style={styles.inputField}
                  ></TextInput>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                  ) : (
                    <Button title="Login" onPress={doLogin} />
                  )}
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
                    style={styles.inputField}
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
                    style={styles.inputField}
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
                    style={styles.inputField}
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
                    style={styles.inputField}
                  ></TextInput>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                  ) : (
                    <Button title="Register" onPress={doRegister} />
                  )}
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  setFormToggle(!formToggle);
                }}
                style={styles.textButton}
              >
                <Text style={styles.buttonText}>
                  {formToggle
                    ? 'New user? Register here'
                    : 'Already registered? Login here'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={skipLogin} style={styles.textButton}>
                <Text style={styles.buttonText}>
                  Continue without logging in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 40,
    alignItems: 'stretch',
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 30,
    marginBottom: 16,
  },
  inputField: {
    fontSize: 18,
    margin: 12,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  textButton: {
    margin: 8,
    padding: 8,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
