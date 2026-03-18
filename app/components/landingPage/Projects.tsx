"use client" 
import React from 'react'
import { useGetAllPostQuery } from '@/app/services/post.service';
import { ProjectsParallax } from '../Bites/project-parallax';

const Projects = () => {

    const { data: postsData, isLoading } = useGetAllPostQuery({
        search: "",
        page: 1,
        per_page: 10, 
    });

    const posts = postsData?.data?.data || [];

    const products = posts
        .filter((post: any) => post.status === 'publish')
        .map((post: any) => ({
            title: post.title,
            link: `/projects/${post.slug || post.id}`, 
            thumbnail: post.images[0], 
        }));

    if (isLoading) {
        return <div className="py-20 text-center text-white">Loading projects...</div>;
    }


    if (products.length === 0) {
        return null;
    }

    return (
        <section id='projects' className='py-0'> 
            <ProjectsParallax products={products} />
        </section>
    )
}

export default Projects