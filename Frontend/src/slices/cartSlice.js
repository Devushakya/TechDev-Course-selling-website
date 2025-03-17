import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";


const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => sum + Number(item.price), 0); 
};

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  totalItems: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).length
    : 0,
  total: localStorage.getItem("cart")
    ? calculateTotal(JSON.parse(localStorage.getItem("cart")))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }

      state.cart.push(course);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total)); // Store total as a number
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Course added to cart");
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        state.cart.splice(index, 1);
        state.totalItems = state.cart.length;
        state.total = calculateTotal(state.cart);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        toast.success("Course removed from cart");
      }
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");

      toast.success("Cart reset successfully");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
