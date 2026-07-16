export type ContactField = "name" | "email" | "phone" | "fleetSize" | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[+\d][\d\s-]{7,15}$/;

/** Shared by the form (instant feedback) and the API route (never trust the client). */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phonePattern.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  const fleetSize = Number(values.fleetSize);
  if (!values.fleetSize.trim() || !Number.isInteger(fleetSize) || fleetSize < 1) {
    errors.fleetSize = "Enter the number of vehicles (1 or more).";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Tell us a little more — at least 10 characters.";
  }

  return errors;
}

export const emptyContactValues: ContactValues = {
  name: "",
  email: "",
  phone: "",
  fleetSize: "",
  message: "",
};
