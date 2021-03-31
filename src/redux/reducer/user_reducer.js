const initState = {
  isLoading: false,
  token: null,
  account: null,
  admin_user_id: null,
  role: null
};

export const user = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_PAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
