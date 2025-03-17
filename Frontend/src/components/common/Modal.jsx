import React from "react";

const Modal = ({ ModalData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-richblack-800 text-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <div className="mb-4 flex flex-col gap-3  ">
          <p className="text-3xl font-semibold">{ModalData.text1}</p>
          <p className="text-sm text-gray-300 ">{ModalData.text2}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={ModalData.btn1Handler}
            className=" bg-yellow-100 hover:bg-yellow-500 text-black px-4 py-2 rounded-md"
          >
            {ModalData.btn1text}
          </button>
          <button
            onClick={ModalData.btn2Handler}
            className=" bg-richblack-700 hover:bg-richblack-600 text-white px-4 py-2 rounded-md"
          >
            {ModalData.btn2text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
