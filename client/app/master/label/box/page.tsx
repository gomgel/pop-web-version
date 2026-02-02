"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { BoxSearchFilters } from "@/components/dashboard/BoxSearchFilters";
import { BoxDataTable } from "@/components/dashboard/BoxDataTable";
import { Pagination } from "@/components/dashboard/Pagination";

export default function BoxLabelPage() {

    const searchParams = useSearchParams();
    const pageTitle = searchParams.get('title');

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastSearchParams, setLastSearchParams] = useState<any>({});

    const pageSize = 10;

    // Initial fetch
    const fetchData = useCallback(async (searchParams: any = {}, page: number = 1) => {
        setLoading(true);
        try {
            // Build query string
            const q = new URLSearchParams();
            // Add default plant if not provided
            const plantCode = searchParams.plantCode || '2000';
            q.set('plantCode', plantCode);

            if (searchParams.prdtTpcd) q.set('prdtTpcd', searchParams.prdtTpcd);
            if (searchParams.prvsName) q.set('prvsName', searchParams.prvsName);
            if (searchParams.possInfo) q.set('possInfo', searchParams.possInfo);

            q.set('page', page.toString());
            q.set('pageSize', pageSize.toString());

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${baseUrl}/api/label/box?${q.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setData(json.data || []);
            setTotal(json.total || 0);
            setCurrentPage(page);
            setLastSearchParams(searchParams);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (params: any) => {
        fetchData(params, 1);
    };

    const handlePageChange = (page: number) => {
        fetchData(lastSearchParams, page);
    };

    const handleExport = useCallback(() => {
        if (data.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = [
            "Plant Code",
            "Product Code",
            "Product Name",
            "POS Info",
            "Print Count",
            "MAC Valid",
            "Quality Mark",
            "ID Tracking",
            "Remarks",
            "Create Date",
            "Create Time"
        ];

        const rows = data.map((item: any) => [
            item.v_Plnt_Code,
            item.v_Prdt_Tpcd,
            item.v_Prvs_Name,
            item.v_Poss_Info,
            item.v_Prnt_Cunt,
            item.v_Vald_Macc,
            item.v_Qult_Mark,
            item.v_Idnt_Dvsn,
            item.v_Desc_Text,
            item.v_Scre_Date,
            item.v_Scre_Time
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `box_labels_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [data]);

    return (
        <div className="h-full flex flex-col bg-stone-100">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Breadcrumb-like header */}
                <div className="text-sm text-red-700 font-semibold border-b-2 border-red-700 w-fit pb-1">
                    {pageTitle}
                </div>

                <div className="bg-white border rounded shadow-sm p-4">
                    <BoxSearchFilters onSearch={handleSearch} onExport={handleExport} />
                    <BoxDataTable data={data} total={total} loading={loading} />

                    <Pagination
                        currentPage={currentPage}
                        totalCount={total}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
