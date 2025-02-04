import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { setTime } from "@/config/redux/reducers/timeSlice";

interface TimePicker {
    setSelectedTime?: (value: string) => void;
    selectedTime: string;
    update: boolean;
    editAble: boolean;
}

const TimePicker = ({ setSelectedTime, selectedTime, editAble, update }: TimePicker) => {
    const dispatch = useDispatch();
    const [showText, setShowText] = useState(false);
    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (setSelectedTime) {
            setSelectedTime(event.target.value);
        }
        const time = Number(event.target.value[0] + event.target.value[1] + event.target.value[3] + event.target.value[4]);
        console.log(time);
        if (time < 900 || time > 1700) {
            setShowText(true)
            dispatch(setTime(false));
        } else {
            setShowText(false)
            dispatch(setTime(true));
        }
    };

    return (
        <>
            {!editAble ? <div className="mb-4">
                <Input
                    required
                    defaultValue={selectedTime}
                    type="time"
                    id="time"
                    aria-label="Choose time"
                    className="w-[280px]"
                />
                {<p className="mt-2 text-sm font-medium">Selected Time: {selectedTime}</p>}
            </div> : <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                    {update ? "Update the appointment time" : "Select a time for which you are available"}
                </label>
                <Input
                    required
                    type="time"
                    id="time"
                    aria-label="Choose time"
                    className="w-[280px]"
                    value={selectedTime}
                    onChange={handleTimeChange}
                />
                {showText && <p className="text-sm text-red-500 mt-1">
                    Saylani Offices are open only from 9 am to 5 pm.
                </p>}
                {selectedTime && <p className="mt-2 text-sm font-medium">Selected Time: {selectedTime}</p>}
            </div>}
        </>
    );
};

export default TimePicker;