import { useEffect } from "react";
import RouterComponent from "./routers";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getUser } from "./api/user.api";
import { customLocalStorage } from "./services/utils/localStorage";
import { getRecords } from "./api/record.api";
import { useDispatch, useSelector } from "react-redux";
import { setRecords } from "./store/record/recordReducer";
import { RootState } from "./store/store";
import { setUser } from "./store/user/userReducer";
import "./App.css";

// type FN_TYPE = (database: string, params: PARAMS_TYPE) => void;

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams({});

  const dispatch = useDispatch();

  const onLoad = async () => {
    if (customLocalStorage.getData("token")) {
      try {
        const res = await getUser();
        dispatch(setUser(res.user));
      } catch (error) {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <RouterComponent
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <Toaster />
    </>
  );
};

export default App;
