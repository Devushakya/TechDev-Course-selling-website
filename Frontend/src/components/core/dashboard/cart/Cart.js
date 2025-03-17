import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RenderCoursecards from "./RenderCoursecards";
import { useNavigate } from "react-router-dom";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { resetCart } from "../../../../slices/cartSlice";
import bgimage from "../../../../assets/Images/emptyCart.png";
const Cart = () => {
  const { cart, total } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("cart", cart);

  const getallid = () => {
    var array = [];
    cart.map((course) => {
      array.push(course?._id);
    });
    return array;
  };

  const buyCoursehandler = async () => {
    console.log("me aa gaya");
    var array = getallid();
    // console.log("token", token);
    if (token) {
      await buyCourse(token, array, user, navigate, dispatch); 
      // dispatch(resetCart());
      return;
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col text-white">
        <p className="text-3xl font-semibold">Your Cart</p>
        <p className="text-richblack-500 mt-4">
          <span>{cart?.length}</span> courses in your wishlist
        </p>
        <div className="bg-richblack-500 h-[2px] w-[18%] mt-2"></div>
      </div>

      {/* Main Content */}
      {cart.length > 0 ? (
        <div className="flex flex-row w-full mt-6 gap-6">
          {/* Course Cards Section */}
          <div className="w-[95%]  p-4 rounded-md">
            <RenderCoursecards />
          </div>

          {/* Buy Now Section */}
          <div className="w-[30%] text-white bg-richblack-700 flex flex-col h-fit p-4 rounded-md">
            <p className="text-2xl font-semibold">Total</p>
            <p className="mt-1">
              <span>{cart?.length}</span> courses
            </p>
            <p className=" text-yellow-100 text-3xl font-semibold">
              Rs {total}
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={buyCoursehandler}
                className="bg-yellow-100 text-black py-2 font-bold hover:bg-yellow-300 px-4 rounded-md w-full"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex flex-col items-center mt-7 ">
          <p className=" text-yellow-100 text-3xl ">Your Cart is Empty</p>
          <img height={550} width={550} src={bgimage} />
        </div>
      )}
    </div>
  );
};

export default Cart;
