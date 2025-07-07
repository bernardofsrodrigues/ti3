import React from 'react';
import { cn } from '@/lib/utils';
import SidebarContent from './SidebarContent';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const AppSidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  return (
    <div
      className={cn( 
        "fixed top-16 bottom-0 left-0 z-40 hidden xl:block", 
        "transition-all duration-200 border-r border-sidebar-border bg-sidebar", 
        isSidebarOpen ? "xl:w-64" : "xl:w-16" 
      )} 
    >
      {/* wrapper com flex para que o conteúdo interno respeite altura e overflow */}
      <div className="h-full flex flex-col overflow-y-auto">
        <SidebarContent isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default AppSidebar;
