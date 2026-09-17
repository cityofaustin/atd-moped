import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const AuthLoadingBackdrop = ({ open }) => {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({
          zIndex: theme.zIndex.modal + 1,
          color: theme.palette.background.default,
        })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
export default AuthLoadingBackdrop;
