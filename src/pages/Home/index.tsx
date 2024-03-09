import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  Pagination,
  TextField,
} from "@mui/material";
import { RECORD_TYPE, USER_STATE_TYPE } from "../../App";
import Sidebar from "../../components/Sidebar";
import TableComponent from "../../components/TableComponent";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./style.css";
import { ChangeEvent, useState } from "react";
import { PARAMS_TYPE } from "../../api/record.api";
import PopupForm from "../../components/PopupForm";
import UserForm from "../../components/UserForm";

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

const Home = ({
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
  const [open, setOpen] = useState<boolean>(false);

  const newFn = useDebounce(handleGetRecords, 300);

  const handleChange = (value: string) => {
    setSearchValue(value);
    newFn(selectedOption, {
      page: 1,
      sortBy,
      sortOrder,
      searchValue: value,
    });
  };

  return (
    <Box className="home-section">
      {open && (
        <PopupForm
          open={open}
          handleClose={() => setOpen(false)}
          title="Create New User"
          width="max-content"
        >
          <UserForm
            selectedOption={selectedOption}
            sortOrder={sortOrder}
            sortBy={sortBy}
            searchValue={searchValue}
            handleGetRecords={handleGetRecords}
            handleClose={() => setOpen(false)}
          />
        </PopupForm>
      )}
      <Box className="sidebar-section">
        <Sidebar
          user={user}
          setUser={setUser}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setCurrentPage={setCurrentPage}
          handleGetRecords={handleGetRecords}
          sortOrder={sortOrder}
          sortBy={sortBy}
          searchValue={searchValue}
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
        <TableComponent
          records={records}
          currentPage={currentPage}
          handleGetRecords={handleGetRecords}
          sortOrder={sortOrder}
          sortBy={sortBy}
          searchValue={searchValue}
          setSortOrder={setSortOrder}
          setSortBy={setSortBy}
          selectedOption={selectedOption}
        />
        <Box className="pagination-section">
          <Pagination
            page={currentPage}
            count={Math.ceil(totalCount / 10)}
            variant="outlined"
            color="primary"
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setCurrentPage(page);
              handleGetRecords(selectedOption, {
                page,
                sortBy,
                sortOrder,
                searchValue,
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
