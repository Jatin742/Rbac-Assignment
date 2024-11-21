import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Named import
import { composeWithDevTools } from "redux-devtools-extension";
import { userEventsReducer, userReducer } from "./Reducers/userReducer";
import { eventDetailsReducer, eventReducer, eventsReducer, newEventReducer, registerationReducer } from "./Reducers/eventReducer";
import { adminUserReducer, allAdminUsersReducer, newUserReducer, userDetailsReducer } from "./Reducers/adminReducer";

const reducer = combineReducers({
  user: userReducer,
  userEvents: userEventsReducer,
  userDetails: userDetailsReducer,
  events: eventsReducer,
  event:eventReducer,
  eventDetails: eventDetailsReducer,
  newEvent: newEventReducer,
  registeration: registerationReducer,
  newUser: newUserReducer,
  allAdminUsers: allAdminUsersReducer,
  adminUser: adminUserReducer,
});

const middleware = [thunk];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
