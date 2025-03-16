import crypto from "crypto";

export const generateSecurePassword = (length: number = 12): string => {
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters");
  }

  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "@$!%*?&";
  const allChars = upperChars + lowerChars + numberChars + specialChars;

  const password = [];

  password.push(upperChars[Math.floor(crypto.randomInt(upperChars.length))]);
  password.push(lowerChars[Math.floor(crypto.randomInt(lowerChars.length))]);
  password.push(numberChars[Math.floor(crypto.randomInt(numberChars.length))]);
  password.push(
    specialChars[Math.floor(crypto.randomInt(specialChars.length))]
  );

  for (let i = 4; i < length; i++) {
    password.push(allChars[Math.floor(crypto.randomInt(allChars.length))]);
  }

  // shuffle characters
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.randomInt(i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
};

// Example: "A1!d7B$kLm2&"
