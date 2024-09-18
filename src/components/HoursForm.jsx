"use client";

import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const HoursForm = () => {
  const { data: session } = useSession();

  const hoursRef = useRef(null);
  const sidRef = useRef(null);

  const handleSubmit = async () => {
    const hours = hoursRef.current.value;
    const sid = sidRef.current.value;

    // Check if the user is logged in
    if (!session) {
      toast.error("You must be signed in to submit hours.");
      return;
    }

    // Validate hours (must be a number, integer or decimal)
    if (isNaN(hours) || Number(hours) <= 0) {
      toast.error("Please enter a valid number for hours.");
      return;
    }

    // Validate SID (must be exactly 9 digits)
    const sidPattern = /^\d{9}$/;
    if (!sidPattern.test(sid)) {
      toast.error("Please enter a valid 9-digit SID.");
      return;
    }

    // Prepare  hours data to be uploaded/updated in Firestore
    const totalHours = {
      hours: Number(hours),
      sid,
    };

    try {
      await fetch("/api/total_hours", {
        method: "PUT",
        body: JSON.stringify(totalHours),
      });
      toast.success("Submitted successfully!");
    } catch (error) {
      console.error("Error submitting total hours:", error);
      toast.error("Failed to submit total hours.");
    }
  };

  return (
    <form
      className="w-1/3 flex flex-row gap-5 my-[6vh] justify-center items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-row gap-5 justify-end items-center">
        <label htmlFor="hours">Total Hours:</label>
        <input
          type="text"
          id="hours"
          name="hours"
          className="border shadow rounded p-2"
          ref={hoursRef}
        />
      </div>
      <div className="flex flex-row gap-5 justify-end items-center">
        <label htmlFor="sid">SID:</label>
        <input
          type="text"
          id="sid"
          name="sid"
          className="border shadow rounded  p-2"
          ref={sidRef}
        />
      </div>
      <button
        type="button"
        className="bg-blue-300 rounded-lg px-2 py-2 w-1/4 hover:bg-blue-400 hover:cursor-pointer"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default HoursForm;
