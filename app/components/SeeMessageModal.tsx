"use client";

import { useState } from "react";
import { TbEyeShare } from "react-icons/tb";

const SeeMessageModal = ({ message }: { message: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-100"
                type="button"
                title="View Message"
            >
                <TbEyeShare size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl dark:bg-gray-700 animate-in fade-in zoom-in duration-200 p-5">
                        <div className="flex justify-between items-center border-b">
                            <button
                                onClick={() => setIsOpen(false)}
                                type="button"
                                className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                ✕
                            </button>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Message
                            </h3>
                        </div>

                        <div className="my-4">
                            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SeeMessageModal;
