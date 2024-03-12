import { Fragment } from "react";
import { Avatar, Box } from "@mui/material";
import { FiLogOut } from "react-icons/fi";
import { ImDatabase } from "react-icons/im";
import { signout } from "../../api/auth.api";
import notification from "../../configs/notification";
import { customLocalStorage } from "../../services/utils/localStorage";
import { getRecords } from "../../api/record.api";
import { sidebarOptions } from "../../services/constants";
import { setUser } from "../../store/user/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  SIDEBAR_OPTION_TYPE,
  setCurrentPage,
  setSelectedOption,
} from "../../store/global/globalReducer";
import "./style.css";
import { setRecords } from "../../store/record/recordReducer";

type PROP_TYPE = {
  searchParams: any;
  setSearchParams: (value: any) => void;
};

const Sidebar = ({}: PROP_TYPE) => {
  const dispatch = useDispatch();

  const { searchValue, sortBy, sortOrder, selectedOption } = useSelector(
    (state: RootState) => state.globalReducer
  );

  const { user } = useSelector((state: RootState) => state.userReducer);

  const stringAvatar = (name: string) => {
    if (!name?.trim()) {
      return "USER";
    }
    const splittedText = name.split(" ");
    let avatarText = "";
    for (const text of splittedText) {
      avatarText += text[0];
    }
    return avatarText;
  };

  const addQuery = (key: string, value: string) => {
    let pathname = location.pathname;
    // returns path: '/app/books'
    let searchParams = new URLSearchParams(location.search);
    // returns the existing query string: '?type=fiction&author=fahid'
    searchParams.set(key, value);
    window.history.replaceState(null, "", `${pathname}?${searchParams}`);
  };

  const handleClick = async (option: SIDEBAR_OPTION_TYPE) => {
    if (option.value === selectedOption.value) {
      return;
    }
    addQuery("database", option.value);
    // setSearchParams({ ...searchParams, database: option });
    dispatch(setSelectedOption(option));
    dispatch(setCurrentPage(1));
    const res = await getRecords(option.value, {
      page: 1,
      sortBy,
      sortOrder,
      searchValue,
    });
    dispatch(setRecords(res));
  };

  const handleLogout = async () => {
    try {
      dispatch(setUser(null));
      await signout();
      customLocalStorage.deleteData("token");
      notification.success("Logged out successfully!");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  return (
    <Box className="sidebar-container">
      <Box className="sidebar-top">
        <Avatar alt={user?.name}>{stringAvatar(user?.name || "")}</Avatar>
        <Box className="user-name-text">{user?.name}</Box>
      </Box>
      <Box className="sidebar-options-section">
        {sidebarOptions.map((option) => (
          <Fragment key={option.value}>
            <Box
              className={`sidebar-option ${
                selectedOption.value === option.value ? "selected-option" : ""
              }`}
              onClick={() => handleClick(option)}
            >
              <ImDatabase />
              <Box>{option.label}</Box>
            </Box>
          </Fragment>
        ))}
      </Box>
      <Box className="signout-section" onClick={handleLogout}>
        <FiLogOut className="signout-icon" />
        <Box className="signout-text">Signout</Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
