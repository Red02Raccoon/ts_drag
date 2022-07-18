interface FormValues {
  title: string;
  description: string;
  people: number;
}

interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
}

interface FormValidation {
  [prop: string]: FieldValidation;
}

export const validation = (
  values: FormValues,
  rules: FormValidation
): boolean => {
  let isValid = true;

  const data = Object.entries(values || {});

  if (!data) {
    return false;
  }

  data.forEach(([key, value]) => {
    const currentRules = rules[key];

    if (!currentRules) {
      return;
    }

    const { required, min, max } = currentRules;

    if (required) {
      isValid = isValid && value.toString().trim().length !== 0;
    }

    if (min != null && typeof value === "number") {
      isValid = isValid && value >= min;
    }

    if (max != null && typeof value === "number") {
      isValid = isValid && value <= max;
    }
  });

  return isValid;
};
