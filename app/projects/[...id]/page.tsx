"use client"

import React, { use, useState } from 'react'
import { useGetPostQuery } from '@/app/services/post.service';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt, FaCalendarAlt, FaTag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data: postData, isLoading } = useGetPostQuery(id);
    const post = postData?.post;
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || '';

    const nextSlide = () => {
        if (!post?.images) return;
        setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (!post?.images) return;
        setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Link href="/projects" className="text-purple-400 hover:underline">Back to Projects</Link>
            </div>
        );
    }

    const images = post.images || [];

    return (
        <main className="min-h-screen text-neutral-200 selection:bg-purple-500/30 pb-20 relative">
            
            <div className="fixed inset-0 bg-neutral-950 -z-20" />

            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-40%] left-[-10%] w-[300px] h-[400px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[200px] bg-purple-600/30 rounded-full blur-[120px]" />
            </div>

            <section className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden group">
                <div className="absolute top-6 left-6 z-30">
                    <Link href="/projects" className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all">
                        <FaArrowLeft />
                        <span className="text-sm font-medium">Projects</span>
                    </Link>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {images.length > 0 ? (
                            <div className='relative w-full h-full'>
                                <Image
                                    src={`${storageUrl}/${images[currentImageIndex]}`}
                                    alt={post.title}
                                    fill
                                    className="object-cover object-center"
                                    unoptimized={true}
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 bg-neutral-800">
                                No Image Available
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-purple-600/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-purple-600/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <FaChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-12 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {images.map((_: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === currentImageIndex
                                            ? 'w-10 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                                            : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70 hover:shadow-md'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl"
                >
                    <div className="space-y-6 mt-3">
                        <div className="md:flex md:flex-wrap items-center justify-between gap-4 space-y-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${post.status === 'publish'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {post.status}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <FaCalendarAlt />
                                <span>{formatDate(post.created_at)}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {post.tags && post.tags.map((tag: string, index: number) => (
                                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-neutral-300">
                                    <FaTag className="text-purple-400 text-xs" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="my-8 border-white/10" />

                    <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
                        <p className="whitespace-pre-line leading-relaxed text-justify">
                            {post.description}
                        </p>
                    </div>

                    {post.link && (
                        <div className="mt-10">
                            <a
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
                            >
                                Visit Project
                                <FaExternalLinkAlt className="text-sm" />
                            </a>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    )
}

export default Page