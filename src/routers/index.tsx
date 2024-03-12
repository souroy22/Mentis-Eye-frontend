import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";

type PROP_TYPE = {
  searchParams: any;
  setSearchParams: (value: any) => void;
};

const RouterComponent = ({ searchParams, setSearchParams }: PROP_TYPE) => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Home
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
