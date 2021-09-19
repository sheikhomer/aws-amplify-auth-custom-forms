import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import useMuiStyles from "../../hooks/useMuiStyle";

const ModalDialogue = (props) => {
  const classes = useMuiStyles();
  return (
    <Dialog open={props.open} className={classes.dialog}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <Button onClick={props.onCloseClick}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialogue;
