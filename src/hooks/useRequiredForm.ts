import { useState, useEffect, ChangeEvent, FocusEvent } from "react";

type Values = {
  [key: string]: string;
};

type Errors = {
  [key: string]: Error | null;
};

type Error = {
  content: string;
  pointing: "above";
};

type Touched = { [key: string]: boolean };

const useRequiredForm = (initialFormValue: Values) => {
  const [values, setValues] = useState(initialFormValue);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  useEffect(() => {
    validateForm();
  }, [values, touched]);

  function onChange({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [name]: value });
  }

  function onBlur({ target: { name } }: FocusEvent<HTMLInputElement>) {
    setTouched({ ...touched, [name]: true });
  }

  function destroyForm() {
    setValues(initialFormValue);
    setTouched({});
    setErrors({});
  }

  function handleSubmit(cb: (values: Values) => void) {
    const isFormValid = validateForm();

    if (isFormValid) cb(values);
  }

  function validateForm() {
    const validationErrors = { ...errors };
    let isFormValid = true;

    for (const name in values) {
      if (!values[name] && touched[name]) {
        isFormValid = false;
        validationErrors[name] = {
          content: `${name} is a required field`,
          pointing: "above",
        };
      } else {
        validationErrors[name] = null;
      }
    }
    setErrors(validationErrors);

    return isFormValid;
  }

  return {
    values,
    errors,
    onChange,
    onBlur,
    destroyForm,
    handleSubmit,
  };
};

export default useRequiredForm;