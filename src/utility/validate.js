const validate = ({ value, type, rules = {} }) => {
  const testByInputType = ({ type, value }) => {
    let result = true;
    const inputValidationRules = {
      // eslint-disable-next-line
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    };
    switch (type) {
      case "email":
        result = !!value.match(inputValidationRules.email);
        break;
      default:
        break;
    }
    return result;
  };
  const testByRule = ({ ruleName, ruleValue, inputValue }) => {
    let result = false;
    switch (ruleName) {
      case "required":
        result = inputValue.trim() !== "";
        break;
      case "regex":
        result = !!inputValue.match(ruleValue?.value);
        break;
      case "match":
        result = match({ruleValue: ruleValue?.value, inputValue});
        break;
      default:
        break;
    }
    return result;
  };
  let result = testByInputType({ type, value });
    if (result) {
      result = Object.keys(rules).every((key) =>
        testByRule({
          ruleName: key,
          ruleValue: rules[key],
          inputValue: value,
        })
      );
    }
    return result;
};

const match = ({ ruleValue, inputValue }) => {
  return ruleValue === inputValue;
}

const isFormValid = (form) => {
  return Object.keys(form).filter(f => f !== "isFormValid").every((k) => form[k].valid);
};

export {validate, match, isFormValid};
