"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function ProductPage() {

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

            // Note: Adapt these params based on actual search requirements for Product
            if (searchParams.itemCode) q.set('itemCode', searchParams.itemCode);
            if (searchParams.itemName) q.set('itemName', searchParams.itemName);

            q.set('page', page.toString());
            q.set('pageSize', pageSize.toString());

            // In a real app we would use env var, but for this dev setup:
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${baseUrl}/api/product?${q.toString()}`);
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

    return (
        <div className="h-full flex flex-col bg-stone-100">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Breadcrumb-like header */}
                <div className="text-sm text-red-700 font-semibold border-b-2 border-red-700 w-fit pb-1">
                    {pageTitle}
                </div>
                {/* TODO: Add SearchFilters, DataTable, and Pagination components here */}
            </div>
        </div>
    );
}
