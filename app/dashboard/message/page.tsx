"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Breadcrumb from "@/app/components/Breadcrumb";
import { HiDocumentText } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { useGetMessagesQuery } from "@/app/services/message.service";
import DeleteMessageModal from "@/app/components/DeleteMessageModal";
import SeeMessageModal from "@/app/components/SeeMessageModal";
import { Message } from "@/app/interface/type";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

const Page = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(search, 500);

    const {
        data: messageData,
        isLoading,
        isFetching,
    } = useGetMessagesQuery({
        search: debouncedSearch,
        page,
        per_page: 10,
    });

    const messages = messageData?.data?.data || [];
    const meta = messageData?.data;

    return (
        <DashboardLayout>
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Message On Contact
                        </h1>
                        <Breadcrumb title="Messages" subTitle="" />
                    </div>
                </div>

                <div className="relative w-full sm:w-72">
                    <CiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-10 bg-gray-200 rounded animate-pulse"
                            />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
                        <HiDocumentText className="w-8 h-8 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">
                            No message found
                        </h3>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto bg-white border rounded-xl shadow-sm">

                        {isFetching && (
                            <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
                                <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Name</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">Content</th>
                                    <th className="px-6 py-4 font-bold text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {messages.map((message: Message) => (
                                    <tr
                                        key={message.id}
                                        className="hover:bg-blue-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {message.name}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {message.email}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {message.content.length > 10
                                                ? message.content.slice(0, 10) + "..."
                                                : message.content}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-1">
                                                <SeeMessageModal message={message.content} />
                                                <DeleteMessageModal
                                                    name={message.name}
                                                    id={message.id}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-col gap-4 p-4 border-t
                sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs sm:text-sm text-gray-400 uppercase">
                                Total data:
                                <span className="ml-1 text-gray-900 font-semibold">
                                    {meta?.total ?? 0}
                                </span>
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                                <div className="flex items-center justify-between sm:justify-center gap-2">
                                    <button
                                        disabled={page === 1 || isFetching}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="w-full sm:w-auto px-4 py-2 border rounded
                   disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Prev
                                    </button>

                                    <span className="px-3 py-2 text-xs sm:text-sm text-gray-600
                       bg-gray-50 rounded border whitespace-nowrap">
                                        Page {meta?.current_page ?? 1} of {meta?.last_page ?? 1}
                                    </span>

                                    <button
                                        disabled={isFetching || page >= (meta?.last_page ?? 1)}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="w-full sm:w-auto px-4 py-2 border rounded
                   disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Page;
