import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HomeIcon, 
  BriefcaseIcon, 
  MessageSquareIcon, 
  ClipboardListIcon, 
  SettingsIcon
} from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Job Board",
      href: "/job-board",
      icon: BriefcaseIcon,
    },
    {
      name: "AI Assistant",
      href: "/ai-assistant",
      icon: MessageSquareIcon,
    },
    {
      name: "Applications",
      href: "/applications",
      icon: ClipboardListIcon,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <aside className="bg-white border-r border-slate-200 w-full md:w-64 md:flex md:flex-col md:fixed md:inset-y-0 z-10 hidden md:block">
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 md:py-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#4f46e5] rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="ml-2 text-xl font-bold text-slate-900">JobNexus</h1>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === location;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? "bg-slate-100 text-primary-900" 
                  : "text-slate-700 hover:bg-slate-100 hover:text-primary-900"
              }`}
            >
              <item.icon 
                className={`h-5 w-5 mr-3 ${
                  isActive ? "text-primary-500" : "text-slate-500"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
            <AvatarFallback>
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">{user?.name || 'Alex Johnson'}</p>
            <p className="text-xs font-medium text-slate-500">{user?.email || 'alex@example.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
