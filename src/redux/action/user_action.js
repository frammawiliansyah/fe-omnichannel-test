import axios from "axios";
const CryptoJS = require("crypto-js");

export const login = (username, password, callbackOK, callbackNOK) => async dispatch => {
  dispatch(setStateUser({ isLoading: true }));

  try {
    const request = process.env.REACT_APP_API_END_POINT + "/login";
    const response = await axios.post(
      request,
      {
        username,
        password: CryptoJS.AES.encrypt(password, "FIT999").toString()
      }
    );

    if (response.data.status === "SUCCESS") {
      let accountData = response.data.data;

      if (accountData.authentication && accountData.isActive) {
        dispatch(
          setStateUser({
            isLoading: false,
            account: accountData
          })
        );
  
        callbackOK();
      } else {
        dispatch(
          setStateUser({ isLoading: false })
        );
  
        callbackNOK();
      }
    } else {
      dispatch(
        setStateUser({ isLoading: false })
      );

      callbackNOK();
    }
  } catch (error) {
    console.log("UserAction.login", error);
    dispatch(
      setStateUser({ isLoading: false })
    );

    callbackNOK();
  }
};

export const setStateUser = objValue => ({
  type: "LOGIN_PAGE",
  payload: objValue
});
