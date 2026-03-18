import { url } from "node:inspector";
import { apiSlice } from "./base-query";
import { CvResponse } from "../interface/type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    CreateCv: builder.mutation({
      query: (payload) => ({
        url: "/cv",
        method: "POST",
        body: payload,
      }),
    }),
    getCv: builder.query<CvResponse, void>({
      query: () => ({
        url: "/cv",
        method: "GET",
      }),
    }),
    deleteCv: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/cv/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateCvMutation, useGetCvQuery, useDeleteCvMutation } =
  authApi;
