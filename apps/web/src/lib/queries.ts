import type { CreateChatForm } from "@/lib/types";
import { api } from "@/lib/axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const queries = {
  createChatAPI: `${BASE_URL}/api/chat-group`,
  getAllChats: `${BASE_URL}/api/chat-group`,
};

export const createChat = async (data: CreateChatForm) => {
  return api.post(queries.createChatAPI, data);
};

export const getAllChats = async () => {
  return api.get(queries.createChatAPI).then((res) => res.data);
};
