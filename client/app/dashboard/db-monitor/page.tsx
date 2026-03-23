"use client";

import React, { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2, Database, Activity, Users, Cpu, HardDrive, Play, Square } from "lucide-react";

// Mock data generator for initial design (will be replaced by real fetching)
const generateTimeSeries = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        time: `${9 + Math.floor(i / 12)}:${(i % 12 * 5).toString().padStart(2, '0')}`,
        logical_io: Math.floor(Math.random() * 20000) + 5000,
        physical_io_reads: Math.floor(Math.random() * 50) + 10,
        physical_io_writes: Math.floor(Math.random() * 20) + 5,
        sessions_active: Math.floor(Math.random() * 20) + 5,
        sessions_idle: Math.floor(Math.random() * 150) + 50,
        call_rates: Math.floor(Math.random() * 4000) + 1000,
    }));
};

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6366f1"];

export default function DatabaseMonitorPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState("loading...");
    const [isLive, setIsLive] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(10000); // 10s default

    const fetchMetrics = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const resp = await fetch(`${baseUrl}/api/db/monitor`);
            const result = await resp.json();
            if (result.success) {
                setSource(result.source);
                const metrics = result.data;
                setCurrentMetrics(metrics);

                // Map to time series point
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const point: any = { time };

                metrics.forEach((m: any) => {
                    if (m.CATEGORY === 'LOGICAL_IO') {
                        if (m.METRIC_NAME === 'consistent gets') point.consistent_reads = m.VALUE;
                        if (m.METRIC_NAME === 'db block gets') point.current_reads = m.VALUE;
                        if (m.METRIC_NAME === 'db block changes') point.block_changes = m.VALUE;
                        // For backward compatibility
                        if (m.METRIC_NAME === 'consistent gets') point.logical_io = m.VALUE;
                    }
                    if (m.CATEGORY === 'SESSIONS') point[`sessions_${m.METRIC_NAME.toLowerCase()}`] = m.VALUE;
                    if (m.CATEGORY === 'PHYSICAL_IO' && m.METRIC_NAME === 'physical reads') point.physical_io_reads = m.VALUE;
                    if (m.CATEGORY === 'PHYSICAL_IO' && m.METRIC_NAME === 'physical writes') point.physical_io_writes = m.VALUE;
                    if (m.CATEGORY === 'CALL_RATES' && m.METRIC_NAME === 'user calls') point.call_rates = m.VALUE;
                });

                setHistory(prev => {
                    const next = [...prev, point];
                    if (next.length > 30) return next.slice(1);
                    return next;
                });
            }
        } catch (err) {
            console.error("Failed to fetch metrics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLive) {
            fetchMetrics();
            const interval = setInterval(fetchMetrics, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [isLive, refreshInterval]);

    const SGA_COLORS: Record<string, string> = {
        'fixed_sga': '#3b82f6',    // Blue
        'buffer_cache': '#10b981', // Green
        'log_buffer': '#f59e0b',   // Orange
        'shared pool': '#8b5cf6',   // Purple
    };

    const sgaData = currentMetrics
        .filter(m => m.CATEGORY === 'SGA')
        .map(m => ({
            name: m.METRIC_NAME,
            value: m.VALUE,
            color: SGA_COLORS[m.METRIC_NAME] || COLORS[Math.floor(Math.random() * COLORS.length)]
        }));


    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Database className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900tracking-tight">Oracle Database Monitor</h1>
                        <p className="text-sm text-slate-500 font-medium">POPORA @ test-popdb.coway.dev ({source})</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Refresh:</span>
                        <Select
                            value={refreshInterval.toString()}
                            onValueChange={(val) => setRefreshInterval(parseInt(val))}
                        >
                            <SelectTrigger size="sm" className="w-[80px] h-8 text-xs font-bold border-slate-200">
                                <SelectValue placeholder="10s" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10000">10s</SelectItem>
                                <SelectItem value="30000">30s</SelectItem>
                                <SelectItem value="60000">60s</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-wider">Syncing...</span>
                        </div>
                    )}

                    <Button
                        variant={isLive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsLive(!isLive)}
                        className={cn(
                            "flex items-center gap-2 font-bold shadow-sm transition-all",
                            !isLive && "bg-green-600 hover:bg-green-700"
                        )}
                    >
                        {isLive ? (
                            <>
                                <Square className="w-4 h-4 fill-current" />
                                <span>STOP MONITORING</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>RESUME MONITORING</span>
                            </>
                        )}
                    </Button>

                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                        isLive
                            ? "bg-green-50 text-green-700 border-green-100 animate-pulse"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {isLive ? "Live Monitoring" : "Paused"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Logical I/O */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <Cpu className="w-4 h-4 text-blue-500" /> Logical I/O (Blocks/sec)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.toLocaleString('en-US', { notation: 'compact' })}
                                        width={50}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    <Area type="monotone" dataKey="block_changes" name="Block changes" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                                    <Area type="monotone" dataKey="current_reads" name="Current reads" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
                                    <Area type="monotone" dataKey="consistent_reads" name="Consistent reads" stackId="1" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.8} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sessions */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <Users className="w-4 h-4 text-orange-500" /> Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.toLocaleString()}
                                        width={40}
                                    />
                                    <Tooltip />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="sessions_active" name="Active" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="sessions_idle" name="Idle" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Memory SGA */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <HardDrive className="w-4 h-4 text-green-500" /> SGA Memory Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 flex items-center justify-center">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sgaData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sgaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} layout="vertical" align="right" verticalAlign="middle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Physical I/O */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            Physical I/O
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.toLocaleString('en-US', { notation: 'compact' })}
                                        width={50}
                                    />
                                    <Tooltip />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                    <Line type="monotone" dataKey="physical_io_reads" name="Reads" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="physical_io_writes" name="Writes" stroke="#ef4444" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Call Rates */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            Call Rates (Calls/sec)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.toLocaleString('en-US', { notation: 'compact' })}
                                        width={50}
                                    />
                                    <Tooltip />
                                    <Area type="stepAfter" dataKey="call_rates" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Miss Rates */}
                <Card className="overflow-hidden border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            Cache Miss Rates (%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.toLocaleString('en-US', { notation: 'compact' })}
                                        width={50}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="physical_io_reads" name="Miss %" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
