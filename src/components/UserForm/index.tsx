import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "./style.css";
import TextInput from "../Textinput";
import { useState } from "react";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import { PARAMS_TYPE, createRecord } from "../../api/record.api";
import notification from "../../configs/notification";
import { sidebarOptions } from "../../App";
import { validateEmail } from "../../services/utils/validateEmail";

export type CREATE_USER_DATA = {
  name: string;
  userEmail: string;
  userPhone: string;
  database: string | null;
};

type ERRORS_TYPE = {
  name: string | null;
  userEmail: string | null;
  userPhone: string | null;
  database: string | null;
};

type PROP_TYPE = {
  handleClose: () => void;
  selectedOption: string;
  handleGetRecords: (database: string, params: PARAMS_TYPE) => void;
  sortOrder: "asc" | "desc" | null;
  sortBy: string | null;
  searchValue: string;
};

const UserForm = ({
  handleClose,
  selectedOption,
  handleGetRecords,
  searchValue,
  sortOrder,
  sortBy,
}: PROP_TYPE) => {
  const [data, setData] = useState<CREATE_USER_DATA>({
    name: "",
    userEmail: "",
    userPhone: "",
    database: null,
  });
  const [errors, setErrors] = useState<ERRORS_TYPE>({
    name: null,
    userEmail: null,
    userPhone: null,
    database: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const handleClick = async () => {
    if (!validateEmail(data.userEmail)) {
      notification.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await createRecord(data);
      notification.success("Successfully created record");
      handleGetRecords(selectedOption, {
        page: 1,
        searchValue,
        sortBy,
        sortOrder,
      });
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <Box className="create-form-container">
      <FormControl>
        <TextInput
          handleChange={handleChange}
          id="name"
          name="name"
          label="Name"
          value={data.name}
          errorMessage={errors.name || ""}
          IconComponent={PiUserCircleGearDuotone}
          required
        />
      </FormControl>
      <FormControl>
        <TextInput
          handleChange={handleChange}
          id="userEmail"
          name="userEmail"
          label="Email"
          value={data.userEmail}
          errorMessage={errors.userEmail || ""}
          IconComponent={PiUserCircleGearDuotone}
          required
        />
      </FormControl>
      <FormControl>
        <TextInput
          handleChange={handleChange}
          id="userPhone"
          name="userPhone"
          label="Phone"
          value={data.userPhone}
          errorMessage={errors.userPhone || ""}
          IconComponent={PiUserCircleGearDuotone}
          required
          type="number"
          maxLength={10}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Database</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="database"
          value={data.database || undefined}
          label="Select Database"
          onChange={(event: SelectChangeEvent) =>
            handleChange(event.target.name, event.target.value)
          }
        >
          {sidebarOptions.map((option) => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        className="login-button"
        onClick={handleClick}
        disabled={
          !(
            data.name.trim() &&
            data.userEmail.trim() &&
            data.userPhone.trim() &&
            data.database !== null
          ) || loading
        }
      >
        {loading ? <CircularProgress className="loading-spinner" /> : "Create"}
      </Button>
    </Box>
  );
};

export default UserForm;
