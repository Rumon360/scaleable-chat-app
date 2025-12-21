import type { CreateChatForm } from "@/lib/types";
import { api } from "@/lib/axios";
import type { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const queries = {
  createChatAPI: `${BASE_URL}/api/chat-group`,
  getAllChats: `${BASE_URL}/api/chat-group`,
};

export const createChat = async (data: CreateChatForm) => {
  return api.post(queries.createChatAPI, data);
};

export const getAllChats = async (config?: AxiosRequestConfig) => {
  const res = await api.get(queries.getAllChats, config);
  return res.data;
};
