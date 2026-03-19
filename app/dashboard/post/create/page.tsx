"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllTagQuery } from "@/app/services/tag.service";
import { useCreatePostMutation, useGetAllPostQuery } from "@/app/services/post.service";
import DashboardLayout from "@/app/components/DashboardLayout";
import Breadcrumb from "@/app/components/Breadcrumb";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { HiOutlineCloudUpload, HiX, HiOutlinePhotograph, HiLink, HiTemplate } from "react-icons/hi";

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

export default function CreatePostPage() {
    const { data: tags, isLoading: isLoadingTags } = useGetAllTagQuery();
    const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
    const { refetch } = useGetAllPostQuery();
    const router = useRouter();

    const [clientReady, setClientReady] = useState(false);
    const [searchTag, setSearchTag] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("archived");
    const [link, setLink] = useState("");

    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setClientReady(true);
        return () => {
            imageFiles.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, []);

    const filteredTags = useMemo(() => {
        if (!tags?.tag) return [];
        return tags.tag.filter(tag =>
            tag.nameTag.toLowerCase().includes(searchTag.toLowerCase())
        );
    }, [tags, searchTag]);

    const handleTagChange = (nameTag: string, checked: boolean) => {
        if (checked) {
            setSelectedTags((prev) => [...prev, nameTag]);
        } else {
            setSelectedTags((prev) => prev.filter((tag) => tag !== nameTag));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                id: `img-${Math.random().toString(36).substr(2, 9)}`,
                file,
                preview: URL.createObjectURL(file),
            }));
            setImageFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeImage = (id: string) => {
        setImageFiles((prev) => prev.filter((img) => img.id !== id));
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(imageFiles);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setImageFiles(items);
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Judul wajib diisi")
            .min(3, "Judul minimal 3 karakter")
            .max(30, "Judul maksimal 30 karakter"),
        description: Yup.string()
            .required("Deskripsi wajib diisi")
            .min(5, "Deskripsi minimal 5 karakter")
            .max(1000, "Deskripsi maksimal 1000 karakter"),
        link: Yup.string()
            .url("Format URL tidak valid (awali dengan http/https)")
            .nullable(),
        selectedTags: Yup.array()
            .min(1, "Minimal pilih 1 kategori/tag"),
        imageFiles: Yup.array()
            .min(1, "Gambar wajib diupload minimal 1"),
    });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToValidate = { title, description, link, selectedTags, imageFiles };

        try {
            await validationSchema.validate(dataToValidate, { abortEarly: false });
            setErrors({});

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("status", status);
            if (link) formData.append("link", link);

            selectedTags.forEach((tag) => formData.append("tags[]", tag));

            imageFiles.forEach((imgObj) => {
                formData.append("images[]", imgObj.file);
            });

            await createPost(formData).unwrap();

            toast.success("Postingan berhasil dibuat!", { duration: 3000 });
            refetch();
            router.push("/dashboard/post");

        } catch (err: any) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((error) => {
                    if (error.path) newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
                toast.error("Mohon periksa kembali form anda");
            } else {
                console.error("API Error:", err);
                let errorMessage = "Terjadi kesalahan sistem";
                if (err?.data?.message) {
                    errorMessage = typeof err.data.message === 'string'
                        ? err.data.message
                        : JSON.stringify(err.data.message);
                }
                toast.error(errorMessage);
            }
        }
    };

    if (!clientReady) return null;

    const labelStyle = "block mb-2 text-sm font-semibold text-gray-700";
    const inputStyle = (hasError: boolean) => `
        w-full p-3 text-sm text-gray-900 bg-white border rounded-lg transition-all outline-none
        ${hasError
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
    `;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Buat Postingan Baru</h1>
                    <Breadcrumb title="Postingan" subTitle="Buat Baru" />
                </div>

                <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                        Judul Postingan
                                    </label>
                                    <span className={`text-xs font-medium ${title.length >= 30 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {title.length}/30
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    maxLength={30}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputStyle(!!errors.title)}
                                    placeholder="Contoh: Tutorial Belajar Next.js"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="desc" className="block text-sm font-semibold text-gray-700">
                                        Deskripsi Lengkap
                                    </label>
                                    <span className={`text-xs font-medium ${description.length >= 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {description.length}/1000
                                    </span>
                                </div>
                                <textarea
                                    id="desc"
                                    maxLength={1000} 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`${inputStyle(!!errors.description)} h-40 resize-y`}
                                    placeholder="Tuliskan konten artikel anda disini..."
                                ></textarea>
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                            </div>

                            <div>
                                <label htmlFor="link" className={labelStyle}>
                                    Link Eksternal (Opsional)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <HiLink className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="link"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className={`${inputStyle(!!errors.link)} pl-10`}
                                        placeholder="https://contoh-website.com"
                                    />
                                </div>
                                {errors.link && <p className="mt-1 text-xs text-red-500">{errors.link}</p>}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <HiOutlinePhotograph className="text-lg text-blue-600" />
                                Galeri Gambar
                            </h3>

                            {errors.imageFiles && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
                                    {errors.imageFiles}
                                </div>
                            )}

                            <div className="mb-6">
                                <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 transition-all group ${errors.imageFiles ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'}`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <HiOutlineCloudUpload className={`w-8 h-8 mb-2 transition-colors ${errors.imageFiles ? 'text-red-400' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                        <p className={`text-sm ${errors.imageFiles ? 'text-red-500' : 'text-gray-500 group-hover:text-blue-600'}`}>
                                            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>

                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="post-images" direction="horizontal">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                        >
                                            {imageFiles.map((img, index) => (
                                                <Draggable key={img.id} draggableId={img.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border ${snapshot.isDragging ? 'border-blue-500 shadow-lg z-50' : 'border-gray-200'}`}
                                                        >
                                                            <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(img.id)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm"
                                                                title="Hapus gambar"
                                                            >
                                                                <HiX size={14} />
                                                            </button>
                                                            <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4">Tags</h3>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTag}
                                onChange={(e) => setSearchTag(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 border-gray-300"
                            />

                            {isLoadingTags ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                                    <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-100 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                    {filteredTags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className="flex items-center p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag.nameTag)}
                                                onChange={(e) => handleTagChange(tag.nameTag, e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ms-3 text-sm font-medium text-gray-700 capitalize">
                                                #{tag.nameTag}
                                            </span>
                                        </label>
                                    ))}

                                    {filteredTags.length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-4">
                                            No matching tags found.
                                        </p>
                                    )}
                                </div>
                            )}
                            {errors.selectedTags && <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded border border-red-100">{errors.selectedTags}</p>}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <HiTemplate className="text-lg text-blue-600" />
                                Status Publikasi
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Pilih Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="publish">Publish</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isCreatingPost}
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isCreatingPost ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Postingan"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}