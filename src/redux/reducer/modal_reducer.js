const initState = {
  isOpen: false,
  success: false,
  header: null,
  body: null,
  confirmText: "OK",
  confirmFunc: null
};

export const modal = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_MODAL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
