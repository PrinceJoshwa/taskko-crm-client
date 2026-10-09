export function displayOrganizationName(name) {
  return typeof name === "string" && name.trim().toLowerCase() === "jagati" ? "Jagathi" : name;
}
