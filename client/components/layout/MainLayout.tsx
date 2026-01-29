"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { isLoggedIn } = useAuthStore();
    const pathname = usePathname();
    const isLoginPage = pathname === "/";

    // Only show layout components if logged in and not on login page
    const showLayout = isLoggedIn && !isLoginPage;

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {showLayout && <Header />}
            <div className="flex flex-1 overflow-hidden">
                {showLayout && <Sidebar />}
                <main className={`flex-1 overflow-y-auto ${showLayout ? "bg-slate-50" : "bg-black"}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
