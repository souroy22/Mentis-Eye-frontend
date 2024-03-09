import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthWrapper from "../layouts/Auth";

type PROP_TYPE = {
  isLoggedIn: boolean;
};

const PublicRoute = ({ isLoggedIn }: PROP_TYPE) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    );
  }
  return (
    <Navigate
      to={location.state?.prevUrl || "/"}
      state={{ prevUrl: location.pathname }}
    />
  );
};

export default PublicRoute;
