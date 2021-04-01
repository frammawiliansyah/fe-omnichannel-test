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
    }
  ],
  chat_detail: {
    loan_id: null,
    username: null,
    message: null,
    va_number: null
  },
  message_list: [
    {
      loan_id: 1,
      username: "Adele",
      date: "2020-06-20 08:03",
      message: "Lorem ipsum dolor sit amet"
    },
    {
      loan_id: 2,
      username: "Boby",
      date: "2020-06-20 08:04",
      message: "consectetur adipiscing elit"
    },
    {
      loan_id: 2,
      username: "Boby",
      date: "2020-06-20 08:06",
      message: "consectetur adipiscing"
    },
    {
      loan_id: 1,
      username: "Adele",
      date: "2020-06-20 08:08",
      message: "Lorem"
    },
    {
      loan_id: 2,
      username: "Boby",
      date: "2020-06-20 08:09",
      message: "consectetur adipiscing elit"
    },
    {
      loan_id: 2,
      username: "Boby",
      date: "2020-06-20 09:06",
      message: "consectetur adipiscing"
    },
    {
      loan_id: 1,
      username: "Adele",
      date: "2020-06-20 10:08",
      message: "Lorem"
    },
    {
      loan_id: 1,
      username: "Adele",
      date: "2020-06-20 10:09",
      message: "Lorem"
    }
  ]
};

export const message = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
