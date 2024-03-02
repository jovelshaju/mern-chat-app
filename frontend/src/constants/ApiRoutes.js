const BaseURL = process.env.REACT_APP_SERVER_URL;

const ApiRoutes = {
  signUp: `${BaseURL}/api/user/register`,
  login: `${BaseURL}/api/user/login`,
};

export default ApiRoutes;
