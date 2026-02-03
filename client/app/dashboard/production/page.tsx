"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductionCharts } from "@/components/production/ProductionCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Filter, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ProductionDashboardPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [plantCode, setPlantCode] = useState("2000");
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 3)); // Feb 3, 2026

    const mkpdDate = date ? format(date, "yyyyMMdd") : "";

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${baseUrl}/api/production/total?plantCode=${plantCode}&mkpdDate=${mkpdDate}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setData(json.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [plantCode, mkpdDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExport = () => {
        const headers = [
            "Dept", "Line", "Output Time", "Workers", "Product", "Seq", "Target", "Actual", "Goal %", "Lost Time", "Loss Reason"
        ];
        const rows = data.map(item => [
            item.Dept_Dvsn, item.Dept_Code, item.Work_Edat, item.Work_User, item.Prvs_Name, item.Prdt_Nmbr, item.Targ_Cunt, item.Curr_Cunt, item.Goal_Perc, item.Lost_Time, item.Lost_Remk
        ]);
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `production_report_${mkpdDate}.csv`);
        link.click();
    };

    return (
        <div className="min-h-screen bg-stone-50 p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-stone-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                        <Layers className="text-red-700 w-8 h-8" />
                        Production Status Dashboard
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">Real-time production monitoring and performance analysis</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-stone-200">
                    <div className="flex items-center gap-2 px-2 border-r border-stone-200">
                        <Filter className="w-4 h-4 text-stone-400" />
                        <Select value={plantCode} onValueChange={setPlantCode}>
                            <SelectTrigger className="w-[120px] border-none shadow-none focus:ring-0">
                                <SelectValue placeholder="Plant" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2000">유구공장</SelectItem>
                                <SelectItem value="2001">인천공장</SelectItem>
                                <SelectItem value="2002">포천공장</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 px-2 border-r border-stone-200">
                        <CalendarIcon className="w-4 h-4 text-stone-400" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    size="sm"
                                    className={cn(
                                        "justify-start text-left font-medium text-stone-700 hover:text-red-700 p-0 h-auto",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button onClick={fetchData} variant="ghost" size="sm" className="text-stone-600 hover:text-red-700">
                        Refresh
                    </Button>

                    <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 border-stone-200 text-stone-700">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                </div>
            ) : (
                <>
                    {/* Charts Section */}
                    <ProductionCharts data={data} />

                    {/* Detailed Data Table Section */}
                    <Card className="shadow-lg border-none overflow-hidden ring-1 ring-stone-200">
                        <CardHeader className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                            <CardTitle className="text-xl font-bold text-stone-800">Production Line Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-stone-100">
                                    <TableRow>
                                        <TableHead className="font-bold text-stone-700">Dept</TableHead>
                                        <TableHead className="font-bold text-stone-700 text-center">Line</TableHead>
                                        <TableHead className="font-bold text-stone-700">Product Name</TableHead>
                                        <TableHead className="font-bold text-stone-700 text-right">Target</TableHead>
                                        <TableHead className="font-bold text-stone-700 text-right">Actual</TableHead>
                                        <TableHead className="font-bold text-stone-700">Achievement</TableHead>
                                        <TableHead className="font-bold text-stone-700 text-center">Status</TableHead>
                                        <TableHead className="font-bold text-stone-700">Lost Time</TableHead>
                                        <TableHead className="font-bold text-stone-700">Reason for Loss</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((item, idx) => {
                                            const achievement = item.Goal_Perc;
                                            let statusColor = "bg-green-100 text-green-700 border-green-200";
                                            let statusText = "On Track";

                                            if (achievement < 80) {
                                                statusColor = "bg-red-100 text-red-700 border-red-200";
                                                statusText = "Critical";
                                            } else if (achievement < 100) {
                                                statusColor = "bg-amber-100 text-amber-700 border-amber-200";
                                                statusText = "Warning";
                                            }

                                            if (!item.Prvs_Name && !item.Work_Edat) return null;

                                            return (
                                                <TableRow key={idx} className="hover:bg-stone-50 transition-colors">
                                                    <TableCell className="font-medium">{item.Dept_Dvsn}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="font-mono">{item.Dept_Code}</Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate" title={item.Prvs_Name}>
                                                        {item.Prvs_Name}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{item.Targ_Cunt}</TableCell>
                                                    <TableCell className="text-right font-bold font-mono text-blue-700">{item.Curr_Cunt}</TableCell>
                                                    <TableCell className="min-w-[140px]">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className={`font-bold ${achievement >= 100 ? 'text-green-600' : achievement < 80 ? 'text-red-600' : 'text-amber-600'}`}>
                                                                    {achievement}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden border border-stone-300/50 shadow-inner">
                                                                <div
                                                                    className={`h-full transition-all duration-700 ease-out rounded-full ${achievement < 80 ? 'bg-red-500' :
                                                                        achievement < 100 ? 'bg-amber-500' : 'bg-green-500'
                                                                        }`}
                                                                    style={{ width: `${Math.min(achievement, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={`${statusColor} border shadow-none px-2 py-0.5`}>
                                                            {statusText}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.Lost_Time > 0 ? (
                                                            <span className="text-red-600 font-bold">{item.Lost_Time}m</span>
                                                        ) : (
                                                            <span className="text-stone-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-stone-500 text-sm max-w-[250px] truncate italic" title={item.Lost_Remk}>
                                                        {item.Lost_Remk || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }).filter(Boolean)
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center text-stone-500">
                                                No production data available for the selected filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
