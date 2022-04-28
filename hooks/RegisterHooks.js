import {useState} from 'react';
import {validator} from '../utils/Validator';
import {useUser} from './ApiHooks';

const constraints = {
  email: {
    presence: {
      message: 'email is required',
    },
    email: {
      message: 'email is not valid',
    },
  },
  nickname: {
    presence: {
      message: 'nickname is required',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
  password: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});
  const {checkIsEmailAvailable, checkIsNicknameAvailable} = useUser();

  const [registerInputs, setRegisterInputs] = useState({
    email: '',
    nickname: '',
    password: '',
  });

  const handleRegisterInputChange = (name, text) => {
    setRegisterInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleRegisterInputEnd = (name, text) => {
    console.log('input end text', text);
    if (text === '') {
      text = null;
    }
    let error;
    if (name === 'confirmPassword') {
      error = validator(
        name,
        {
          password: registerInputs.password,
          confirmPassword: text,
        },
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const checkEmailAvailable = async (event) => {
    try {
      const result = await checkIsEmailAvailable({
        username: event.nativeEvent.text,
      });
      if (!result) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            email: 'User with this email already exists',
          };
        });
      }
    } catch (error) {
      console.error('reg checkEmailAvailable', error);
    }
  };

  const checkNicknameAvailable = async (event) => {
    try {
      const result = await checkIsNicknameAvailable({
        nickname: event.nativeEvent.text,
      });
      if (!result) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            nickname: 'Nickname already exists',
          };
        });
      }
    } catch (error) {
      console.error('reg checkNicknameAvailable', error);
    }
  };

  const validateOnSend = () => {
    const emailError = validator('email', registerInputs.email, constraints);
    const nicknameError = validator(
      'nickname',
      registerInputs.nickname,
      constraints
    );
    const passwordError = validator(
      'password',
      registerInputs.password,
      constraints
    );
    const confirmPasswordError = validator(
      'confirmPassword',
      {
        password: registerInputs.password,
        confirmPassword: registerInputs.confirmPassword,
      },
      constraints
    );

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        email: emailError,
        nickname: nicknameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      };
    });

    if (
      emailError !== null ||
      nicknameError !== null ||
      passwordError !== null ||
      confirmPasswordError !== null
    ) {
      return false;
    }
    return true;
  };

  return {
    handleRegisterInputChange,
    handleRegisterInputEnd,
    registerInputs,
    checkEmailAvailable,
    checkNicknameAvailable,
    registerErrors,
    validateOnSend,
  };
};

export default useSignUpForm;
