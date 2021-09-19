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
        result = !!inputValue.match(ruleValue);
        break;
      case "match":
        result = match({ruleValue, inputValue});
        break;
      default:
        break;
    }
    return result;
  };
  let result = testByInputType({ type, value });
    if (result) {
      result = Object.keys(rules).every((key, index) =>
        testByRule({
          ruleName: key,
          ruleValue: rules[index],
          inputValue: value,
        })
      );
    }
    return result;
};

const match = ({ ruleValue, inputValue }) => {
  return ruleValue === inputValue;
}

export {validate, match};
