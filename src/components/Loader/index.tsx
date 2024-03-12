import { Backdrop, CircularProgress } from "@mui/material";

type PROP_TYPE = {
  open: boolean;
};

const Loader = ({ open }: PROP_TYPE) => {
  return (
    <Backdrop open={open}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default Loader;
