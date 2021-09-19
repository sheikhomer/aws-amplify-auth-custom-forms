import "./App.css";
import Amplify from "aws-amplify";
import {
  AmplifyAuthenticator,
} from "@aws-amplify/ui-react";
import Signup from "./components/Signup";
import useMuiStyles from "./hooks/useMuiStyle";
import Login from "./components/Login";
import ErrorDialogue from "./components/common/ErrorDialogue";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
  const classes = useMuiStyles();
  return (
    <div className={classes.root}>
      <ErrorDialogue/>
      <AmplifyAuthenticator usernameAlias="email" hideToast={true}>
        <Login/>
        <Signup/>
      </AmplifyAuthenticator>
    </div>
  );
}
export default App;
