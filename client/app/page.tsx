"use client";

import { useState, useCallback } from "react";
import { TabsNav } from "@/components/dashboard/TabsNav";
import { SearchFilters } from "@/components/dashboard/SearchFilters";
import { DataTable } from "@/components/dashboard/DataTable";
import { Pagination } from "@/components/dashboard/Pagination";

export default function DashboardPage() {
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

      if (searchParams.emplCode) q.set('emplCode', searchParams.emplCode);
      if (searchParams.emplName) q.set('emplName', searchParams.emplName);

      q.set('page', page.toString());
      q.set('pageSize', pageSize.toString());

      // In a real app we would use env var, but for this dev setup:
      const res = await fetch(`http://localhost:4000/api/pmemplym?${q.toString()}`);
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

  return (
    <div className="h-full flex flex-col bg-stone-100">
      <TabsNav />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Breadcrumb-like header */}
        <div className="text-sm text-red-700 font-semibold border-b-2 border-red-700 w-fit pb-1">
          CRM: Accounts
        </div>

        <div className="bg-white border rounded shadow-sm p-4">
          <SearchFilters onSearch={handleSearch} />
          <DataTable data={data} total={total} loading={loading} />

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
