import { Navigate, Outlet, useLocation } from "react-router-dom";

type PROP_TYPE = {
  isLoggedIn: boolean;
};

const PrivateRoute = ({ isLoggedIn }: PROP_TYPE) => {
  const location = useLocation();

  if (isLoggedIn) {
    return <Outlet />;
  }
  return <Navigate to="/signin" state={{ prevUrl: location.pathname }} />;
};

export default PrivateRoute;
