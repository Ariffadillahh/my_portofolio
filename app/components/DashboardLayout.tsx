import React from 'react'
import SidebarComponents from './Sidebar'
import ReduxProvider from '../providers/redux'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen w-full bg-gray-50 dark:bg-gray-900'>
            <SidebarComponents />

            <ReduxProvider>
                <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 md:ml-64 pt-20 md:pt-8 transition-all duration-300">
                    {children}
                </main>
            </ReduxProvider>
        </div>
    )
}

export default DashboardLayout