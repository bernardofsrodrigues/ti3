
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1">
          <AppSidebar isSidebarOpen={isSidebarOpen} />
            <main         className={cn( 
                "flex-1 p-4 md:p-6 transition-all duration-200 overflow-x-auto", 
                { 
                  "xl:ml-64": isSidebarOpen, 
                  "xl:ml-16": !isSidebarOpen 
                } 
              )} 
            >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
