/**
 * Validation utility functions for the application.
 */

/**
 * Validates an email address using a standard regex.
 * @param email The email address to validate.
 * @returns boolean True if valid, false otherwise.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates a password based on common requirements.
 * @param password The password to validate.
 * @param minLength Minimum length (default 6).
 * @returns boolean True if valid, false otherwise.
 */
export const validatePassword = (password: string, minLength: number = 6): boolean => {
  return password.length >= minLength;
};
