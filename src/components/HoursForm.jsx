"use client";

import { useRef } from "react";
import { toast } from "react-hot-toast";
import { db } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
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

    const user = session.user;

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
      userName: user.name,
      userEmail: user.email,
    };

    try {
      // Use setDoc to update the document if it exists, or create a new one based on the user email
      const userDocRef = doc(db, "total_hours", user.email); // Using the user's email as the document ID
      await setDoc(userDocRef, totalHours, { merge: true }); // merge: true to only update changed fields
      toast.success("Total hours submitted successfully!");

      // Clear form fields after successful submission
      hoursRef.current.value = "";
      sidRef.current.value = "";
    } catch (error) {
      console.error("Error submitting total hours:", error);
      toast.error("Failed to submit total hours.");
    }
  };

  return (
    <form
      className="w-1/3 flex flex-col gap-5 my-[5%]"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-row gap-5 items-center">
        <label htmlFor="hours">Total Hours:</label>
        <input
          type="text"
          id="hours"
          name="hours"
          className="border shadow rounded w-full p-2"
          ref={hoursRef}
        />
      </div>
      <div className="flex flex-row gap-5 items-center">
        <label htmlFor="sid">SID:</label>
        <input
          type="text"
          id="sid"
          name="sid"
          className="border shadow rounded w-full p-2"
          ref={sidRef}
        />
      </div>
      <button
        type="button"
        className="bg-blue-200 rounded-lg p-3 w-1/4 hover:bg-blue-300 hover:cursor-pointer mx-auto"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default HoursForm;
