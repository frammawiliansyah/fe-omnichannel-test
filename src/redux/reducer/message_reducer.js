const initState = {
  chat_list: [
    {
      loan_id: 100001,
      username: "Boby",
      message: "Hello",
      va_number: 111
    },
    {
      loan_id: 100002,
      username: "Rudi",
      message: "How Are You",
      va_number: 222
    },
    {
      loan_id: 100003,
      username: "Mike",
      message: "Good Morning",
      va_number: 333
    },
    {
      loan_id: 100004,
      username: "Jordan",
      message: "Thanks",
      va_number: 444
    },
    {
      loan_id: 100005,
      username: "Kylie",
      message: "Terimakasih",
      va_number: 555
    },
    {
      loan_id: 100006,
      username: "Adele",
      message: "See You",
      va_number: 666
    },
    {
      loan_id: 100001,
      username: "Boby",
      message: "Hello",
      va_number: 111
    },
    {
      loan_id: 100002,
      username: "Rudi",
      message: "How Are You",
      va_number: 222
    },
    {
      loan_id: 100003,
      username: "Mike",
      message: "Good Morning",
      va_number: 333
    },
    {
      loan_id: 100004,
      username: "Jordan",
      message: "Thanks",
      va_number: 444
    },
    {
      loan_id: 100005,
      username: "Kylie",
      message: "Terimakasih",
      va_number: 555
    },
    {
      loan_id: 100006,
      username: "Adele",
      message: "See You",
      va_number: 666
    }
  ],
  chat_detail: {
    loan_id: null,
    username: null,
    message: null,
    va_number: null
  },
  message_list: [],
  load_message: false,
  load_chat: false
};

export const message = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
