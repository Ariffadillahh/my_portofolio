"use client";

import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useDeleteTagMutation, useGetAllTagQuery } from "../services/tag.service";
import toast from "react-hot-toast";

const DeleteModal = ({ name, id }: { name: string, id: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteTag, { isLoading }] = useDeleteTagMutation();
    const { refetch } = useGetAllTagQuery();

    const handleOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    };

    const handleClose = () => setIsOpen(false);

    const handleDelete = async () => {
        try {
            await deleteTag(id).unwrap();
            toast.success("Deleted successfully");
            setIsOpen(false);
            refetch()
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to delete");
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
                title="Delete"
                type="button"
            >
                <MdDelete size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl dark:bg-gray-700 animate-in fade-in zoom-in duration-200">

                        <button
                            onClick={handleClose}
                            type="button"
                            className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>

                        <div className="p-6 text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-gray-100">"{name}"</span>?
                            </h3>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center disabled:opacity-50"
                                >
                                    {isLoading ? "Deleting..." : "Yes, I'm sure"}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-blue-700 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteModal;