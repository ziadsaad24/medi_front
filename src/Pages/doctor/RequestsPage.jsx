import DoctorLayout from "../../Components/DoctorLayout";
import { BookingRequests } from "../../Components/BookingRequests";

export default function RequestsPage() {
  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-full">
        <BookingRequests />
      </div>
    </DoctorLayout>
  );
}