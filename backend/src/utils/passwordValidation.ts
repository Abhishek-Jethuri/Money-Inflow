const validatePassword = (password: string) => {
  const errors = [];

  // Check minimum length
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { validatePassword };
