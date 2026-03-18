"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetPostQuery, useUpdatePostMutation, useGetAllPostQuery } from "@/app/services/post.service";
import { useGetAllTagQuery } from "@/app/services/tag.service";
import DashboardLayout from "@/app/components/DashboardLayout";
import Breadcrumb from "@/app/components/Breadcrumb";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { HiOutlineCloudUpload, HiX, HiOutlinePhotograph } from "react-icons/hi";

interface DndImage {
    id: string;
    preview: string;
    file: File | null;
    originalName?: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: postData, isLoading, refetch: refetchPost } = useGetPostQuery(id);
    const { refetch: refetchAllPosts } = useGetAllPostQuery();
    const { data: tagData } = useGetAllTagQuery();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [status, setStatus] = useState("draft");
    const [tags, setTags] = useState<string[]>([]);
    const [searchTag, setSearchTag] = useState("");

    const [dndImages, setDndImages] = useState<DndImage[]>([]);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (postData?.post) {
            const p = postData.post;
            setTitle(p.title);
            setDescription(p.description);
            setLink(p.link || "");
            setStatus(p.status);
            setTags(p.tags || []);

            if (p.images && Array.isArray(p.images)) {
                const existingImages: DndImage[] = p.images.map((url: string) => ({
                    id: `existing-${Math.random().toString(36).substr(2, 9)}`,
                    preview: url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${url}`,
                    file: null,
                    originalName: url.split('/').pop()
                }));
                setDndImages(existingImages);
            }
        }
    }, [postData]);

    useEffect(() => {
        return () => {
            dndImages.forEach(img => {
                if (img.file) URL.revokeObjectURL(img.preview);
            });
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles: DndImage[] = Array.from(e.target.files).map(file => ({
            id: `new-${Math.random().toString(36).substr(2, 9)}`,
            preview: URL.createObjectURL(file),
            file: file
        }));

        setDndImages(prev => [...prev, ...newFiles]);
    };

    const removeImage = (id: string) => {
        setDndImages(prev => prev.filter(img => img.id !== id));
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(dndImages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDndImages(items);
    };

    const handleTagChange = (tagName: string, checked: boolean) => {
        setTags(prev => checked ? [...prev, tagName] : prev.filter(t => t !== tagName));
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Judul wajib diisi"),
        description: Yup.string().required("Deskripsi wajib diisi").min(5),
        link: Yup.string().url("URL tidak valid").nullable(),
        tags: Yup.array().min(1, "Pilih minimal 1 tag")
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await validationSchema.validate({ title, description, link, tags }, { abortEarly: false });

            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("title", title);
            formData.append("description", description);
            formData.append("status", status);
            formData.append("tags", JSON.stringify(tags));
            if (link) formData.append("link", link);

            dndImages.forEach((img) => {
                if (img.file) {
                    formData.append("new_images[]", img.file);
                } else if (img.originalName) {
                    formData.append("images[]", img.originalName);
                }
            });

            const response = await updatePost({ id, payload: formData }).unwrap();

            if (response.status) {
                toast.success("Post berhasil diperbarui!");
                await refetchPost();
                await refetchAllPosts();
                router.push("/dashboard/post");
            }

        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                error.inner.forEach((err) => {
                    if (err.path) newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
                toast.error("Periksa kembali form anda");
            } else {
                console.error("API Error:", error);
                let msg = "Terjadi kesalahan";
                if (error?.data?.message) {
                    msg = typeof error.data.message === 'string'
                        ? error.data.message
                        : JSON.stringify(error.data.message);
                }
                toast.error(msg);
            }
        }
    };

    const inputClass = (err: boolean) => `
        w-full px-4 py-2.5 rounded-lg text-sm bg-gray-50 border transition-all focus:ring-2 focus:outline-none
        ${err
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}
    `;

    const filteredTags = useMemo(() => {
        if (!tagData?.tag) return [];
        return tagData.tag.filter(t =>
            t.nameTag.toLowerCase().includes(searchTag.toLowerCase())
        );
    }, [tagData, searchTag]);


    if (isLoading || !isClient) {
        return (
            <DashboardLayout>
                <div className="p-10 text-center text-gray-500 animate-pulse">
                    Memuat data...
                </div>
            </DashboardLayout>
        );
    }

    if (!postData?.post) {
        return (
            <DashboardLayout>
                <div className="p-10 text-center text-red-500">
                    Post tidak ditemukan
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Postingan</h1>
                    <Breadcrumb title="Postingan" subTitle="Edit" />
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Postingan</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputClass(!!errors.title)}
                                    placeholder="Masukkan judul menarik..."
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={8}
                                    className={inputClass(!!errors.description)}
                                    placeholder="Tulis konten anda disini..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Eksternal (Opsional)</label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className={inputClass(!!errors.link)}
                                    placeholder="https://..."
                                />
                                {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <HiOutlinePhotograph className="text-lg" /> Galeri Gambar
                            </h3>

                            <div className="mb-6">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <HiOutlineCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                        <p className="text-sm text-gray-500 group-hover:text-blue-600">
                                            <span className="font-semibold">Klik untuk upload</span> atau drag file kesini
                                        </p>
                                    </div>
                                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
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
                                            {dndImages.map((img, index) => (
                                                <Draggable key={img.id} draggableId={img.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border ${snapshot.isDragging ? 'border-blue-500 ring-2 ring-blue-200 z-50' : 'border-gray-200'}`}
                                                        >
                                                            <img
                                                                src={img.preview}
                                                                alt="preview"
                                                                className="w-full h-full object-cover"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(img.id)}
                                                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                            >
                                                                <HiX size={14} />
                                                            </button>

                                                            <div className="absolute bottom-1 left-1 flex gap-1">
                                                                <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-md">
                                                                    #{index + 1}
                                                                </span>
                                                                {img.file && (
                                                                    <span className="bg-green-500/80 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-md">
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
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
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Publikasi</h3>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
                            >
                                <option value="draft">Draft</option>
                                <option value="publish">Publish</option>
                                <option value="archived">Archived</option>
                            </select>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isUpdating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Kategori / Tags</h3>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTag}
                                onChange={(e) => setSearchTag(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 border-gray-300"
                            />
                            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                {filteredTags.map((t) => (
                                    <label key={t.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={tags.includes(t.nameTag)}
                                            onChange={(e) => handleTagChange(t.nameTag, e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ms-3 text-sm font-medium text-gray-700 capitalize">#{t.nameTag}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.tags && <p className="text-red-500 text-xs mt-2">{errors.tags}</p>}
                        </div>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}