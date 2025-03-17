import { combineReducers } from "@reduxjs/toolkit";
import authreducer from "../slices/authSlice";
import cartreducer from "../slices/cartSlice";
import profilereducer from "../slices/profileSlice";
import courseReducer from "../slices/courseSlice"

const rootReducer = combineReducers({
  auth: authreducer,
  cart: cartreducer,
  profile: profilereducer,
  course: courseReducer,
});

export default rootReducer;
