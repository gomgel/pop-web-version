import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SearchFilters({ onSearch, onExport }: { onSearch: (params: any) => void, onExport: () => void }) {
    const [plant, setPlant] = useState("2000");
    const [emplCode, setEmplCode] = useState("");
    const [emplName, setEmplName] = useState("");

    const handleSearch = () => {
        onSearch({
            plantCode: plant,
            emplCode,
            emplName
        });
    };

    const handleClear = () => {
        setPlant("2000");
        setEmplCode("");
        setEmplName("");
        onSearch({ plantCode: "2000" });
    };

    return (
        <div className="bg-white p-4 border-b space-y-4">
            <div className="flex items-center gap-6">
                {/* Plant */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-stone-600 font-normal">Plant :</Label>
                    <Select value={plant} defaultValue="2000" onValueChange={setPlant}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2000">2000</SelectItem>
                            <SelectItem value="2001">2001</SelectItem>
                            <SelectItem value="2002">2002</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Employee ID */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-stone-600 font-normal">Employee Id :</Label>
                    <Input
                        className="w-40"
                        value={emplCode}
                        onChange={(e) => setEmplCode(e.target.value)}
                    />
                </div>

                {/* Employee Name */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-stone-600 font-normal">Employee Name :</Label>
                    <Input
                        className="w-40"
                        value={emplName}
                        onChange={(e) => setEmplName(e.target.value)}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
                <Button
                    className="bg-blue-900 hover:bg-blue-800 text-white px-8 uppercase font-semibold"
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button variant="outline" className="uppercase text-muted-foreground border-stone-300">Cancel</Button>
                <Button
                    variant="ghost"
                    className="uppercase text-blue-600 font-semibold hover:bg-transparent"
                    onClick={handleClear}
                >
                    Clear
                </Button>
                <Button
                    className="bg-green-700 hover:bg-green-600 text-white px-8 uppercase font-semibold ml-auto"
                    onClick={onExport}
                >
                    Export
                </Button>
            </div>
        </div>
    );
}
