export function isnum(num: string): boolean {
  return /^\d+$/.test(num);
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
