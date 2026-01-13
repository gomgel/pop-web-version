import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarData = [
    {
        title: "CRM",
        items: [
            { name: "Accounts", href: "#", active: false },
            { name: "Contacts", href: "#", active: false },
            { name: "Leads", href: "#", active: true },
            { name: "Prospects", href: "#", active: false },
            { name: "Opportunities", href: "#", active: false },
            { name: "Activities", href: "#", active: false },
            { name: "Cases", href: "#", active: false },
        ],
    },
    { title: "HR", items: [] },
    { title: "Admin", items: [] },
    { title: "Procurement", items: [] },
    { title: "Sales", items: [] },
    { title: "Banks", items: [] },
    { title: "General Ledger", items: [] },
    { title: "Job Costing", items: [] },
    { title: "Customizer", items: [] },
];

export function Sidebar() {
    return (
        <div className="w-64 border-r bg-background h-screen flex flex-col pt-4 pb-4">
            <div className="flex-1 overflow-y-auto pl-4 pr-2">
                {sidebarData.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="mb-2 px-2 text-sm font-bold text-foreground/70 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={cn(
                                        "block px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted transition-colors",
                                        item.active
                                            ? "bg-muted text-foreground border-l-4 border-red-600 rounded-none pl-1"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="self-end mr-2 text-muted-foreground"
            >
            </Button>
        </div>
    );
}
