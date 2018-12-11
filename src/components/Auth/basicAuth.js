import axios from 'axios';

const basicAuth = {
  isAuthenticated: false,
  loggedInUser: '',
  jwt: '',
  authenticate(username, password, cb) {
    axios.request({
      baseURL: 'http://localhost:4000/api',
      url: '/sign_in',
      method: 'post',
      data: {
        login: username,
        password: password
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log(response);
      this.jwt = response.data.jwt;
      this.loggedInUser = username;
      this.isAuthenticated = true;
      cb();
    }).catch((error) => {
      console.log(error);
      this.isAuthenticated = false;
      cb();
    });
  },
  signout(cb) {
    this.isAuthenticated = false;
    this.loggedInUser = '';
    this.jwt = '';
    console.log("logged out");
    cb();
  },
};

export default basicAuth;
