import { AmplifySignIn, AmplifyButton } from "@aws-amplify/ui-react";
import constants from "../utility/constants";
import {validate} from "../utility/validate";
import { errorStyle } from "../utility/inlineStyles";
import { useReducer, useRef } from "react";
import ValidationMessage from "./common/ValidationMessage";

const formStateReducer = (formState, action) => {
  const { type, name, rules, value } = action;
  if (type === "submit") {
    return {
      ...formState,
      emailFocused: true,
      passwordFocused: true,
    };
  }
  const isValid = validate({ value, type, rules });
  switch (name) {
    case "email":
      return {
        ...formState,
        isFormValid:
          formState.passwordValid && formState.passwordFocused && isValid,
        email: value,
        emailValid: isValid,
        emailFocused: true,
      };
    case "password":
      return {
        ...formState,
        isFormValid: formState.emailValid && formState.emailFocused && isValid,
        password: value,
        passwordValid: isValid,
        passwordFocused: true,
      };
    default:
      return {
        ...formState,
      };
  }
};

const Login = () => {
  const [formState, dispatch] = useReducer(formStateReducer, {
    isFormValid: false,
    email: "",
    emailValid: false,
    emailFocused: false,
    password: "",
    passwordValid: false,
    passwordFocused: false,
  });

  let amplifySignInRef = useRef();
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
    if (!formState.isFormValid) {
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
        value: formState.email,
        inputProps: {
          autocomplete: "off",
          onBlur: (e) => {
            handleValidation({
              ev: e,
              rules: { required: true },
            });
          },
          style:
            !formState.emailValid && formState.emailFocused ? errorStyle : null,
        },
      },
      {
        type: "password",
        label: constants.PASSWORD_LABEL,
        placeholder: constants.PASSWORD_PLACEHOLDER,
        value: formState.password,
        inputProps: {
          autocomplete: "off",
          style:
            !formState.passwordValid && formState.passwordFocused
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
          {!formState.emailValid && formState.emailFocused && (
            <ValidationMessage message="Please enter a valid email address" />
          )}
          {!formState.passwordValid && formState.passwordFocused && (
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
