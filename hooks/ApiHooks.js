const GRAPHQL_URL = 'https://192.168.8.114:8000/graphql';

const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch(GRAPHQL_URL, options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const useUser = () => {
  const postLogin = async (inputs) => {
    const query = {
      query: `
              query Query($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                  id
                  username
                  nickname
                  token
                }
              }`,
      variables: inputs,
    };
    try {
      const data = await fetchGraphql(query);
      return data.login;
    } catch (e) {
      console.log('postLogin', e.message);
    }
  };

  const postRegister = async (inputs) => {
    const query = {
      query: `
              mutation Mutation($username: String!, $nickname: String!, $password: String!) {
                registerUser(username: $username, nickname: $nickname, password: $password) {
                  id
                  username
                  nickname
                  token
                }
              }`,
      variables: inputs,
    };
    try {
      const data = await fetchGraphql(query);
      return data.registerUser;
    } catch (e) {
      console.log('postRegister', e.message);
    }
  };

  const checkToken = async (token) => {
    const query = {
      query: `
              query Query {
                getMyUser {
                  id
                  username
                  nickname
                  token
                }
              }`,
      headers: {'x-access-token': token},
    };
    try {
      const data = await fetchGraphql(query);
      return data.getMyUser;
    } catch (e) {
      console.log('checkToken', e.message);
    }
  };

  const checkIsEmailAvailable = async (email) => {
    const query = {
      query: `
              query Query($username: String!) {
                checkIsUsernameAvailable(username: $username)
              }`,
      variables: {username: email},
    };
    try {
      const data = await fetchGraphql(query);
      return data.checkIsUsernameAvailable;
    } catch (e) {
      console.log('checkIsEmailAvailable', e.message);
    }
  };

  const checkIsNicknameAvailable = async (nickname) => {
    const query = {
      query: `
              query Query($nickname: String!) {
                checkIsNicknameAvailable(nickname: $nickname)
              }`,
      variables: {nickname},
    };
    try {
      const data = await fetchGraphql(query);
      return data.checkIsNicknameAvailable;
    } catch (e) {
      console.log('checkIsNicknameAvailable', e.message);
    }
  };

  return {
    postLogin,
    postRegister,
    checkToken,
    checkIsEmailAvailable,
    checkIsNicknameAvailable,
  };
};

export {useUser};
