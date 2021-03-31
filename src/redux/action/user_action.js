import axios from "axios";

export const login = (username, password, cbOk, cbNok) => async dispatch => {
  dispatch(setStateUser({ isLoading: true }));

  try {
    let auth = btoa(`${username}:${password}`);
    const request = process.env.REACT_APP_API_END_POINT + "/login";
    const response = await axios.post(
      request,
      {},
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
          token: response.data.token,
          account: username,
          admin_user_id: response.data.admin_user_id,
          role: response.data.role
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
