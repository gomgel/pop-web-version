"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Printer,
    FileText,
    ArrowUp,
    ArrowDown,
    ChevronsUpDown
} from "lucide-react";

interface Column {
    key: string;
    label: string;
}

interface DynamicDataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    sortConfig?: { key: string; direction: 'asc' | 'desc' | null };
    onSort?: (key: string) => void;
}

export function DynamicDataTable({ columns, data, loading, sortConfig, onSort }: DynamicDataTableProps) {
    return (
        <div className="p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm bg-stone-50 border-stone-300">
                        <Plus className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm bg-stone-50 border-stone-300">
                        <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="default" size="icon" className="h-8 w-8 rounded-sm bg-blue-900 border-none hover:bg-blue-800">
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm bg-stone-50 border-stone-300">
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm bg-stone-50 border-stone-300">
                        <FileText className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm bg-stone-50 border-stone-300">
                        <Printer className="h-4 w-4 text-blue-600" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>{data.length} items</span>
                </div>
            </div>

            <div className="border rounded-md overflow-x-auto">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead className="w-10 text-center"><span className="text-stone-400">-</span></TableHead>
                            <TableHead className="w-12 text-center p-2"><Checkbox /></TableHead>
                            {columns.map((col) => (
                                <TableHead key={col.key} className="font-bold text-stone-700 whitespace-nowrap">
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded transition-colors"
                                        onClick={() => onSort?.(col.key)}
                                    >
                                        {col.label}
                                        {sortConfig?.key === col.key ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-blue-600" /> : <ArrowDown className="h-3 w-3 text-blue-600" />
                                        ) : (
                                            <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} className="text-center py-8">No results found.</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, idx) => (
                                <TableRow key={idx} className="hover:bg-blue-50/50">
                                    <TableCell className="text-center py-2 h-8 w-10">
                                        <div className="h-4 w-4 bg-stone-200 rounded mx-auto" ></div>
                                    </TableCell>
                                    <TableCell className="text-center py-2"><Checkbox /></TableCell>
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className="py-2 text-stone-600">
                                            {row[col.key]?.toString() || ''}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
