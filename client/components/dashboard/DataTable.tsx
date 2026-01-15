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
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Printer,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeItem {
    v_Plnt_Code: string;
    v_Empl_Code: string;
    v_Empl_Name: string;
}

interface DataTableProps {
    data: EmployeeItem[];
    total: number;
    loading?: boolean;
}

export function DataTable({ data, total, loading }: DataTableProps) {
    return (
        <div className="p-4 space-y-2 bg-white">
            {/* Toolbar */}
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

                {/* Pagination (Simplified) */}
                <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>{data.length} items</span>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead className="w-10 text-center"><span className="text-stone-400">-</span></TableHead>
                            <TableHead className="w-12 text-center p-2"><Checkbox /></TableHead>
                            <TableHead className="font-bold text-stone-700">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Plant Code <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Employee Code <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Employee Name <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">No results found.</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.v_Empl_Code} className="hover:bg-blue-50/50">
                                    <TableCell className="text-center py-2 h-8 w-10">
                                        <div className="h-4 w-4 bg-stone-200 rounded mx-auto" ></div>
                                    </TableCell>
                                    <TableCell className="text-center py-2"><Checkbox /></TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Plnt_Code}</TableCell>
                                    <TableCell className="py-2 font-medium">{row.v_Empl_Code}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Empl_Name}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
