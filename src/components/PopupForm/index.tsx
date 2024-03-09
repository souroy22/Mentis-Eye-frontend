import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

type PropTypes = {
  title: string;
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  width?: string | number;
};

const PopupForm = ({
  title,
  open,
  handleClose,
  children,
  width = "200px",
}: PropTypes) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ "& .MuiPaper-root": { width } }}
    >
      <DialogTitle sx={{ paddingBottom: "10px" }}>{title}</DialogTitle>
      <DialogContent className="popup-content">{children}</DialogContent>
    </Dialog>
  );
};

export default PopupForm;
