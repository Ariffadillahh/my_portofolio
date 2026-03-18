"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TiltedCard from '../components/Bites/TiltedCard';
import { useGetAllPostQuery } from '../services/post.service';
import { RiArrowLeftUpLine } from "react-icons/ri";
import Link from 'next/link';
import TargetCursor from '../components/Bites/TargetCursor';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const ProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isHoveringProjects, setIsHoveringProjects] = useState(false);
  
  const [cardDim, setCardDim] = useState({ width: "300px", height: "200px" });

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // XL screens
        setCardDim({ width: "370px", height: "250px" });
      } else if (window.innerWidth >= 768) {
        // MD screens
        setCardDim({ width: "340px", height: "230px" });
      } else {
        // Mobile
        const safeWidth = Math.min(window.innerWidth - 40, 340);
        setCardDim({ width: `${safeWidth}px`, height: "220px" });
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data: postsData,
    isLoading,
    isFetching,
  } = useGetAllPostQuery({
    search: debouncedSearch,
    page,
    per_page: 6,
  });

  const posts = postsData?.data?.data || [];
  const meta = postsData?.data;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || '';

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (meta && page < meta.last_page) setPage((p) => p + 1);
  };

  return (
    <div>
      <div className='fixed top-4 left-4 md:top-6 md:left-6 lg:left-20 z-50'>
        <Link
          href={'/'}
          className="group relative inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs md:text-sm text-neutral-400 transition-all duration-300 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] active:scale-95 overflow-hidden capitalize"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
          <RiArrowLeftUpLine className="relative z-10 transition-transform duration-300 group-hover:rotate-[-45deg] text-base md:text-lg" />
          <span className="relative z-10 hidden sm:inline">Back to home</span>
        </Link>
      </div>

      <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-hidden selection:bg-blue-500/30 pt-16 md:pt-10 pb-10">
        <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 md:w-96 md:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-6 md:py-10">

          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
            
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                My Projects
              </h1>
              <p className="text-neutral-400 mt-1 md:mt-2 text-sm sm:text-base md:text-lg">
                Explore my latest works and experiments.
              </p>
            </div>

            <div className="relative w-full md:w-auto md:min-w-[280px] lg:min-w-[320px] group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 md:py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-neutral-900/80 transition-all text-white placeholder-neutral-500 shadow-xl"
              />
              {(isLoading || isFetching) && (
                <span className="absolute right-3 top-2.5 md:top-3.5 animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full z-20"></span>
              )}
            </div>
          </div>

          <div
            className={`relative min-h-[400px] ${isHoveringProjects ? 'cursor-none' : ''}`}
            onMouseEnter={() => setIsHoveringProjects(true)}
            onMouseLeave={() => setIsHoveringProjects(false)}
          >

            {isHoveringProjects && (
              <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
                parallaxOn={true}
              />
            )}
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 z-20 bg-neutral-950/40 backdrop-blur-[2px] flex justify-center items-center transition-all duration-300 rounded-xl">
                <div className="bg-neutral-900/90 px-4 md:px-6 py-2.5 md:py-3 rounded-full flex items-center gap-2 md:gap-3 shadow-2xl border border-white/10">
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs md:text-sm font-medium text-blue-100">Syncing data...</span>
                </div>
              </div>
            )}

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 place-items-center">
                {posts.map((post: any) => (
                  <Link href={`/projects/${post.id}`} key={post.id} className="relative group cursor-target w-full flex justify-center"> 
                    <TiltedCard
                      imageSrc={`${storageUrl}/${post.images[0]}`}
                      altText={post.title}
                      captionText={post.title}
                      containerWidth={cardDim.width}
                      containerHeight={cardDim.height}
                      imageWidth={cardDim.width}
                      imageHeight={cardDim.height}
                      rotateAmplitude={12}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      overlayContent={
                        <div className="inline-flex flex-col gap-1 px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl bg-black/60 border border-white/20 backdrop-blur-md pointer-events-auto max-w-[90%] md:max-w-full">
                          <p className="tilted-card-demo-text font-bold text-base sm:text-lg md:text-xl text-white leading-tight line-clamp-2">
                            {post.title}
                          </p>
                          {post.short_description && (
                            <p className="text-[10px] sm:text-xs text-neutral-300 leading-snug line-clamp-2 md:line-clamp-3">
                              {post.short_description}
                            </p>
                          )}
                        </div>
                      }
                    />
                  </Link>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12 md:py-20 border border-dashed border-neutral-800 rounded-xl mx-2">
                  <p className="text-neutral-100 text-sm md:text-base px-4">
                    No projects found matching "{search}".
                  </p>
                </div>
              )
            )}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-3 md:gap-6 mt-12 md:mt-20 flex-wrap px-2">
              <button
                onClick={handlePrev}
                disabled={page === 1 || isLoading}
                className="px-4 md:px-6 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs md:text-sm font-medium backdrop-blur-sm"
              >
                Previous
              </button>

              <span className="text-neutral-400 text-xs md:text-sm bg-neutral-900/50 px-3 md:px-4 py-2 rounded-full border border-neutral-800 backdrop-blur-sm whitespace-nowrap">
                Page <span className="text-purple-400 font-bold">{meta.current_page}</span> of {meta.last_page}
              </span>

              <button
                onClick={handleNext}
                disabled={page === meta.last_page || isLoading}
                className="px-4 md:px-6 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs md:text-sm font-medium backdrop-blur-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;