import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Show_Toast = (message, type) => {
  if (type) {
    toast.success(message, {
      position: "top-center", 
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.error(message, {
      position: "top-center", 
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    });
  }
};
