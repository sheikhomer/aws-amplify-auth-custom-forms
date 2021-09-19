import { AmplifySignUp } from "@aws-amplify/ui-react";
import { Auth } from "@aws-amplify/auth";
import constants from "../utility/constants";
import { validate, match, isFormValid } from "../utility/validate";
import { errorStyle } from "../utility/inlineStyles";
import { useReducer, useRef } from "react";
import { dispatchToastHubEvent } from "@aws-amplify/ui-components/dist/collection/common/helpers";
import { handleSignIn } from "@aws-amplify/ui-components/dist/collection/common/auth-helpers";
import { setFormFocus } from "../utility/helpers";
import ValidationMessage from "./common/ValidationMessage";
import { AuthState } from "@aws-amplify/ui-components";

const formStateReducer = (formState, action) => {
  const { type, name, rules, value } = action;
  if (type === "submit") {
    setFormFocus(formState);
    return {
      ...formState,
    };
  }

  if (type === "error") {
    return {
      ...formState,
      isFormValid: false,
      password: {
        value: "",
        valid: false,
        matched: false,
        focused: true,
      },
      confirmPassword: {
        value: "",
        valid: false,
        matched: false,
        focused: true,
      },
    };
  }
  const isValid = validate({ value, type, rules });

  if (rules["match"] !== undefined) {
    formState[rules["match"].field].valid = isValid;
    formState[rules["match"].field].matched = isValid;
  }

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

const Signup = () => {
  const amplifySignUpRef = useRef();
  const setAmplifySignUpRef = (node) => {
    if (node) {
      const array = [...node.children];
      if (array.some((val) => val.nodeName === "AMPLIFY-SIGN-UP")) {
        amplifySignUpRef.current = array.find(
          (val) => val.nodeName === "AMPLIFY-SIGN-UP"
        );
      }
    }
  };
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
    lastname: {
      valid: false,
      focused: false,
      value: "",
    },
    phone: {
      valid: false,
      focused: false,
      value: "",
    },
  });
  const handleValidation = ({ ev, rules }) => {
    const { value, type, name } = ev.target;
    dispatch({ type, name, rules, value });
  };
  const {
    isFormValid,
    email,
    password,
    confirmPassword,
    firstname,
    lastname,
    phone,
  } = formState;
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isFormValid) {
      dispatch({ type: "submit" });
      return;
    }
    try {
      const authData = {
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value,
          phone_number: `+44${phone.value}`,
          given_name: firstname.value,
          family_name: lastname.value,
        },
      };
      const data = await Auth.signUp(authData);
      if (data.userConfirmed) {
        await handleSignIn(
          email.value,
          password.value,
          amplifySignUpRef.current.handleAuthStateChange
        );
      } else {
        const signUpAttrs = { ...authData };
        amplifySignUpRef.current.handleAuthStateChange(
          AuthState.ConfirmSignUp,
          {
            ...data.user,
            signUpAttrs,
          }
        );
      }
    } catch (error) {
      dispatch({ type: "error" });
      dispatchToastHubEvent(error);
    }
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
                match: {
                  value: confirmPassword.value,
                  field: "confirmPassword",
                },
                regex: {
                  value: /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/,
                },
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
              rules: {
                required: true,
                match: { value: password.value, field: "password" },
                regex: {
                  value: /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/,
                },
              },
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
              rules: {
                required: true,
                regex: { value: /^(0[1-9][0-9]{8,9})$/ },
              },
            });
          },
          style: !phone.valid && phone.focused ? errorStyle : null,
        },
      },
    ];
  };
  return (
    <div slot="sign-up" ref={setAmplifySignUpRef}>
      <AmplifySignUp formFields={formFields()} handleSubmit={handleSubmit}>
        <div slot="header-subtitle">
          {!email.valid && email.focused && (
            <ValidationMessage message="Please enter a valid email address" />
          )}
          {(!password.valid || !confirmPassword.valid) &&
            (password.focused || confirmPassword.focused) && (
              <ValidationMessage message="Please enter your password (must have at least 8 characters with at least one number) and confirm it" />
            )}
          {!firstname.valid && firstname.focused && (
            <ValidationMessage message="Please enter your firstname" />
          )}
          {!lastname.valid && lastname.focused && (
            <ValidationMessage message="Please enter your lastname" />
          )}
          {!phone.valid && phone.focused && (
            <ValidationMessage message="Please enter a valid UK phone number" />
          )}
        </div>
      </AmplifySignUp>
    </div>
  );
};
export default Signup;
