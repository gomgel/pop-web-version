"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Users,
    ClipboardList,
    FileSearch,
    BarChart3,
    ShieldCheck,
    LayoutDashboard,
    Database,
    Package,
    Network,
    FileText,
    Table
} from "lucide-react";

const sidebarData = [
    {
        id: "master",
        title: "마스터",
        icon: Users,
        items: [
            { id: "employee", name: "사원정보", href: "/master/employee" },
            { id: "line", name: "라인정보", href: "/master/line" },
            { id: "product", name: "자재마스터", href: "/master/product" },
            { id: "bom", name: "BOM마스터", href: "/master/bom" },
            { id: "packaging", name: "포장적재마스터", href: "/master/packaging" },
            { id: "label/product", name: "라벨자동화 마스터(제품라벨)", href: "/master/label/product" },
            { id: "label/box", name: "라벨자동화 마스터(박스라벨)", href: "/master/label/box" },
            { id: "table", name: "테이블조회", href: "/master/table" },
        ],
    },
    {
        id: "plan",
        title: "생산계획관리",
        icon: ClipboardList,
        items: [
            { id: "daily", name: "일괄 생산계획 관리", href: "/plan/daily" },
        ]
    },
    { id: "detail", title: "생산내역조회", icon: FileSearch, items: [] },
    { id: "status", title: "생산현황조회", icon: BarChart3, items: [] },
    { id: "validation", title: "데이터검증", icon: ShieldCheck, items: [] },
    {
        id: "dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        items: [
            { id: "production-total", name: "생산현황 DASHBOARD", href: "/dashboard/production" },
            { id: "database-monitor", name: "database monitor", href: "/dashboard/db-monitor" },
        ]
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        master: true,
        dashboard: true,
    });

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <div className={cn(
            "border-r bg-background h-full flex flex-col pt-4 pb-4 transition-all duration-300 ease-in-out relative",
            isCollapsed ? "w-16" : "w-64"
        )}>
            <div className="flex-1 overflow-y-auto px-3">
                {sidebarData.map((section, idx) => {
                    const SectionIcon = section.icon;
                    const isExpanded = expandedSections[section.id] !== false;
                    const hasItems = section.items.length > 0;

                    return (
                        <div key={idx} className="mb-2">
                            {!isCollapsed ? (
                                <button
                                    onClick={() => hasItems && toggleSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between py-2 px-2 text-sm font-semibold text-slate-700 hover:text-foreground hover:bg-muted/50 rounded-md transition-all group",
                                        !hasItems && "cursor-default"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <SectionIcon className="w-5 h-5 text-slate-500 group-hover:text-red-600 transition-colors" />
                                        <span className="truncate">{section.title}</span>
                                    </div>
                                    {hasItems && (
                                        <ChevronDown className={cn(
                                            "w-4 h-4 text-slate-400 transition-transform duration-200",
                                            !isExpanded && "-rotate-90"
                                        )} />
                                    )}
                                </button>
                            ) : (
                                <div className="flex justify-center py-4 group relative">
                                    <SectionIcon className="w-6 h-6 text-slate-500 group-hover:text-red-600 transition-colors" />
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {section.title}
                                    </div>
                                </div>
                            )}

                            <div className={cn(
                                "space-y-1 transition-all duration-200 overflow-hidden",
                                !isExpanded && !isCollapsed && "max-h-0 opacity-0"
                            )}>
                                {section.items.map((item, i) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={i}
                                            href={{ pathname: item.href, query: { title: `${section.title} : ${item.name}` } }}
                                            className={cn(
                                                "flex items-center gap-3 py-1.5 text-sm font-medium transition-all group relative",
                                                isActive
                                                    ? "text-red-600 border-l-2 border-red-600 pl-8 bg-red-50/30"
                                                    : "text-slate-500 hover:text-foreground pl-10 hover:bg-muted/30 rounded-md",
                                                isCollapsed && "hidden"
                                            )}
                                        >
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto px-4 border-t pt-4 bg-slate-50/50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "w-full flex items-center gap-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-500",
                        isCollapsed ? "justify-center px-0" : "px-3"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
