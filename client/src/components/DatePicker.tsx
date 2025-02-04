"use client"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { setDateValidity } from "@/config/redux/reducers/dateSlice"
import { useDispatch } from "react-redux"
import { toast, Toaster } from "sonner"

interface DatePickerProps {
    date: Date | undefined;
    setDate?: (value: Date | undefined) => void;
    update: boolean;
    editAble:boolean;
}

export function DatePicker({ date, setDate,editAble,update }: DatePickerProps) {
    const [showText, setShowText] = useState(false);
    const dispatch = useDispatch();
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        const day = selectedDate.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate) {
            const date = new Date(selectedDate);
            selectedDate.setHours(0, 0, 0, 0);
            if (date <= today) {
                return toast("Invalid date!", {
                    description: "You can book an appointment tommorrow at the earliest!",
                    action: { label: "Ok", onClick: () => console.log("Ok clicked") },
                });
            }
        }
        if (day === 6 || day === 0) {
            setShowText(true);
            dispatch(setDateValidity(false));
        } else {
            setShowText(false);
            dispatch(setDateValidity(true));
        }
        if (setDate) {
            setDate(selectedDate);
        }
    };

    return (
        <>
        {!editAble ? <div className="mb-4">
            <Toaster />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date && format(date, "PPP")}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        required
                        id="calender"
                        mode="single"
                        selected={date}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {<p className="mt-2 text-sm font-medium">Selected Date: {date?.toLocaleDateString()}</p>}
        </div>:<div className="mb-4">
            <Toaster />
            <label htmlFor="calender" className="block text-sm font-medium mb-2">
                {update ? "Update the appointment date" : "Select a date for which you are available"}
            </label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        required
                        id="calender"
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {showText && <p className="text-sm text-red-500 mt-1">Saylani Offices are not open on weekends.</p>}
            {date && <p className="mt-2 text-sm font-medium">Selected Date: {date.toLocaleDateString()}</p>}
        </div>}
        </>
    );
}