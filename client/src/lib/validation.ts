const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email.trim())) return "Enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return "Password must include a special character (!@#$% etc.)";
  }
  return null;
}

export function validateLogin(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
}

export function validateRegister(name: string, email: string, password: string) {
  const errors: { name?: string; email?: string; password?: string } = {};
  if (!name.trim()) errors.name = "Name is required";
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
}
