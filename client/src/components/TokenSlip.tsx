import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import close from "@/assets/close.png"

interface Appointment {
    _id: string;
    appointmentDay: string;
    appointmentTime: string;
    location: string;
    tokenNumber: number;
}

interface TokenSlipProps {
    setShowTokenSlip: (value: boolean) => void;
    appointment?: Appointment;
}

interface AppointmentState {
    appointment: {
        appointment: Appointment;
    }
}

const TokenSlip: React.FC<TokenSlipProps> = ({ setShowTokenSlip, appointment }) => {
    const appointmentInRedux = useSelector((state:AppointmentState) => state.appointment.appointment);
    const handleDownload = async () => {
        const slipElement = document.getElementById("token-slip");
        if (!slipElement) return alert("Slip not found!");

        const canvas = await html2canvas(slipElement, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
        });

        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "token-slip.png";
        link.click();
        setShowTokenSlip(false);
    };
    return (
        <div className="fixed px-3 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className='text-center relative'>
                <div
                    id="token-slip"
                    className="p-5 max-w-sm mx-auto bg-white rounded-lg shadow-md"
                >
                    <h1 className="text-xl text-center font-semibold">Your loan request has been submitted!</h1>
                    <div className="flex flex-col mt-4 mx-auto w-fit mb-3 items-center">
                        <QRCode
                            size={128}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={appointment ? appointment._id : appointmentInRedux._id}
                            viewBox={`0 0 128 128`}
                        />
                        <h2 className="text-lg font-semibold mt-3 text-center">Token No: {String(appointment ? appointment.tokenNumber : appointmentInRedux.tokenNumber).padStart(4, "0")}</h2>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <p className="text-sm">Appointment Details:</p>
                        <ul className="mt-[5px] text-sm">
                            <li><strong>Date:</strong> {appointment ? appointment.appointmentDay : appointmentInRedux.appointmentDay}</li>
                            <li className='mt-[5px]'><strong>Time:</strong> {appointment ? appointment.appointmentTime : appointmentInRedux.appointmentTime}</li>
                            <li className='mt-[5px]'><strong>Location:</strong> {appointment ? appointment.location : appointmentInRedux.location}</li>
                        </ul>
                    </div>
                </div>
                <Button
                    onClick={handleDownload}
                    className="bg-[#0971c0] hover:bg-[#0971c0d9] text-white px-5 py-2 mt-4 hover:bg-blue-600 transition duration-300"
                >
                    Download Slip
                </Button>
                <Image onClick={() => setShowTokenSlip(false)} width={13} className="absolute cursor-pointer top-4 right-4" src={close} alt="cross" />
            </div>
        </div>
    );
};

export default TokenSlip;