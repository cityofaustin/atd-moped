import { Auth } from 'aws-amplify';
import axios from "axios";
import localStorageService from "./localStorageService";

class JwtAuthService {
  user = {}

  buildUserData = (awsCognitoData) => {
    return {
      role: "ADMIN",
      userId: awsCognitoData.username,
      username: awsCognitoData.username,
      email: awsCognitoData.username,
      token: awsCognitoData.signInUserSession.idToken.jwtToken,
      tokenPayload: JSON.stringify(awsCognitoData.signInUserSession.payload),
      displayName: "Authenticated User",
      photoURL: "/assets/images/face-6.jpg",
      age: 0,
    }
  }

  // You need to send http request with email and passsword to your server in this method
  // Your server will return user object & a Token
  // User should have role property
  // You can define roles in app/auth/authRoles.js
  loginWithEmailAndPassword = (email, password) => {
    return Auth.signIn(email, password).then(data => {
      localStorage.setItem("atd_aws_cognito_session", JSON.stringify(data));
      localStorage.setItem("atd_aws_cognito_session_payload", JSON.stringify(data.signInUserSession.idToken.payload));
      this.user = this.buildUserData(data);
      this.setSession(this.user.token);
      this.setUser(this.user);
      return this.user;
    }).catch((error) => {
      console.log(error);
      alert(error.message);
    });
  };

  // You need to send http requst with existing token to your server to check token is valid
  // This method is being used when user logged in & app is reloaded
  loginWithToken = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 100);
    }).then(data => {
      // Token is valid
      this.setSession(data.token);
      this.setUser(data);
      return data;
    });
  };

  logout = () => {
    Auth.signOut().then(() => {
      this.setSession(null);
      this.removeUser();
    });
  }

  // Set token to all http request header, so you don't need to attach everytime
  setSession = token => {
    if (token) {
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("jwt_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Save user to localstorage
  setUser = (user) => {
    localStorageService.setItem("auth_user", user);
  }
  // Remove user from localstorage
  removeUser = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("atd_aws_cognito_session");
    localStorage.removeItem("atd_aws_cognito_session_payload");
  }
}

export default new JwtAuthService();
