"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarData = [
    {
        id: "master",
        title: "마스터",
        items: [
            { id: "employee", name: "사원정보", href: "/master/employee" },
            { id: "line", name: "라인정보", href: "/master/line" },
            { id: "product", name: "자재마스터", href: "/master/product" },
            { id: "bom", name: "BOM마스터", href: "/master/bom" },
            { id: "packaging", name: "포장적재마스터", href: "/master/packaging" },
            { id: "label/product", name: "라벨자동화 마스터(제품라벨)", href: "/master/label/product" },
            { id: "label/box", name: "라벨자동화 마스터(박스라벨)", href: "/master/label/box" },
        ],
    },
    { id: "plan", title: "생산계획관리", items: [] },
    { id: "detail", title: "생산내역조회", items: [] },
    { id: "status", title: "생산현황조회", items: [] },
    { id: "validation", title: "데이터검증", items: [] },
    { id: "dashboard", title: "Dashboard", items: [] },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-background h-screen flex flex-col pt-4 pb-4">
            <div className="flex-1 overflow-y-auto pl-4 pr-2">
                {sidebarData.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="mb-2 px-2 text-sm font-bold text-foreground/70 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={i}
                                        href={{ pathname: item.href, query: { title: `${section.title} : ${item.name}` } }}
                                        className={cn(
                                            "block px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted transition-colors",
                                            isActive
                                                ? "bg-muted text-foreground border-l-4 border-red-600 rounded-none pl-1"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
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

