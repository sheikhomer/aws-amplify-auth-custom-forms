import { AmplifySignIn, AmplifyButton } from "@aws-amplify/ui-react";
import constants from "../utility/constants";
import {validate, isFormValid} from "../utility/validate";
import { errorStyle } from "../utility/inlineStyles";
import { useReducer, useRef } from "react";
import ValidationMessage from "./common/ValidationMessage";
import {setFormFocus} from "../utility/helpers";

const formStateReducer = (formState, action) => {
  const { type, name, rules, value } = action;
  if (type === "submit") {
    setFormFocus(formState);
    return {
      ...formState,
    };
  }
  const isValid = validate({ value, type, rules });
  const newFormState = {
    ...formState,
    [name]: {
      focused: true,
      value: value,
      valid: isValid,
    },
  };
  newFormState.isFormValid = isFormValid(newFormState);
  return newFormState;
};

const Login = () => {
  const [formState, dispatch] = useReducer(formStateReducer, {
    isFormValid: false,
    email: {
      valid: false,
      focused: false,
      value: "",
    },
    password: {
      valid: false,
      focused: false,
      value: "",
    }
  });

  const {isFormValid, email, password} = formState;
  const amplifySignInRef = useRef();
  const setAmplifySignInRef = (node) => {
    if (node) {
      const array = [...node.children];
      if (array.some((val) => val.nodeName === "AMPLIFY-SIGN-IN")) {
        amplifySignInRef.current = array.find(
          (val) => val.nodeName === "AMPLIFY-SIGN-IN"
        );
      }
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!isFormValid) {
      dispatch({ type: "submit" });
      return;
    }
    amplifySignInRef.current.handleSubmit(ev);
  };
  const handleValidation = ({ ev, rules }) => {
    const { value, type, name } = ev.target;
    dispatch({ type, name, rules, value });
  };
  const formFields = () => {
    return [
      {
        type: "email",
        label: constants.EMAIL_LABEL,
        placeholder: constants.EMAIL_PLACEHOLDER,
        value: email.value,
        inputProps: {
          autocomplete: "off",
          onBlur: (e) => {
            handleValidation({
              ev: e,
              rules: { required: true },
            });
          },
          style:
            !email.valid && email.focused ? errorStyle : null,
        },
      },
      {
        type: "password",
        label: constants.PASSWORD_LABEL,
        placeholder: constants.PASSWORD_PLACEHOLDER,
        value: password.value,
        inputProps: {
          autocomplete: "off",
          style:
            !password.valid && password.focused
              ? errorStyle
              : null,
          onblur: (e) =>
            handleValidation({
              rules: { required: true },
              ev: e,
            }),
        },
      },
    ];
  };
  return (
    <div ref={setAmplifySignInRef} slot="sign-in">
      <AmplifySignIn formFields={formFields()}>
        <div slot="header-subtitle">
          {!email.valid && email.focused && (
            <ValidationMessage message="Please enter a valid email address" />
          )}
          {!password.valid && password.focused && (
            <ValidationMessage message="Please enter a valid password" />
          )}
        </div>
        <AmplifyButton
          slot="primary-footer-content"
          type="button"
          data-test="sign-in-sign-in-button"
          handleButtonClick={handleSubmit}
        >
          Sign In
        </AmplifyButton>
      </AmplifySignIn>
    </div>
  );
};
export default Login;
