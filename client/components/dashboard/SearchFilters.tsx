"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, XCircle, CalendarIcon, Plus, Eye, MoreHorizontal, Settings, Filter } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import * as React from "react";


export function SearchFilters({ onSearch }: { onSearch: (params: any) => void }) {
    // State for filters
    const [date, setDate] = React.useState<Date>();

    return (
        <div className="bg-white p-4 border-b space-y-4">
            {/* Top Row: Search Text, Status, Department, Toggles */}
            <div className="grid grid-cols-12 gap-4 items-end">

                {/* Search Input */}
                <div className="col-span-4 space-y-1">
                    <Label className="text-xs text-muted-foreground">Search in First Name, Last name columns</Label>
                    <div className="relative">
                        <Button size="icon" variant="ghost" className="absolute left-0 top-0 h-9 w-9 text-blue-900 pointer-events-none">
                            <span className="text-xs font-bold">^</span>
                        </Button>
                        <Input placeholder="Search" className="pl-10" />
                        <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Status */}
                <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Department */}
                <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <div className="flex items-center gap-1 border rounded-md p-1 min-h-[36px]">
                        <div className="bg-stone-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            HR <XCircle className="h-3 w-3 cursor-pointer" />
                        </div>
                        <div className="bg-stone-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            Sales <XCircle className="h-3 w-3 cursor-pointer" />
                        </div>
                        <div className="flex-1"></div>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Toggles */}
                <div className="col-span-3 flex items-center gap-4 pb-2">
                    <div className="flex items-center gap-2">
                        <Switch id="my-accounts" className="data-[state=checked]:bg-red-800" checked />
                        <Label htmlFor="my-accounts" className="text-sm font-normal text-muted-foreground">My Accounts</Label>
                    </div>
                </div>
            </div>

            {/* Middle Row: Job Title, Expected Arrival, Purchase Order, Hiring Date */}
            <div className="grid grid-cols-12 gap-6 pt-2">
                {/* Job Title */}
                <div className="col-span-5 flex items-end gap-2">
                    <div className="w-24 text-right text-sm text-stone-600 pb-2">Job Title:</div>
                    <Select defaultValue="contains">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Contains" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                        <Input className="pr-8" defaultValue="Designer, Front End Developer, UX/UI" />
                        <XCircle className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer" />
                    </div>
                </div>

                {/* Purchase Order Number */}
                <div className="col-span-5 flex items-end gap-2">
                    <div className="w-40 text-right text-sm text-stone-600 pb-2 leading-tight">Pucrhase Order<br />Number:</div>
                    <Select>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">PO-001</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input className="flex-1" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Expected Arrival Date */}
                <div className="col-span-5 flex items-end gap-2">
                    <div className="w-24 text-right text-sm text-stone-600 pb-2 leading-tight">Expected<br />Arrival Date:</div>
                    <Select defaultValue="less_than">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Is Less than" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="less_than">Is Less than</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="15" className="w-20" />
                        <div className="flex flex-col">
                            <Button variant="ghost" size="icon" className="h-4 w-4"><span className="text-[10px]">▲</span></Button>
                            <Button variant="ghost" size="icon" className="h-4 w-4"><span className="text-[10px]">▼</span></Button>
                        </div>
                    </div>
                    <Input className="flex-1" />
                </div>

                {/* Hiring Date */}
                <div className="col-span-6 flex items-end gap-2">
                    <div className="w-32 text-right text-sm text-stone-600 pb-2">Hiring Date:</div>
                    <Select defaultValue="equal_to">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Is Equal to" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="equal_to">Is Equal to</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="w-36">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>2017-10-30</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Input className="flex-1 bg-stone-50" placeholder="Select date" disabled />
                    <Button size="icon" variant="ghost" className="h-9 w-9">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
                <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 uppercase font-semibold">Search</Button>
                <Button variant="outline" className="uppercase text-muted-foreground border-stone-300">Cancel</Button>
                <Button variant="ghost" className="uppercase text-blue-600 font-semibold hover:bg-transparent">Clear</Button>
            </div>
        </div>
    );
}
