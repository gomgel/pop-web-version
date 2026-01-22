"use client";

import { useState, useCallback } from "react";
import { SearchFilters } from "@/components/dashboard/SearchFilters";
import { DataTable } from "@/components/dashboard/DataTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<any>({});

  const searchParams = useSearchParams();
  const pageTitle = searchParams.get('title');

  console.log(pageTitle);

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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${baseUrl}/api/employee?${q.toString()}`);
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

    // Define headers
    const headers = [
      "Plant Code",
      "Employee Code",
      "Employee Name",
      "HR Dept",
      "Dept Code",
      "Create Date",
      "Create Time"
    ];

    // Map data to rows
    const rows = data.map((emp: any) => [
      emp.v_Plnt_Code,
      emp.v_Empl_Code,
      emp.v_Empl_Name,
      emp.v_Hrde_Code,
      emp.v_Dept_Code,
      emp.v_Scre_Date,
      emp.v_Scre_Time
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employees_${new Date().toISOString().split('T')[0]}.csv`);
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
          <SearchFilters onSearch={(p) => fetchData(p)} onExport={handleExport} />
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

