import { Alltags } from "../interface/type";
import { apiSlice } from "./base-query";

export const tagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTag: builder.query<Alltags, void>({
      query: () => ({
        url: "/tag",
        method: "GET",
      }),
    }),
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/tag/${id}`,
        method: "DELETE",
      }),
    }),
    createTag: builder.mutation({
      query: (payload) => ({
        url: "/tag",
        method: "POST",
        body: payload,
      }),
    }),
    editTag: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/tag/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const { useGetAllTagQuery, useDeleteTagMutation, useCreateTagMutation, useEditTagMutation } =
  tagApi;
