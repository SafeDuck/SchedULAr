"use client";

import { useSession } from "next-auth/react";
import CalendarEvents from "@/components/calendar/Events";
import Profile from "@/components/Profile";
import OfficeHours from "@/components/HoursForm";

const Page = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  const { ula, admin } = session.user;

  if (ula !== 1 && admin !== 1) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <p className="text-red-500 text-2xl">
          Unauthorized to access this page
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Profile />
      <CalendarEvents />
      <OfficeHours />
    </div>
  );
};

export default Page;
