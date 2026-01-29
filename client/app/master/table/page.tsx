"use client";

import { useState, useCallback, useEffect } from "react";
import { DynamicDataTable } from "@/components/dashboard/DynamicDataTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ColumnMetadata {
    name: string;
    type: string;
    isPrimary: boolean;
}

interface TableInfo {
    name: string;
    comments: string;
}

export default function TableInquiryPage() {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [columns, setColumns] = useState<ColumnMetadata[]>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const searchParams = useSearchParams();
    const pageTitle = searchParams.get('title') || "테이블조회";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // Fetch table list on load
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/tables`);
                const json = await res.json();
                setTables(json);
            } catch (e) {
                console.error("Failed to fetch tables", e);
            }
        };
        fetchTables();
    }, [baseUrl]);

    const fetchData = useCallback(async (page: number = 1) => {
        if (!selectedTable) return;
        setLoading(true);
        try {
            const q = new URLSearchParams();
            q.set('tableName', selectedTable);
            q.set('page', page.toString());
            q.set('pageSize', pageSize.toString());

            Object.entries(filters).forEach(([key, val]) => {
                if (val) q.set(key, val);
            });

            const res = await fetch(`${baseUrl}/api/table/data?${q.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");
            const json = await res.json();
            setData(json.data || []);
            setTotal(json.total || 0);
            setCurrentPage(page);
        } catch (e) {
            console.error(e);
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [baseUrl, selectedTable, filters, pageSize]);

    // Re-fetch when pageSize changes
    useEffect(() => {
        if (selectedTable && data.length > 0) {
            fetchData(1);
        }
    }, [pageSize]);

    // Load table info (metadata)
    const handleLoadTableInfo = async () => {
        if (!selectedTable) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/table/metadata?tableName=${selectedTable}`);
            const json = await res.json();
            setColumns(json.columns || []);
            // Reset filters to PKs only
            const initialFilters: Record<string, string> = {};
            json.columns.forEach((col: ColumnMetadata) => {
                if (col.isPrimary) initialFilters[col.name] = "";
            });
            setFilters(initialFilters);
            setData([]);
            setTotal(0);
            setCurrentPage(1);
        } catch (e) {
            console.error("Failed to fetch metadata", e);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        fetchData(page);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="h-full flex flex-col bg-stone-100 uppercase">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Title */}
                <div className="text-sm text-red-700 font-semibold border-b-2 border-red-700 w-fit pb-1">
                    {pageTitle}
                </div>

                {/* Table Selection Area */}
                <div className="bg-white border rounded shadow-sm p-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm text-stone-600 font-normal">Oracle Table :</Label>
                        <Select value={selectedTable} onValueChange={setSelectedTable}>
                            <SelectTrigger className="w-80 bg-stone-50 border-stone-300">
                                <SelectValue placeholder="SELECT TABLE" />
                            </SelectTrigger>
                            <SelectContent>
                                {tables.map(t => (
                                    <SelectItem key={t.name} value={t.name}>
                                        {t.name}{t.comments ? `(${t.comments})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label className="text-sm text-stone-600 font-normal">Page Size :</Label>
                        <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                            <SelectTrigger className="w-24 bg-stone-50 border-stone-300">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 40, 50].map(size => (
                                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                        onClick={handleLoadTableInfo}
                    >
                        LOAD TABLE INFO
                    </Button>
                </div>

                {/* Dynamic Filters Area (Only if table info loaded) */}
                {columns.length > 0 && (
                    <div className="bg-white border rounded shadow-sm p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {columns.filter(c => c.isPrimary).map(col => (
                                <div key={col.name} className="flex items-center gap-2">
                                    <Label className="text-sm text-stone-600 font-normal whitespace-nowrap">
                                        {col.name} (PK) :
                                    </Label>
                                    <Input
                                        className="flex-1"
                                        value={filters[col.name] || ""}
                                        onChange={(e) => handleFilterChange(col.name, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Button
                                className="bg-blue-900 hover:bg-blue-800 text-white px-8 font-bold"
                                onClick={() => fetchData(1)}
                            >
                                SEARCH
                            </Button>
                            <Button
                                variant="outline"
                                className="text-muted-foreground border-stone-300"
                                onClick={() => { setFilters({}); setData([]); setTotal(0); }}
                            >
                                CLEAR
                            </Button>
                        </div>

                        <DynamicDataTable
                            columns={columns.map(c => ({ key: c.name, label: c.name }))}
                            data={data}
                            loading={loading}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalCount={total}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
