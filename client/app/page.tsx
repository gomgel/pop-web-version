"use client";

import { useState, useEffect, useCallback } from "react";
import { TabsNav } from "@/components/dashboard/TabsNav";
import { SearchFilters } from "@/components/dashboard/SearchFilters";
import { DataTable } from "@/components/dashboard/DataTable";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initial fetch
  const fetchData = useCallback(async (searchParams: any = {}) => {
    setLoading(true);
    try {
      // Build query string
      const q = new URLSearchParams();
      // Add mock defaults for now or params passed
      if (searchParams.query) q.set('query', searchParams.query);

      // In a real app we would use env var, but for this dev setup:
      const res = await fetch(`http://localhost:4000/api/search?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="h-full flex flex-col bg-stone-100">
      <TabsNav />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Breadcrumb-like header */}
        <div className="text-sm text-red-700 font-semibold border-b-2 border-red-700 w-fit pb-1">
          CRM: Accounts
        </div>

        <div className="bg-white border rounded shadow-sm">
          <SearchFilters onSearch={(p) => fetchData(p)} />
          <DataTable data={data} total={total} loading={loading} />
        </div>
      </div>
    </div>
  );
}
