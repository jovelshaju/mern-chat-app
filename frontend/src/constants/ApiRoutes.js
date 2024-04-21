const BaseURL = process.env.REACT_APP_SERVER_URL;

const ApiRoutes = {
  signUp: `${BaseURL}/api/user/register`,
  login: `${BaseURL}/api/user/login`,
  getUsers: `${BaseURL}/api/user?search=`,
  chat: `${BaseURL}/api/chat`,
};

export default ApiRoutes;
