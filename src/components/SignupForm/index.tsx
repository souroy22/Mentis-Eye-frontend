import { useState } from "react";
import { Box, Button, CircularProgress, FormControl } from "@mui/material";
import "./style.css";
import { USER_STATE_TYPE } from "../../App";
import TextInput from "../Textinput";
import { signup } from "../../api/auth.api";
import notification from "../../configs/notification";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import { customLocalStorage } from "../../services/utils/localStorage";

type PROP_TYPE = {
  setUser: (value: USER_STATE_TYPE) => void;
};

export type SIGNUP_DATA_TYPE = {
  name: string;
  username: string;
  password: string;
};

type ERRORS_TYPE = {
  name: string | null;
  username: string | null;
  password: string | null;
};

const SignupForm = ({ setUser }: PROP_TYPE) => {
  const [data, setData] = useState<SIGNUP_DATA_TYPE>({
    name: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ERRORS_TYPE>({
    name: null,
    username: null,
    password: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await signup(data);
      setUser(res.user);
      customLocalStorage.setData("token", res.token);
      navigate("/");
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
          id="name"
          name="name"
          label="Full Name"
          value={data.name}
          errorMessage={errors.name || ""}
          IconComponent={PiUserCircleGearDuotone}
          required
        />
      </FormControl>
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
        disabled={
          !(data.name.trim() && data.username.trim() && data.password.trim()) ||
          loading
        }
        onClick={handleClick}
      >
        {loading ? <CircularProgress className="loading-spinner" /> : "Sign up"}
      </Button>
      <Box className="navigation-text">
        Are you one of us?{" "}
        <Link to="/signin" className="navigate-link-text">
          Login
        </Link>
      </Box>
    </Box>
  );
};

export default SignupForm;