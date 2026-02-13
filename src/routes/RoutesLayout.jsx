import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../zustand/useUserStore";

export const ProtectedLayout = () => {
  const { user } = useUserStore();
  console.log(user, "Current User");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const AuthProtectedLayout = () => {
  const { user } = useUserStore();
  console.log(user, "Current User");
  // Agar user already logged in hai to dashboard pe redirect karo
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
