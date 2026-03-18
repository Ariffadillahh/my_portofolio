"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { FaBars, FaRocket } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiViewList } from "react-icons/ci";
import { LiaHashtagSolid } from "react-icons/lia";
import { useLogoutMutation } from "../services/auth.service";
import { LuMessageCircleMore } from "react-icons/lu";

const SidebarComponents = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const [logout, { isLoading }] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            const res = await logout().unwrap();

            if (res.status) {
                await signOut({ redirect: false });
                window.location.href = "/auth/login";
            }
        } catch (error) {
            console.error("Logout error:", error);
            await signOut({ redirect: false });
            window.location.href = "/auth/login";
        }
    };

    const customTheme = {
        root: {
            inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800"
        },
        item: {
            base: "group flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
            active: "bg-blue-50 text-blue-700 font-semibold hover:bg-blue-50 dark:bg-gray-700 dark:text-white",

            icon: {
                base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                active: "text-blue-700 group-hover:text-blue-700 dark:text-gray-100"
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden hover:bg-gray-100 text-gray-600"
            >
                {isOpen ? <AiOutlineClose size={24} /> : <FaBars size={24} />}
            </button>

            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 bg-white 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="flex gap-4 mx-4 mt-4">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <FaRocket />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">AdminPanel</span>
                </div>

                <Sidebar theme={customTheme} aria-label="Sidebar Navigation" className="[&>div]:bg-white [&>div]:p-0">
                    <SidebarItems>
                        <SidebarItemGroup className="px-3 space-y-1 mt-4">
                            <SidebarItem
                                as={Link}
                                href="/dashboard"
                                icon={HiChartPie}
                                active={pathname === '/dashboard'}
                            >
                                Dashboard
                            </SidebarItem>

                            <SidebarItem
                                as={Link}
                                href="/dashboard/tags"
                                icon={LiaHashtagSolid}
                                active={pathname.startsWith('/dashboard/tags')}
                            >
                                Tags Management
                            </SidebarItem>

                            <SidebarItem
                                as={Link}
                                href="/dashboard/post"
                                icon={CiViewList}
                                active={pathname.startsWith('/dashboard/post')}
                            >
                                Posts Management
                            </SidebarItem>

                            <SidebarItem
                                as={Link}
                                href="/dashboard/message"
                                icon={LuMessageCircleMore}
                                active={pathname.startsWith('/dashboard/message')}
                            >
                                Messages on Contact
                            </SidebarItem>

                        </SidebarItemGroup>

                        <SidebarItemGroup className="px-3 mt-10 border-t pt-4">
                            <div
                                onClick={handleLogout}
                                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors group ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-red-600" />
                                <span className="ms-3 font-medium">{isLoading ? "Signing out..." : "Logout"}</span>
                            </div>
                        </SidebarItemGroup>
                    </SidebarItems>
                </Sidebar>
            </aside>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
                />
            )}
        </>
    );
};

export default SidebarComponents;