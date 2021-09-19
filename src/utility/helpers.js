/**
 * Takes the form and set the focus true for each field
 * @param {object} form 
 */
export const setFormFocus = (form) => {
  Object.keys(form).forEach((k) => {
    if (k !== "isFormValid") {
      form[k].focused = true;
    }
  });
};

