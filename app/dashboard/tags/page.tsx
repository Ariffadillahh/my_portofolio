"use client"
import React from 'react'
import Breadcrumb from '@/app/components/Breadcrumb'
import DashboardLayout from '@/app/components/DashboardLayout'
import { useGetAllTagQuery } from '@/app/services/tag.service';
import DeleteTagModal from '@/app/components/DeleteTagModal';
import AddTagModal from '@/app/components/AddTagModal';
import EditTagModal from '@/app/components/EditTagModal';
import { HiOutlineTag } from "react-icons/hi";

const TagsPage = () => {
    const { data, isLoading } = useGetAllTagQuery();
    const tags = data?.tag || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Tags Management</h1>
                        <Breadcrumb title={"Tags"} subTitle='' />
                    </div>
                    <div>
                        <AddTagModal />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : tags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                            <HiOutlineTag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tags found</h3>
                        <p className="text-gray-500 text-sm mt-1">Get started by creating a new tag.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-blue-500 font-bold text-lg">#</span>
                                    <h2 className="font-semibold text-gray-700 capitalize truncate" title={tag.nameTag}>
                                        {tag.nameTag}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                    <EditTagModal name={tag.nameTag} id={tag.id} />
                                    <DeleteTagModal name={tag.nameTag} id={tag.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default TagsPage