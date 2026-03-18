import { get } from "node:http";
import { apiSlice } from "./base-query";
import { AllMessages, Message } from "../interface/type";

export const messageApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMessages: builder.query<
      AllMessages,
      { page: number; search?: string; per_page?: number }
    >({
      query: ({ page, search, per_page }) => ({
        url: `/message`,
        method: "GET",
        params: { page, search, per_page },
      }),
      providesTags: ["Messages"],
    }),
    creteMessage: builder.mutation<Message, Partial<Message>>({
      query: (payload) => ({
        url: `/message`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation<Message, any>({
      query: (id) => ({
        url: `/message/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useCreteMessageMutation,
} = messageApi;
