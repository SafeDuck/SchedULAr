'use client';

import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>; // Show loading state while session is being fetched
  }

  const { ula, admin } = session.user;

  if (ula !== 1 && admin !== 1) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <p className="text-red-500 text-2xl">Unauthorized to access this page</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      TODO: Office hours spreadsheet
    </div>
  );
};

export default Page;
