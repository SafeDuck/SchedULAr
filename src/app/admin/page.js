"use client";

import { useSession } from "next-auth/react";
import HoursOverview from "@/components/admin/HoursOverview";
import ManageUsers from "@/components/admin/ManageUsers";
import AddUser from "@/components/admin/AddUser";

const Page = () => {
  const { data: session } = useSession();

  const user = session?.user;

  if (user?.admin !== 1) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <p className="text-red-500 text-2xl">
          Unauthorized to access this page
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-20">
      <HoursOverview />
      <ManageUsers />
      <AddUser />
    </div>
  );
};

export default Page;
