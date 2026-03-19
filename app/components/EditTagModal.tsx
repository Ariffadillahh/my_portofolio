"use client";

import { useState } from "react";
import { useEditTagMutation, useGetAllTagQuery } from "../services/tag.service";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TbEdit } from "react-icons/tb";

const EditTags = ({ name, id }: { name: string, id: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [updateTag, { isLoading }] = useEditTagMutation();
    const { refetch } = useGetAllTagQuery();

    const editSchema = yup.object().shape({
        nameTag: yup.string()
            .required("Tag name is required")
            .max(20, "Tag Max 20 Caracter")
            .min(3, 'Tag Min 3 Caracter'),
    });

    type EditTagForm = {
        nameTag: string;
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch, 
        formState: { errors }
    } = useForm<EditTagForm>({
        resolver: yupResolver(editSchema),
        defaultValues: { nameTag: name }
    });

    const nameTagValue = watch("nameTag") || "";

    const handleOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue("nameTag", name);
        setIsOpen(true);
    };

    const handleEdit = async (data: EditTagForm) => {
        try {
            await updateTag({ id, payload: data }).unwrap();
            toast.success("Tag updated successfully");
            setIsOpen(false);
            refetch();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to update tag");
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className='text-blue-600 text-2xl cursor-pointer hover:text-blue-800 transition-colors'
                type="button"
                title="Edit Tag"
            >
                <TbEdit />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-700 animate-in fade-in zoom-in duration-200">

                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit Tag
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

                        <div className="p-6">
                            <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="nameTag" className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Tag Name
                                        </label>
                                        {/* Counter Karakter Tag */}
                                        <span className={`text-xs font-medium ${nameTagValue.length >= 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {nameTagValue.length}/20
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        id="nameTag"
                                        maxLength={20}
                                        className={`bg-gray-50 border ${errors.nameTag ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                                        placeholder="JavaScript"
                                        autoFocus
                                        {...register("nameTag")}
                                    />
                                    {errors.nameTag && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nameTag.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditTags;