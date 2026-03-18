import { PostPagination, Post, AllPosts, PostById } from "../interface/type";
import { apiSlice } from "./base-query";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query<
      AllPosts,
      { search?: string; page?: number; per_page?: number } | void
    >({
      query: ({ search = "", page = 1, per_page = 5 } = {}) => ({
        url: "/post",
        method: "GET",
        params: {
          search,
          page,
          per_page,
        },
      }),
      providesTags: ["Posts"],
    }),
    getPost: builder.query<PostById, string>({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    createPost: builder.mutation({
      query: (payload) => ({
        url: "/post",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/post/${id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useGetPostQuery,
  useDeletePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
} = postApi;
