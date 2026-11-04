import axios from "axios";
import { buildWebhookUrl } from "./webhook-url";

// ==========PATCH REQUEST=====================
export const RegisterWebhookRequest = async (
  username: string,
  event_name?: any,
  message?: string,
  status?: string
) => {
  try {
    const res = axios.get(
      buildWebhookUrl(process.env.NEXT_PUBLIC_REGISTER_WEBHOOK_URL!, {
        event_name,
        message,
        status,
        username,
      })
    );
    return res;
  } catch (error: any) {
    return error;
  }
};

export const LoginWebhookRequest = async (
  username: string,
  event_name?: any,
  message?: string,
  status?: string,
  avatar_url?: string
) => {
  try {
    const res = axios.get(
      buildWebhookUrl(process.env.NEXT_PUBLIC_LOGIN_WEBHOOK_URL!, {
        event_name,
        message,
        status,
        username,
        avatar_url,
      })
    );
    return res;
  } catch (error: any) {
    return error;
  }
};

export const PageVisitsWebhook = async (
  username: string,
  event_name?: any,
  message?: string,
  status?: string
) => {
  try {
    const res = axios.get(
      buildWebhookUrl(process.env.NEXT_PUBLIC_PAGE_VISIT_WEBHOOK_URL!, {
        event_name,
        message,
        status,
        username,
      })
    );
    return res;
  } catch (error: any) {
    return error;
  }
};

export const SuccessWebhook = async (
  username: string,
  event_name?: any,
  message?: string,
  status?: string
) => {
  try {
    const res = axios.get(
      buildWebhookUrl(process.env.NEXT_PUBLIC_SUCCESS_WEBHOOK_URL!, {
        event_name,
        message,
        status,
        username,
      })
    );
    return res;
  } catch (error: any) {
    return error;
  }
};

export const ErrorWebhook = async (
  username: string,
  event_name?: any,
  message?: string,
  status?: string
) => {
  try {
    const res = axios.get(
      buildWebhookUrl(process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL!, {
        event_name,
        message,
        status,
        username,
      })
    );
    return res;
  } catch (error: any) {
    return error;
  }
};
