import {
  Backdrop,
  Box,
  Button,
  FormControl,
  InputAdornment,
  Pagination,
  TextField,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import TableComponent from "../../components/TableComponent";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { ChangeEvent, useEffect, useState } from "react";
import { PARAMS_TYPE, getRecords } from "../../api/record.api";
import PopupForm from "../../components/PopupForm";
import UserForm from "../../components/UserForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setLoading,
  setSearchValue,
} from "../../store/global/globalReducer";
import { RootState } from "../../store/store";
import "./style.css";
import { setRecords } from "../../store/record/recordReducer";
import notification from "../../configs/notification";

type PROP_TYPE = {
  searchParams: any;
  setSearchParams: (value: any) => void;
};

type SomeFunction = (...args: any[]) => void;

function useDebounce<Func extends SomeFunction>(func: Func, delay: number) {
  const [timer, setTimer] = useState(); //Create timer state

  const debouncedFunction = ((...args) => {
    const newTimer: any = setTimeout(() => {
      func(...args);
    }, delay);
    clearTimeout(timer); //Cancel previous timers
    setTimer(newTimer); //Save latest timer
  }) as Func;

  return debouncedFunction;
}

const Home = ({ searchParams, setSearchParams }: PROP_TYPE) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [openSidebar, setopenSidebar] = useState<boolean>(false);

  const { searchValue, selectedOption, sortBy, sortOrder, currentPage } =
    useSelector((state: RootState) => state.globalReducer);

  const { totalCount } = useSelector((state: RootState) => state.recordReducer);

  const handleGetRecords = async (database: string, params: PARAMS_TYPE) => {
    dispatch(setLoading(true));
    const res = await getRecords(database, params);
    dispatch(
      setRecords({
        records: res.records,
        totalCount: Number(res.totalCount),
      })
    );
    dispatch(setLoading(false));
  };

  const addQuery = (key: string, value: string) => {
    let pathname = location.pathname;
    // returns path: '/app/books'
    let searchParams = new URLSearchParams(location.search);
    // returns the existing query string: '?type=fiction&author=fahid'
    searchParams.set(key, value);
    window.history.replaceState(null, "", `${pathname}?${searchParams}`);
  };

  const newFn = useDebounce(handleGetRecords, 300);

  const handleChange = (value: string) => {
    dispatch(setSearchValue(value));
    addQuery("search", value);
    newFn(selectedOption.value, {
      page: 1,
      sortBy,
      sortOrder,
      searchValue: value,
    });
  };

  const handlePageChange = async (_: ChangeEvent<unknown>, page: number) => {
    dispatch(setLoading(true));
    addQuery("page", String(page));
    dispatch(setCurrentPage(page));
    const res = await getRecords(selectedOption.value, {
      page,
      sortBy,
      sortOrder,
      searchValue,
    });
    dispatch(
      setRecords({
        records: res.records,
        totalCount: Number(res.totalCount),
      })
    );
    dispatch(setLoading(false));
  };

  const onLoad = async () => {
    dispatch(setLoading(true));
    try {
      const recordRes = await getRecords(selectedOption.value);
      dispatch(
        setRecords({
          records: recordRes.records,
          totalCount: Number(recordRes.totalCount),
        })
      );
    } catch (error) {
      notification.error("Something went wrong");
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    onLoad();
    document.onclick = (event: any) => {
      const mobileSidebar = document.getElementById("mobile-sidebar");
      const menuIcon = document.getElementById("menu-icon");
      if (
        !mobileSidebar?.contains(event.target) &&
        !menuIcon?.contains(event.target)
      ) {
        setopenSidebar(false);
      }
    };
  }, []);

  return (
    <Box className="home-section">
      {open && (
        <PopupForm
          open={open}
          handleClose={() => setOpen(false)}
          title="Create New User"
          width="max-content"
        >
          <UserForm handleClose={() => setOpen(false)} />
        </PopupForm>
      )}
      <Box className="sidebar-section">
        <Sidebar
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </Box>
      <Backdrop open={openSidebar} sx={{ zIndex: 99999 }}>
        <Box
          className={`mobile-sidebar ${openSidebar ? "active" : ""}`}
          sx={{ zIndex: 999999 }}
          id="mobile-sidebar"
        >
          <Sidebar
            handleClose={() => setopenSidebar(false)}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Box>
      </Backdrop>
      <Box className="main-content">
        <Box className="search-section">
          <Box className="menu-icon-container">
            <MenuIcon
              onClick={() => setopenSidebar(!openSidebar)}
              id="menu-icon"
            />
          </Box>
          <FormControl>
            <TextField
              className="search-field"
              name="search-field"
              placeholder="search..."
              autoComplete="new-password"
              value={searchValue}
              onChange={(event) => handleChange(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            className="create-btn"
            onClick={() => setOpen(true)}
          >
            <AddIcon />
            {screen.availWidth > 600 && "Create"}
          </Button>
        </Box>
        <TableComponent />
        <Box className="pagination-section">
          <Pagination
            page={currentPage}
            count={Math.ceil(totalCount / 10)}
            variant="outlined"
            color="primary"
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
