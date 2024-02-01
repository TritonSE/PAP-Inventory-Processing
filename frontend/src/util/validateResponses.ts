export function isnum(num: string): boolean {
  return /^\d+$/.test(num);
}

export function validateDate(date: string): string {
  //2 digit number / 2 digit number / 4 digit number
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

export function validateEthnicityOther(ethnicities: string, other: string) {
  if ((ethnicities === "" && other !== "") || (ethnicities !== "" && other === "")) {
    return "Success";
  } else if (ethnicities === "" && other === "") {
    return "Please fill out the other field";
  } else {
    return "Please leave the other field empty";
  }
}
