import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Bell, ChevronDown } from "lucide-react";

export function Header() {
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

            <div className="flex items-center gap-4">
                {/* <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="text-stone-900 bg-stone-200">AH</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">armine.hayrapetyan</span>
                </div> */}

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
