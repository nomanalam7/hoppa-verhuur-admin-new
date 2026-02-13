import axios from "axios";
import useUserStore from "../zustand/useUserStore";
import { showModal } from "../utils/modal";

// export const baseUrl = "https://9zm5wcv8-6003.asse.devtunnels.ms/api/";
export const baseUrl = "https://hoppa-verhuur-525e3417ae8e.herokuapp.com/api/";


const api = async (path, params, method, isMultipart = false) => {
  let userToken = localStorage.getItem("token");
  const options = {
    headers: {
      ...(userToken && {
        Authorization: `Bearer ${userToken}`,
      }),
    },
    method,
    ...(params && {
      data: params,
    }),
  };

  // Sirf JSON request ke liye
  if (!isMultipart) {
    options.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios(baseUrl + path, options);
    return response;
  } catch (error) {
    console.error("❌ API Error:", error);

    if (error.response?.status === 401) {
      showModal("Je sessie is verlopen. Je wordt uitgelogd.", () => {
        useUserStore.getState().clearUserData();
        window.location.href = "/login";
      });
    }

    return (
      error.response || { status: 500, data: { message: "Unknown error" } }
    );
  }
};

export default api;
