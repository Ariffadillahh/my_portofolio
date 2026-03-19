"use client";

import { useState } from "react";
import { useCreateTagMutation, useGetAllTagQuery } from "../services/tag.service";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AddTags = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [createTag, { isLoading }] = useCreateTagMutation();
    const { refetch } = useGetAllTagQuery();

    const createSchema = yup.object().shape({
        nameTag: yup.string()
            .required("Tag Name is required")
            .max(20, "Tag Max 20 Caracter")
            .min(3, 'Tag Min 3 Caracter')
    });

    type CreateTagForm = {
        nameTag: string;
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreateTagForm>({
        resolver: yupResolver(createSchema),
    });

    const nameTagValue = watch("nameTag") || "";

    const createHandle = async (data: CreateTagForm) => {
        try {
            const res = await createTag(data).unwrap();
            toast.success("Tag created successfully");
            reset();
            setIsOpen(false);
            refetch();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to create tag");
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 shadow-sm transition-all"
            >
                Create Tag
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-700 animate-in fade-in zoom-in duration-200">

                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Create New Tag
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <form onSubmit={handleSubmit(createHandle)}>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="nameTag" className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Tag Name
                                        </label>
                                        <span className={`text-xs font-medium ${nameTagValue.length >= 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {nameTagValue.length}/20
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        id="nameTag"
                                        maxLength={20}
                                        className={`bg-gray-50 border ${errors.nameTag ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                                        placeholder="e.g. JavaScript, PHP"
                                        autoFocus
                                        {...register("nameTag")}
                                    />
                                    {errors.nameTag && (
                                        <p className="mt-1 text-sm text-red-500">{errors.nameTag.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Tag"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTags;