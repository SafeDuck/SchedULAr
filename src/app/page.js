import React from "react";
import CalendarEvents from "@/components/calendar/Events";

const page = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <CalendarEvents />
    </div>
  );
};

export default page;
