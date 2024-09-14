'use client';

import { useSession } from "next-auth/react";
import CalendarEvents from "@/components/calendar/Events";
import Profile from "@/components/Profile";

const Page = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>; // Show loading state while session is being fetched
  }

  const { admin } = session.user;

  if (admin !== 1) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <p className="text-red-500 text-2xl">Unauthorized to access this page</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
        TODO: Admin page
    </div>
  );
};

export default Page;
