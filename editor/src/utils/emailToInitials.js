const emailToInitials = (email) => {
  try {
    const subdomain = "austintexas.gov";
    if (!email.endsWith(subdomain)) return null;
    const [first, last] = email
      .replace("azure_ad", "")
      .replace(subdomain, "")
      .split(".");

    return String(first.charAt(0) + last.charAt(0)).toUpperCase();
  } catch {
    return null;
  }
};

export default emailToInitials;
