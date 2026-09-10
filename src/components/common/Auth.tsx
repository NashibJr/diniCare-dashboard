import { Navigate, Outlet, useLocation } from "react-router-dom";

const Auth = () => {
  const session = localStorage.getItem("session");

  const pathname = useLocation().pathname;

  if (!session && !pathname.includes("login")) {
    return <Navigate to={"/login"} replace />;
  }

  if (session && pathname === "/login") {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default Auth;
