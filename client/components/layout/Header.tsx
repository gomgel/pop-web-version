import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export function Header() {
    const { logout, userInfo } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="h-14 border-b bg-stone-900 text-stone-50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                    <div className="w-8 h-8 bg-transparent border-2 border-white flex items-center justify-center font-bold text-xl">
                        P
                    </div>
                    <span>Coway POP System</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-4 border-r border-stone-700">
                    <span className="text-sm font-medium text-stone-300">{userInfo?.v_Plnt_Name} | {userInfo?.v_Hrde_Name} | {userInfo?.v_Empl_Name}({userInfo?.v_Empl_Cod2})</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-400 hover:text-white hover:bg-stone-800 gap-2 h-8 px-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Logout</span>
                    </Button>
                </div>

                <div className="flex items-center gap-1 text-stone-400">
                    <div className="relative">
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white">2</div>
                        <Bell className="h-5 w-5 hover:text-white cursor-pointer" />
                    </div>
                    <Settings className="h-5 w-5 hover:text-white cursor-pointer ml-3" />
                </div>
            </div>
        </header>
    );
}
