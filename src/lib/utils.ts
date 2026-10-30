import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// extract if from url
export const extractIdFromUrl = (url: any) => {
  const parts = url.split("/");

  const id = parts[parts.length - 1];

  return id;
};

export const getProgressIcon = (storagePercentage: number) => {
  if (storagePercentage < 50) {
    return "/Progress-success.svg";
  } else if (storagePercentage >= 50 && storagePercentage < 70) {
    return "/Progress-warning.svg";
  } else {
    return "/Progress-danger.svg";
  }
};

export const truncate = (str: string, len: number) =>
  str.length > len ? `${str.substring(0, len)}...` : str;

export function getPathValue(pathname: string, level: number): string | null {
  const pathSegments = pathname.split("/").filter(Boolean); // Split and remove empty parts

  if (level < 0 || level >= pathSegments.length) {
    return null; // Return null if level is out of bounds
  }

  return decodeURIComponent(pathSegments[level]); // Return the decoded path segment
}

export { isValidEmail } from "./email";
