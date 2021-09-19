import useMuiStyles from "../../hooks/useMuiStyle";
const ValidationMessage = (props) => {
  const classes = useMuiStyles();
  return <div className={classes.errorMessage}>{`* ${props.message}`}</div>;
};
export default ValidationMessage;
