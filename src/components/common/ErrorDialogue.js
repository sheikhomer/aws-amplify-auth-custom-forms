import { Hub } from "@aws-amplify/core";
import ModalDialogue from "../Layout/ModalDialogue";

import {
  TOAST_AUTH_ERROR_EVENT,
  UI_AUTH_CHANNEL,
} from "@aws-amplify/ui-components";
import { useEffect, useState } from "react";

const ErrorDialogue = () => {
  const [message, setMessage] = useState("");
  const handleToastEvent = ({ payload }) => {
    switch (payload.event) {
      case TOAST_AUTH_ERROR_EVENT:
        if (payload.message) {
          setMessage(payload.message);
        }
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    Hub.listen(UI_AUTH_CHANNEL, handleToastEvent);
  }, []);
  const handleClose = () => {
    setMessage("");
  };
  return (
       <ModalDialogue onCloseClick = {handleClose} content = {message} open = {!!message} title ="Error!"/>
  );
};

export default ErrorDialogue;
