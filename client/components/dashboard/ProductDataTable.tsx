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
    ChevronsUpDown,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Printer,
    FileText
} from "lucide-react";

interface ProductItem {
    v_Plnt_Code: string;
    v_Prdt_Tpcd: string;
    v_Prvs_Name: string;
    v_Poss_Info: string;
    v_Prnt_Macc: string;
    v_Macc_Scan: string;
    v_Desc_Text: string;
    v_Scre_Date: string;
    v_Scre_Time: string;
    v_Schg_Date: string;
    v_Schg_Time: string;
}

interface ProductDataTableProps {
    data: ProductItem[];
    total: number;
    loading?: boolean;
}

export function ProductDataTable({ data, total, loading }: ProductDataTableProps) {
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
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Plant <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Product Code <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Product Name <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    POS Info <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    MAC Print <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    MAC Scan <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-stone-700 whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-100 p-1 rounded">
                                    Date <ChevronsUpDown className="h-3 w-3 text-stone-400" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">No results found.</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, idx) => (
                                <TableRow key={`${row.v_Prdt_Tpcd}-${idx}`} className="hover:bg-blue-50/50">
                                    <TableCell className="text-center py-2 h-8 w-10">
                                        <div className="h-4 w-4 bg-stone-200 rounded mx-auto" ></div>
                                    </TableCell>
                                    <TableCell className="text-center py-2"><Checkbox /></TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Plnt_Code}</TableCell>
                                    <TableCell className="py-2 font-medium">{row.v_Prdt_Tpcd}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Prvs_Name}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Poss_Info}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Prnt_Macc}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Macc_Scan}</TableCell>
                                    <TableCell className="py-2 text-stone-600">{row.v_Scre_Date} {row.v_Scre_Time}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
