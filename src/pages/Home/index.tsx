import {
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
import { ChangeEvent, useEffect, useState } from "react";
import { PARAMS_TYPE, getRecords } from "../../api/record.api";
import PopupForm from "../../components/PopupForm";
import UserForm from "../../components/UserForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
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

  const { searchValue, selectedOption, sortBy, sortOrder, currentPage } =
    useSelector((state: RootState) => state.globalReducer);

  const { totalCount } = useSelector((state: RootState) => state.recordReducer);

  const handleGetRecords = async (database: string, params: PARAMS_TYPE) => {
    const res = await getRecords(database, params);
    console.log("res", res);
    dispatch(
      setRecords({
        records: res.records,
        totalCount: Number(res.totalCount),
      })
    );
  };

  const newFn = useDebounce(handleGetRecords, 300);

  const handleChange = (value: string) => {
    dispatch(setSearchValue(value));
    newFn(selectedOption.value, {
      page: 1,
      sortBy,
      sortOrder,
      searchValue: value,
    });
  };

  const onLoad = async () => {
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
  };

  useEffect(() => {
    onLoad();
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
      <Box className="main-content">
        <Box className="search-section">
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
            Create
          </Button>
        </Box>
        <TableComponent />
        <Box className="pagination-section">
          <Pagination
            page={currentPage}
            count={Math.ceil(totalCount / 10)}
            variant="outlined"
            color="primary"
            onChange={async (_: ChangeEvent<unknown>, page: number) => {
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
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
