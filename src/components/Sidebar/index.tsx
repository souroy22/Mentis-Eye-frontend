import { Fragment } from "react";
import { Avatar, Box } from "@mui/material";
import { USER_STATE_TYPE, sidebarOptions } from "../../App";
import "./style.css";
import { FiLogOut } from "react-icons/fi";
import { ImDatabase } from "react-icons/im";
import { signout } from "../../api/auth.api";
import notification from "../../configs/notification";
import { customLocalStorage } from "../../services/utils/localStorage";
import { PARAMS_TYPE } from "../../api/record.api";

type PROP_TYPE = {
  user: USER_STATE_TYPE;
  setUser: (value: USER_STATE_TYPE) => void;
  selectedOption: string;
  setSelectedOption: (val: string) => void;
  searchParams: any;
  setSearchParams: (value: any) => void;
  setCurrentPage: (val: number) => void;
  handleGetRecords: (database: string, params: PARAMS_TYPE) => void;
  sortOrder: "asc" | "desc" | null;
  sortBy: string | null;
  searchValue: string;
};

const Sidebar = ({
  user,
  setUser,
  selectedOption,
  setSelectedOption,
  searchParams,
  setSearchParams,
  setCurrentPage,
  handleGetRecords,
  sortOrder,
  sortBy,
  searchValue,
}: PROP_TYPE) => {
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

  const handleClick = (option: string) => {
    if (option === selectedOption) {
      return;
    }
    setSearchParams({ ...searchParams, database: option });
    setSelectedOption(option);
    setCurrentPage(1);
    {
      handleGetRecords(option, {
        page: 1,
        sortBy,
        sortOrder,
        searchValue,
      });
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
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
                selectedOption === option.value ? "selected-option" : ""
              }`}
              onClick={() => handleClick(option.value)}
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
