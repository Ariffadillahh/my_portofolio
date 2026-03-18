"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import DashboarLayout from '../components/DashboardLayout'
import { HiUser, HiTag, HiKey, HiDocumentText } from 'react-icons/hi'
import { useGetAllTagQuery } from '../services/tag.service'
import { useGetAllPostQuery } from '../services/post.service'
import { LuFile, LuFileSymlink, LuUpload, LuX, LuTrash2, LuLoader } from "react-icons/lu";
import toast from 'react-hot-toast'
import { useCreateCvMutation, useGetCvQuery, useDeleteCvMutation } from '../services/cv.service'

const Page = () => {
    const { data: session } = useSession()

    const { data: tagData, isLoading: loadingTags } = useGetAllTagQuery();
    const { data: postData, isLoading: loadingPosts } = useGetAllPostQuery();

    const [file, setFile] = useState<File | null>(null);

    const { data: existingCv, isLoading: isLoadingGetCv, refetch } = useGetCvQuery();

    const cvData = existingCv?.cv?.[0];
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_CV_URL;

    const [uploadCv, { isLoading: isUploading }] = useCreateCvMutation();
    const [deleteCv, { isLoading: isDeleting }] = useDeleteCvMutation();

    const totalTags = tagData?.tag?.length || 0;
    const totalPosts = postData?.data?.total || 0;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("cv", file);

            await uploadCv(formData).unwrap();
            toast.success("CV Berhasil diupload!");
            setFile(null);
            refetch();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Gagal mengupload CV.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!id) {
            toast.error("Error: ID tidak valid.");
            return;
        }

        if (!confirm("Yakin ingin menghapus CV ini?")) return;

        try {
            await deleteCv(id).unwrap();

            toast.success("CV Berhasil dihapus!");
            refetch();
        } catch (error: any) {
            toast.error("Gagal menghapus CV.");
        }
    }

    return (
        <DashboarLayout>
            <div className="space-y-6">

                <div className='flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome back, <span className="text-blue-600 capitalize">{session?.user?.name}</span>! 👋
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Here is the overview of your content today.</p>
                    </div>
                    <div className='mt-4 md:mt-0'>
                        <span className='px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold'>
                            Administrator
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><HiUser size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Active User</p>
                                <p className="font-bold text-lg text-gray-800 capitalize">{session?.user?.name || "Guest"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <HiTag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Tags</p>
                                <p className="font-bold text-2xl text-gray-800">
                                    {loadingTags ? "..." : totalTags}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <HiDocumentText size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Posts</p>
                                <p className="font-bold text-2xl text-gray-800">
                                    {loadingPosts ? "..." : totalPosts}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='md:flex gap-5 '>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full mb-5 md:mb-0">
                        <div className="flex items-center gap-2 mb-4">
                            <HiKey className="text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-800">Session Token </h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 font-mono break-all leading-relaxed">
                                {session?.user?.token || "No token available"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <LuFileSymlink className="text-blue-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {cvData ? "Manage CV" : "Upload CV"}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {cvData ? "CV Anda saat ini" : "Format PDF, Max 2MB"}
                                </p>
                            </div>
                        </div>

                        {isLoadingGetCv ? (
                            <div className="flex justify-center py-10"><LuLoader className="animate-spin text-blue-500" /></div>
                        ) : cvData ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <LuFile className="text-green-600 w-6 h-6 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-gray-700 truncate block">
                                                {cvData.original_name || "CV_File.pdf"}
                                            </span>
                                            <span className="text-xs text-green-600 font-medium">
                                                Tersimpan di server
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={`${storageUrl}/${cvData.name_cv}`}
                                        download={cvData.original_name}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-500 font-semibold cursor-pointer hover:underline"
                                    >
                                        Saved
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(cvData.id)}
                                    disabled={isDeleting}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                                >
                                    {isDeleting ? (
                                        <> <LuLoader className="animate-spin" /> Menghapus... </>
                                    ) : (
                                        <> <LuTrash2 /> Delete CV </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!file ? (
                                    <label
                                        htmlFor="cv_input"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <LuUpload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            <p className="text-sm text-gray-500 group-hover:text-gray-700">
                                                <span className="font-semibold">Klik untuk upload</span>
                                            </p>
                                            <p className="text-xs text-gray-400">PDF only</p>
                                        </div>
                                        <input
                                            id="cv_input"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <LuFile className="text-blue-500 w-6 h-6 flex-shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-gray-700 truncate block">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <LuX className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!file || isUploading}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all
                                        ${!file || isUploading
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                        }`}
                                >
                                    {isUploading ? (
                                        <> <LuLoader className="animate-spin" /> Mengupload... </>
                                    ) : (
                                        "Simpan CV"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </DashboarLayout>
    )
}

export default Page