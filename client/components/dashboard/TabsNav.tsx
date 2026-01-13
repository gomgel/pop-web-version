import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const tabs = [
    { name: "#contact(Main)", active: true },
    { name: "#Employees", active: false },
    { name: "#Skills", active: false },
    { name: "#Requisitions", active: false },
];

export function TabsNav() {
    return (
        <div className="flex items-center border-b bg-white px-2 pt-2">
            {tabs.map((tab, idx) => (
                <div
                    key={idx}
                    className={`
                group flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer border-t border-x rounded-t-sm
                ${tab.active
                            ? "bg-stone-100 border-stone-200 text-foreground border-b-transparent relative top-[1px]"
                            : "bg-white text-muted-foreground border-transparent hover:bg-stone-50"
                        }
            `}
                >
                    <span className={tab.active ? "font-bold" : ""}>{tab.name}</span>
                    <X className={`h-3 w-3 ${tab.active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                </div>
            ))}
        </div>
    );
}
