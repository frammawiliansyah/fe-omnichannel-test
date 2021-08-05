import axios from "axios";
const CryptoJS = require("crypto-js");

export const login = (username, password, cbOk, cbNok) => async dispatch => {
  dispatch(setStateUser({ isLoading: true }));

  try {
    let auth = btoa(`${username}:${password}`);
    const request = process.env.REACT_APP_API_END_POINT + "/login";
    const response = await axios.post(
      request,
      {
        username,
        password: CryptoJS.AES.encrypt(password, "FIT999").toString()
      },
      {
        headers: { Authorization: auth },
        validateStatus: function() {
          return true;
        }
      }
    );

    if (response.data.status === "SUCCESS") {
      dispatch(
        setStateUser({
          isLoading: false,
          account: response.data
        })
      );
      cbOk();
    } else {
      dispatch(
        setStateUser({
          isLoading: false
        })
      );
      cbNok();
    }
  } catch (error) {
    dispatch(setStateUser({ isLoading: false }));
    cbNok();
    console.log(error);
  }
};

export const setStateUser = objValue => ({
  type: "LOGIN_PAGE",
  payload: objValue
});
