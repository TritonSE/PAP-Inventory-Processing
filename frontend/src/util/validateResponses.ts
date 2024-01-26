export function isnum(num: string): boolean {
  return /^\d+$/.test(num);
}

export function validateDate(date: string): string {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(date)) {
    return "Success";
  } else {
    return "Date is not in the correct format";
  }
}

export function validateAge(age: string): string {
  if (!isnum(age)) {
    return "Age is not a number";
  } else {
    return "Success";
  }
}

export function validateSpouseName(maritalStatus: string, spouseName: string): string {
  if (maritalStatus === "Married") {
    return spouseName === "" ? "Spouse name is required" : "Success";
  } else if (maritalStatus === "Single") {
    return spouseName === "" ? "Success" : "Spouse name is not required";
  }
  return "Success";
}

export function checkAgesFormat(ages: string): boolean {
  const ageRegex = /^\d+(,\s*\d+)*$/;
  return ageRegex.test(ages);
}

export function validateNumChildren(numChildren: string, ages: string): string {
  if (!isnum(numChildren)) {
    return "Number of children is not a number";
  }

  const numChildrenInt: number = parseInt(numChildren);

  if (numChildrenInt < 0) {
    return "Number of children cannot be negative";
  } else if (numChildrenInt === 0) {
    if (ages !== "") {
      return "Number of children is 0 but ages are not empty";
    }
  } else if (numChildrenInt > 0) {
    if (ages === "") {
      return "Number of children is greater than 0 but ages are empty";
    } else if (!checkAgesFormat(ages)) {
      return "Ages are not in the correct format, please provide a comma separated list of numbers";
    } else if (checkAgesFormat(ages)) {
      const agesArr = ages.split(",").map((age) => parseInt(age));
      if (agesArr.length !== numChildrenInt) {
        return "Number of children does not match number of ages";
      } else {
        return "Success";
      }
    }
  }

  return "Unknown error";
}

export function validateEthnicityOther(ethnicities: string, other: string) {
  if ((ethnicities === "" && other !== "") || (ethnicities !== "" && other === "")) {
    return "Success";
  } else if (ethnicities === "" && other === "") {
    return "Please fill out the other field";
  } else {
    return "Please leave the other field empty";
  }
}
