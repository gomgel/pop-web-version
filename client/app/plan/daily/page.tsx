"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, ListFilter, ClipboardList, Info, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useAuthStore } from "@/store/useAuthStore";

export default function DailyProductionPlanPage() {
    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [mainData, setMainData] = useState<any[]>([]);
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [plants, setPlants] = useState<{ v_code_dvsn: string, v_code_name: string }[]>([]);
    const { isLoggedIn } = useAuthStore();

    // Search filters
    const [plantCode, setPlantCode] = useState("2000");
    const [deptCode, setDeptCode] = useState("");
    const [ordrNmbr, setOrdrNmbr] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const fetchPlants = useCallback(async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${baseUrl}/api/common/codes?plantCode=2000&sequNmbr=009`);
            if (!res.ok) throw new Error("Failed to fetch plants");
            const json = await res.json();
            if (json.success) {
                setPlants(json.data || []);
            }
        } catch (e) {
            console.error("Error fetching plants:", e);
            // Fallback to default plants if fetch fails
            setPlants([
                { v_code_dvsn: "2000", v_code_name: "유구공장" },
                { v_code_dvsn: "2001", v_code_name: "인천공장" },
                { v_code_dvsn: "2002", v_code_name: "포천공장" }
            ]);
        }
    }, []);

    useEffect(() => {
        fetchPlants();
    }, [fetchPlants]);

    const fetchMainPlan = async () => {
        setLoading(true);
        setSelectedOrder(null);
        setDetailData([]);
        try {
            const fromDate = dateRange?.from ? format(dateRange.from, "yyyyMMdd") : "";
            const toDate = dateRange?.to ? format(dateRange.to, "yyyyMMdd") : fromDate;

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const params = new URLSearchParams({
                plantCode,
                deptCode,
                ordrNmbr,
                fromDate,
                toDate,
            });

            const res = await fetch(`${baseUrl}/api/production/daily-plan?${params.toString()}`);
            const json = await res.json();
            if (json.success) {
                setMainData(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch main plan:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderNo: string) => {
        setDetailsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${baseUrl}/api/production/order-details?plantCode=${plantCode}&ordrNmbr=${orderNo}`);
            const json = await res.json();
            if (json.success) {
                setDetailData(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleRowClick = (orderNo: string) => {
        setSelectedOrder(orderNo);
        fetchOrderDetails(orderNo);
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardList className="text-red-700 w-7 h-7" />
                        일괄 생산계획 관리
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Daily Production Plan Management</p>
                </div>
                <Button onClick={fetchMainPlan} className="bg-red-700 hover:bg-red-800">
                    <Search className="w-4 h-4 mr-2" />
                    조회 (F5)
                </Button>
            </div>

            {/* Search Conditions */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 bg-slate-100/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <ListFilter className="w-4 h-4 text-slate-500" />
                        조회 조건
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">플랜트 (Plant)</Label>
                            <Select value={plantCode} onValueChange={setPlantCode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="플랜트 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plants.length > 0 ? (
                                        plants.map((p) => (
                                            <SelectItem key={p.v_code_dvsn} value={p.v_code_dvsn}>
                                                {p.v_code_name} ({p.v_code_dvsn})
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="2000">유구공장 (2000)</SelectItem>
                                            <SelectItem value="2001">인천공장 (2001)</SelectItem>
                                            <SelectItem value="2002">포천공장 (2002)</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">라인코드 (Line Code)</Label>
                            <Select value={deptCode} onValueChange={setDeptCode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="전체" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">전체</SelectItem>
                                    <SelectItem value="CP01">정수기 1라인 (CP01)</SelectItem>
                                    <SelectItem value="CP02">정수기 2라인 (CP02)</SelectItem>
                                    <SelectItem value="CP03">정수기 3라인 (CP03)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">오더번호 (Order No.)</Label>
                            <Input
                                value={ordrNmbr}
                                onChange={(e) => setOrdrNmbr(e.target.value)}
                                placeholder="오더번호 입력"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">생산일자 (Production Date)</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "yyyy.MM.dd")} - {format(dateRange.to, "yyyy.MM.dd")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "yyyy.MM.dd")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grid: Production Plan */}
            <Card className="shadow-lg border-none overflow-hidden ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50 border-b px-6 py-3">
                    <CardTitle className="text-md font-bold text-slate-800">생산계획 리스트 (Production Plan)</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto min-h-[300px]">
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">오더번호</TableHead>
                                <TableHead className="font-bold text-slate-700">계획일자</TableHead>
                                <TableHead className="font-bold text-slate-700">SAP라인</TableHead>
                                <TableHead className="font-bold text-slate-700">라인코드</TableHead>
                                <TableHead className="font-bold text-slate-700">라인명</TableHead>
                                <TableHead className="font-bold text-slate-700">제품코드</TableHead>
                                <TableHead className="font-bold text-slate-700">제품명</TableHead>
                                <TableHead className="font-bold text-slate-700">POP코드</TableHead>
                                <TableHead className="font-bold text-slate-700 text-right">계획수량</TableHead>
                                <TableHead className="font-bold text-slate-700 text-right">실적수량</TableHead>
                                <TableHead className="font-bold text-slate-700 text-right">Tact Time</TableHead>
                                <TableHead className="font-bold text-slate-700">직무코드명</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={12} className="h-40 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-400">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-700"></div>
                                            데이터 로딩 중...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : mainData.length > 0 ? (
                                mainData.map((item, idx) => (
                                    <TableRow
                                        key={idx}
                                        className={cn(
                                            "hover:bg-blue-50 cursor-pointer transition-colors",
                                            selectedOrder === item.v_Ordr_Nmbr && "bg-blue-100/50"
                                        )}
                                        onClick={() => handleRowClick(item.v_Ordr_Nmbr)}
                                    >
                                        <TableCell className="font-medium text-blue-700">{item.v_Ordr_Nmbr}</TableCell>
                                        <TableCell>{item.v_Mkpd_Date}</TableCell>
                                        <TableCell>{item.v_Saps_Line}</TableCell>
                                        <TableCell>{item.v_Dept_Code}</TableCell>
                                        <TableCell>{item.v_Dept_Name}</TableCell>
                                        <TableCell>{item.v_Prdt_Tpcd}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={item.v_Prvs_Name}>
                                            {item.v_Prvs_Name}
                                        </TableCell>
                                        <TableCell>{item.v_Badp_Tpcd}</TableCell>
                                        <TableCell className="text-right font-mono">{(item.v_Plan_Cunt || 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-slate-900">{(item.v_Prdt_Cunt || 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">{item.v_Tact_Time}</TableCell>
                                        <TableCell>{item.v_Jobs_Name}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={12} className="h-40 text-center text-slate-400">
                                        조회된 데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Grid: Order Product Details */}
            {selectedOrder && (
                <Card className="shadow-lg border-none overflow-hidden ring-1 ring-slate-200">
                    <CardHeader className="bg-slate-50 border-b px-6 py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <Info className="w-4 h-4 text-red-700" />
                            상세 정보 (Order: {selectedOrder})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-100">
                                <TableRow>
                                    <TableHead className="font-bold text-slate-700">오더번호</TableHead>
                                    <TableHead className="font-bold text-slate-700">생산일자</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-center">생산순번</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-right">실적수량</TableHead>
                                    <TableHead className="font-bold text-slate-700">스캔시작일시</TableHead>
                                    <TableHead className="font-bold text-slate-700">스캔종료일시</TableHead>
                                    <TableHead className="font-bold text-slate-700">라인계획시작일시</TableHead>
                                    <TableHead className="font-bold text-slate-700">라인계획종료일시</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {detailsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center">
                                            데이터 로딩 중...
                                        </TableCell>
                                    </TableRow>
                                ) : detailData.length > 0 ? (
                                    detailData.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50">
                                            <TableCell>{item.v_Ordr_Nmbr}</TableCell>
                                            <TableCell>{item.v_Mkpd_Date}</TableCell>
                                            <TableCell className="text-center">{item.v_Prdt_Nmbr}</TableCell>
                                            <TableCell className="text-right font-bold">{(item.v_Prdt_Cunt || 0).toLocaleString()}</TableCell>
                                            <TableCell className="text-slate-500 text-xs">{item.v_Scan_Mind}</TableCell>
                                            <TableCell className="text-slate-500 text-xs">{item.v_Scan_Maxd}</TableCell>
                                            <TableCell className="text-blue-600/70 text-xs">{item.v_Plan_Fdat}</TableCell>
                                            <TableCell className="text-blue-600/70 text-xs">{item.v_Plan_Edat}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-slate-400">
                                            상세 데이터가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
