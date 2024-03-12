import { useEffect } from "react";
import RouterComponent from "./routers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getUser } from "./api/user.api";
import { customLocalStorage } from "./services/utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/user/userReducer";
import "./App.css";
import { RootState } from "./store/store";
import { setLoading } from "./store/global/globalReducer";
import Loader from "./components/Loader";

// type FN_TYPE = (database: string, params: PARAMS_TYPE) => void;

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOption, currentPage, loading } = useSelector(
    (state: RootState) => state.globalReducer
  );

  const addQuery = (key: string, value: string) => {
    let pathname = location.pathname;
    // returns path: '/app/books'
    let searchParams = new URLSearchParams(location.search);
    // returns the existing query string: '?type=fiction&author=fahid'
    searchParams.set(key, value);
    navigate({
      pathname: pathname,
      search: String(searchParams),
    });
  };

  const onLoad = async () => {
    dispatch(setLoading(true));
    if (customLocalStorage.getData("token")) {
      try {
        const res = await getUser();
        dispatch(setUser(res.user));
        addQuery("database", selectedOption.value);
        addQuery("page", String(currentPage));
      } catch (error) {
        setUser(null);
      }
    }
    dispatch(setLoading(false));
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
      {loading && <Loader open={loading} />}
      <Toaster />
    </>
  );
};

export default App;
