import CalendarEvents from "@/components/calendar/Events";
import Profile from "@/components/Profile";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession();
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Profile />
      <CalendarEvents />
    </div>
  );
};

export default page;
