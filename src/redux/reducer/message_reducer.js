const initState = {
  chat_list: [],
  chat_detail: {
    number: null,
    loan_id: null,
    username: null,
    message: null,
    va_number: null,
    loan_status: null,
    loan_amount: null,
    loan_length: null,
    contact_id: null,
    chat_id: null,
  },
  message_list: [],
  load_message: false,
  load_chat: false,
  load_detail: false
};

export const message = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
