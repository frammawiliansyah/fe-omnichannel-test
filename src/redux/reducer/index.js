import { combineReducers } from "redux";
import { user } from "./user_reducer";
import { modal } from "./modal_reducer";
import { message } from "./message_reducer";
export default combineReducers({
  user,
  modal,
  message
});
