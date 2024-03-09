import { useState } from "react";
import { Box, Button, CircularProgress, FormControl } from "@mui/material";
import "./style.css";
import { USER_STATE_TYPE } from "../../App";
import TextInput from "../Textinput";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import notification from "../../configs/notification";
import { signin } from "../../api/auth.api";
import { Link } from "react-router-dom";
import { customLocalStorage } from "../../services/utils/localStorage";

type PROP_TYPE = {
  setUser: (value: USER_STATE_TYPE) => void;
};

export type DATA_TYPE = {
  username: string;
  password: string;
};

type ERRORS_TYPE = {
  username: string | null;
  password: string | null;
};

const LoginForm = ({ setUser }: PROP_TYPE) => {
  const [data, setData] = useState<DATA_TYPE>({ username: "", password: "" });
  const [errors, setErrors] = useState<ERRORS_TYPE>({
    username: null,
    password: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await signin(data);
      setUser(res.user);
      customLocalStorage.setData("token", res.token);
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <Box className="login-form">
      <FormControl>
        <TextInput
          handleChange={handleChange}
          id="username"
          name="username"
          label="Username"
          value={data.username}
          errorMessage={errors.username || ""}
          IconComponent={AccountCircleIcon}
          required
        />
      </FormControl>
      <FormControl>
        <TextInput
          handleChange={handleChange}
          id="password"
          name="password"
          label="Password"
          value={data.password}
          errorMessage={errors.password || ""}
          IconComponent={HttpsIcon}
          required
          type="password"
        />
      </FormControl>
      <Button
        variant="contained"
        className="login-button"
        disabled={!(data.username.trim() && data.password.trim()) || loading}
        onClick={handleClick}
      >
        {loading ? <CircularProgress className="loading-spinner" /> : "Login"}
      </Button>
      <Box className="navigation-text">
        Are you new here?{" "}
        <Link to="/signup" className="navigate-link-text">
          Signup
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
