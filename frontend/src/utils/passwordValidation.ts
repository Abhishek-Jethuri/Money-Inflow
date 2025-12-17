export interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 1: weak, 2: fair, 3: good, 4: strong)
  isValid: boolean;
  feedback: string[];
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

export const validatePassword = (password: string): PasswordStrength => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const feedback: string[] = [];
  let score = 0;

  // Check each criterion and build feedback
  if (!criteria.length) {
    feedback.push("Password must be at least 8 characters long");
  } else {
    score += 1;
  }

  if (!criteria.uppercase) {
    feedback.push("Include at least one uppercase letter (A-Z)");
  } else {
    score += 1;
  }

  if (!criteria.lowercase) {
    feedback.push("Include at least one lowercase letter (a-z)");
  } else {
    score += 1;
  }

  if (!criteria.numbers) {
    feedback.push("Include at least one number (0-9)");
  } else {
    score += 1;
  }

  if (!criteria.symbols) {
    feedback.push("Include at least one special character (!@#$%^&*)");
  } else {
    score += 1;
  }

  // Additional scoring based on length and complexity
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Cap the score at 4
  score = Math.min(score, 4);

  const isValid = Object.values(criteria).every(Boolean) && score >= 3;

  return {
    score,
    isValid,
    feedback,
    criteria,
  };
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return "#ff3b30"; // Red
    case 2:
      return "#ff9500"; // Orange
    case 3:
      return "#ffcc00"; // Yellow
    case 4:
      return "#34c759"; // Green
    default:
      return "#8e8e93"; // Gray
  }
};

export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Unknown";
  }
};
