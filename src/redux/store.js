import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { storage } from "./local_storage";
import reducer from "./reducer/index";

/**
 * load state from local storage
 */
const loadStateUser = () => {
  try {
    const local_storage = storage.get(process.env.REACT_APP_LOCAL_STORAGE_NAME);

    if (local_storage === null) {
      return undefined;
    }
    return local_storage;
  } catch (e) {
    return undefined;
  }
};

//get initial state before page rendering
const preloadedState = {
  user: loadStateUser()
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(
    // const store = createStore(reducer
    applyMiddleware(thunk, logger)
  )
);

//save to local storage if redux state is changed
store.subscribe(() => {
  storage.store(
    process.env.REACT_APP_LOCAL_STORAGE_NAME,
    store.getState().user
  );
});

export default store;
