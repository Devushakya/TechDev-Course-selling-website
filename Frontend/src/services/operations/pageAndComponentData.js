import React from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnect";
import { catalogData } from "../apis";

export const getCatalogaPageData = async (categoryName) => {
  // console.log("category name:", categoryName);
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${catalogData.CATALOGPAGEDATA_API}?categoryName=${categoryName}`
    );

    if (!response?.data?.success)
      throw new Error("Could not fetch category page data");

    result = response?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId); 
  return result; 
};

