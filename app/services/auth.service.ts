import { url } from "node:inspector";
import { apiSlice } from "./base-query";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (Credentials) => ({
        url: "/login",
        method: "POST",
        body: Credentials,
      }),
    }),
    logout: builder.mutation<{ status: boolean; message?: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    snedOtp: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/reset-password",
        method: "POST",
        body: payload,
      }),
    }),

    Cv: builder.mutation({
      query: (payload) => ({
        url: "/cv",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useResetPasswordMutation, useSnedOtpMutation } = authApi;
