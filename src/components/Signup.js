import { AmplifySignUp } from "@aws-amplify/ui-react";
import constants from "../utility/constants";
import { validate, match } from "../utility/validate";
import { errorStyle } from "../utility/inlineStyles";
import { useReducer, useRef } from "react";

const formStateReducer = (formState, action) => {
  const { type, name, rules, value } = action;
  if (type === "submit") {
    Object.keys(formState).forEach((k) => {
      formState[k].focused = true;
    });
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
      matched:
        rules["match"] !== undefined
          ? match({ ruleValue: rules.match?.value, inputValue: value })
          : undefined,
    },
  };
  newFormState.isFormValid = isFormValid(newFormState);
  return newFormState;
};

const isFormValid = (formState) => {
  return Object.keys(formState).every((k) => formState[k].valid);
};

const Signup = () => {
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
      matched: false,
    },
    confirmPassword: {
      valid: false,
      focused: false,
      value: "",
      matched: false,
    },
    firstname: {
      valid: false,
      focused: false,
      value: "",
    },
    lastname:{
      valid: false,
      focused: false,
      value: "",
    },
    phone:{
      valid: false,
      focused: false,
      value: "",
    }
  });
  const handleValidation = ({ ev, rules }) => {
    const { value, type, name } = ev.target;
    dispatch({ type, name, rules, value });
  };
  const {isFormValid, email, password, confirmPassword, firstname, lastname, phone} = formState;
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
          style: !email.valid && email.focused ? errorStyle : null,
        },
      },
      {
        type: "password",
        label: constants.PASSWORD_LABEL,
        placeholder: constants.PASSWORD_PLACEHOLDER,
        value: password.value,
        inputProps: {
          autocomplete: "off",
          style: !password.valid && password.focused ? errorStyle : null,
          onblur: (e) =>
            handleValidation({
              rules: {
                required: true,
                match: { value: confirmPassword.value },
              },
              ev: e,
            }),
        },
      },
      {
        type: "password",
        label: constants.CONFIRM_PASSWORD_LABEL,
        placeholder: constants.CONFIRM_PASSWORD_PLACEHOLDER,
        value: confirmPassword.value,
        inputProps: {
          name: "confirmPassword",
          autocomplete: "off",
          style:
            !confirmPassword.valid && confirmPassword.focused
              ? errorStyle
              : null,
          onblur: (e) =>
            handleValidation({
              rules: { required: true, match: { value: password.value } },
              ev: e,
            }),
        },
      },
      {
        type: "text",
        label: `${constants.FIRSTNAME_LABEL} ${constants.REQUIRED_LABEL}`,
        placeholder: constants.FIRSTNAME_PLACEHOLDER,
        value: firstname.value,
        inputProps: {
          name: "firstname",
          autocomplete: "off",
          onBlur: (e) => {
            handleValidation({
              ev: e,
              rules: { required: true },
            });
          },
          style: !firstname.valid && firstname.focused ? errorStyle : null,
        },
      },
      {
        type: "text",
        label: `${constants.LASTNAME_LABEL} ${constants.REQUIRED_LABEL}`,
        placeholder: constants.LASTNAME_PLACEHOLDER,
        value: lastname.value,
        inputProps: {
          name: "lastname",
          autocomplete: "off",
          onBlur: (e) => {
            handleValidation({
              ev: e,
              rules: { required: true },
            });
          },
          style: !lastname.valid && lastname.focused ? errorStyle : null,
        },
      },
      {
        type: "tel",
        label: constants.PHONE_LABEL,
        placeholder: constants.PHONE_PLACEHOLDER,
        value: phone.value,
        inputProps: {
          name: "phone",
          autocomplete: "off",
          onBlur: (e) => {
            handleValidation({
              ev: e,
              rules: { required: true },
            });
          },
          style: !phone.valid && phone.focused ? errorStyle : null,
        },
      },
    ];
  };
  return (
    <div slot="sign-up">
      <AmplifySignUp formFields={formFields()}></AmplifySignUp>
    </div>
  );
};
export default Signup;
