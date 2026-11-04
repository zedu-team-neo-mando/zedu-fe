import React from "react";

export const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}k+`;
  } else {
    const millions = Math.floor(count / 1000000);
    return `${millions}m+`;
  }
};

export const filteredData = (data: any[], inputData: string) => {
  const searchTerm = inputData.toLowerCase();

  return data?.filter((item) => {
    return (
      item.username?.toLowerCase().includes(searchTerm) ||
      item.full_name?.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm) ||
      item.content?.toLowerCase().includes(searchTerm) ||
      item.status?.toLowerCase().includes(searchTerm)
    );
  });
};

export const filteredApps = (data: any[], inputData: string) => {
  const searchTerm = inputData.toLowerCase();

  return data?.filter((item) => {
    return (
      item.app_name?.toLowerCase().includes(searchTerm) ||
      item.app_url?.toLowerCase().includes(searchTerm) ||
      item.app_description?.toLowerCase().includes(searchTerm)
    );
  });
};

// Order sorted
export const sortedData = (data: any, values: string) => {
  return data?.filter((item: any) => {
    if (values === "success") {
      return item.status === "success";
    } else if (values === "error") {
      return item.status === "error";
    } else {
      return item;
    }
  });
};

// format auth url
export function formatSlackOAuthUrl(url: string) {
  // Decode the encoded characters in the URL (e.g. \u0026 to &)
  const decodedUrl = decodeURIComponent(url.replace(/\\u0026/g, "&"));

  // Extract the query parameters
  const queryParams = decodedUrl.split("?")[1]; // Get the part after '?'
  const params = new URLSearchParams(queryParams);

  // Extract client_id, scope, and redirect_uri
  const clientId = params.get("client_id");
  const scope = params.get("scope");
  const redirectUri = params.get("redirect_uri");

  return {
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  };
}

// extract query params
export const extractUrlQuery = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.origin + parsedUrl.pathname;
};

export function getFirstTwoWords(text: string) {
  const words = text?.split(" ");

  let result = words.slice(0, 2).join(" ");

  if (result.length > 16) {
    result = result.slice(0, 16) + "...";
  }

  return result;
}

export const getInitials = (name: string) => {
  return name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const orderResponseAlphabetically = (response: any) => {
  return response.sort((a: any, b: any) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
};

import { showError } from "~/components/toast/sonner";
export const validateUrl = (input: string) => {
  const urlPattern = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

  if (!input.startsWith("https://")) {
    showError("URL must start with 'https://'");
    return;
  }

  if (!input.includes(".")) {
    showError("URL must contain a top-level domain (e.g., .com, .net)");
    return;
  }

  if (!urlPattern.test(input)) {
    showError(
      "Invalid URL format. Please enter a valid URL (e.g., https://myurl.com)"
    );
    return;
  }

  return true;
};

export const isSubscriptionActive = (endDate: string): boolean => {
  const endDateTime = new Date(endDate).getTime();
  const currentDateTime = new Date().getTime();

  return currentDateTime < endDateTime;
};

export const downloadInvoice = async (invoiceUrl: string) => {
  try {
    const response = await fetch(invoiceUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    // Create a Blob from the response
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "invoice.pdf"; // Set default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free memory
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading invoice:", error);
  }
};

// Lives in its own module so it can be tested without the rest of utils.
export { stripHtmlTags } from "./strip-html";

export function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function RefreshEntities(
  setIsRotating: React.Dispatch<React.SetStateAction<boolean>>,
  callback?: () => void
) {
  setIsRotating(true);
  if (callback) callback();

  setTimeout(() => setIsRotating(false), 1000);
}
