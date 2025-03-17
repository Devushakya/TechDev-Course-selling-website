import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData:null,
  loading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};
//matlab initially local storage se auth ke liye token dekho agar hai to thik nhi to null kar do

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});
//reducer matlab ek function type ka jo payload (mere dwara bheji ) ko token me daal dega

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
