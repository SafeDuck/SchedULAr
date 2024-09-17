"use client";

import { useSession } from "next-auth/react";
import CalendarEvents from "@/components/calendar/Events";
import HoursForm from "@/components/HoursForm";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const user = session?.user;

  if (!user || (!user.ula && !user.admin)) {
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
      <CalendarEvents />
    </div>
  );
};

export default Page;
