import { makeStyles } from "@material-ui/core/styles";
const useMuiStyles = makeStyles((theme) => ({
  root: {
    "--amplify-font-family": theme.typography.fontFamily,
    "--amplify-primary-color": theme.palette.primary.dark,
    "--amplify-primary-tint": theme.palette.primary.light,
    "--amplify-primary-shade": theme.palette.primary.light,
    "--link-color": "var(--amplify-primary-color)",
  },
  dialog: {
    "& .MuiButton-root": {
      backgroundColor: theme.palette.primary.dark,
      color: "#fff",
      fontSize: "0.675rem",
    },
    "& .MuiButton-root:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& .MuiDialogTitle-root": {
      backgroundColor: theme.palette.primary.dark,
      color: "#fff",
      padding: "6px 5px",
      "& ..MuiTypography-h6": {
        fontSize: "1.05rem",
      },
    },
  },
  errorMessage: {
    color: "#cc0000",
  },
}));

export default useMuiStyles;
