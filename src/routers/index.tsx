import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import { RECORD_TYPE, USER_STATE_TYPE } from "../App";
import { PARAMS_TYPE } from "../api/record.api";

type PROP_TYPE = {
  user: USER_STATE_TYPE;
  setUser: (value: USER_STATE_TYPE) => void;
  selectedOption: string;
  setSelectedOption: (val: string) => void;
  searchParams: any;
  setSearchParams: (value: any) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
  records: RECORD_TYPE[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  handleGetRecords: (database: string, params: PARAMS_TYPE) => void;
  sortOrder: "asc" | "desc" | null;
  sortBy: string | null;
  setSortOrder: (val: "asc" | "desc" | null) => void;
  setSortBy: (val: string | null) => void;
};

const RouterComponent = ({
  user,
  setUser,
  selectedOption,
  setSelectedOption,
  searchParams,
  setSearchParams,
  searchValue,
  setSearchValue,
  records,
  totalCount,
  currentPage,
  setCurrentPage,
  handleGetRecords,
  sortOrder,
  sortBy,
  setSortOrder,
  setSortBy,
}: PROP_TYPE) => {
  return (
    <Routes>
      <Route element={<PublicRoute isLoggedIn={!!user} />}>
        <Route path="/signin" element={<LoginForm setUser={setUser} />} />
        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
      </Route>
      <Route element={<PrivateRoute isLoggedIn={!!user} />}>
        <Route
          path="/"
          element={
            <Home
              user={user}
              setUser={setUser}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              records={records}
              totalCount={totalCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              handleGetRecords={handleGetRecords}
              sortOrder={sortOrder}
              sortBy={sortBy}
              setSortOrder={setSortOrder}
              setSortBy={setSortBy}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
