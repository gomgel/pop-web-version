"use client";

import { useState, useMemo, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductionData {
    Dept_Dvsn: string;
    Dept_Code: string;
    Work_Edat: string;
    Work_User: number;
    Prvs_Name: string;
    Prdt_Nmbr: string;
    Targ_Cunt: string;
    Curr_Cunt: string;
    Goal_Perc: number;
    Lost_Time: number;
    Lost_Remk: string;
    Curr_Stat: string;
    Plnt_Code: string;
    Mkpd_Date: string;
    Prdt_Tpcd: string;
    Runs_Time: number;
    Runs_Cunt: number;
}

interface ProductionChartsProps {
    data: ProductionData[];
}

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function ProductionCharts({ data }: ProductionChartsProps) {
    const [chartCategory, setChartCategory] = useState<string>("CP");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    // 1. Achievement by Line (Individual Lines)
    const linePerformance = useMemo(() => {
        return data
            .filter(item => item.Dept_Code && (item.Prvs_Name || item.Work_Edat))
            .map((item) => ({
                name: item.Dept_Code,
                achievement: item.Goal_Perc,
                dept: item.Dept_Dvsn
            }))
            .filter(d => d.achievement > 0);
    }, [data]);

    // 2. Output vs Target by Line (strictly filtered by selected category)
    const lineOutput = useMemo(() => {
        return data
            .filter((item) => {
                const target = parseInt(item.Targ_Cunt.replace(/,/g, "")) || 0;
                const lineCode = item.Dept_Code || "";
                return target > 0 && lineCode.startsWith(chartCategory);
            })
            .map((item) => ({
                name: `${item.Dept_Code}`,
                target: parseInt(item.Targ_Cunt.replace(/,/g, "")),
                actual: parseInt(item.Curr_Cunt.replace(/,/g, "")),
            }))
            .slice(0, 10);
    }, [data, chartCategory]);

    // 3. Workers Distribution by Department
    const workerDistribution = useMemo(() => {
        const groups: Record<string, number> = {};
        data.forEach((item) => {
            if (!item.Dept_Dvsn) return;
            groups[item.Dept_Dvsn] = (groups[item.Dept_Dvsn] || 0) + item.Work_User;
        });

        return Object.entries(groups).map(([name, value]) => ({
            name,
            value,
        })).filter(d => d.value > 0);
    }, [data]);



    const categories = [
        { label: "Water Purifier", value: "CP" },
        { label: "Air Purifier", value: "CA" },
        { label: "Filter", value: "CF" },
        { label: "Carbon", value: "CI" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Achievement Rate Bar Chart */}
            <Card className="shadow-md border-t-4 border-t-red-700 md:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-bold">Achievement Rate by Line (%)</CardTitle>
                            <CardDescription>Goal percentage for each production line</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-stone-200 hover:bg-stone-100 hover:text-red-700 transition-colors"
                                onClick={() => scroll("left")}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-stone-200 hover:bg-stone-100 hover:text-red-700 transition-colors"
                                onClick={() => scroll("right")}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <div
                        ref={scrollContainerRef}
                        className="w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar"
                    >
                        <div style={{ width: `${Math.max(100, linePerformance.length * 5)}%`, minWidth: '100%' }} className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={linePerformance} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tick={{ fontSize: 11, fill: '#666', dy: 10 }}
                                    />
                                    <YAxis domain={[0, 150]} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }}
                                        formatter={(value: any) => [`${value}%`, 'Achievement']}
                                        labelFormatter={(label) => `Line: ${label}`}
                                    />
                                    <Bar
                                        dataKey="achievement"
                                        radius={[4, 4, 0, 0]}
                                        label={{ position: 'top', fontSize: 10, fill: '#666' }}
                                    >
                                        {linePerformance.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.achievement >= 100 ? '#16a34a' : entry.achievement < 80 ? '#dc2626' : '#d97706'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Target vs Actual Comparison */}
            <Card className="shadow-md border-t-4 border-t-blue-700">
                <CardHeader className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg font-bold">Target vs Actual Output</CardTitle>
                            <CardDescription>Comparison by selected line type</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {categories.map((cat) => (
                                <Button
                                    key={cat.value}
                                    variant={chartCategory === cat.value ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => setChartCategory(cat.value)}
                                    className="h-7 px-2 text-[10px] font-bold uppercase transition-all"
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lineOutput}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Worker Distribution Pie Chart */}
            <Card className="shadow-md border-t-4 border-t-emerald-700">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Worker Workforce Distribution</CardTitle>
                    <CardDescription>Total number of workers per department</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={workerDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {workerDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


        </div>
    );
}
