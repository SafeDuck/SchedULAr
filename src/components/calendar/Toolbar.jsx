import Tag from "./Tag";
import toast from "react-hot-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const CustomToolbar = ({
  currentCourse,
  setCurrentCourse,
  userSelection,
  courseList,
  setModalEvent,
  defaultOfficeHours,
}) => {
  const [officeHours, setOfficeHours] = useState(defaultOfficeHours);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userEmail = session.user.email;

  const handleSubmit = async () => {
    setModalEvent(null);
    let selectionInCourse = false;
    let unselectedInCourse = false;
    if (Object.keys(userSelection).length > 0) {
      for (const section of userSelection[currentCourse]) {
        if (section.preferred || section.available || section.unavailable) {
          selectionInCourse = true;
        } else {
          unselectedInCourse = true;
        }
        if (selectionInCourse && unselectedInCourse) {
          toast.error("Please select a choice for all sections");
          return;
        }
      }
    }

    let parsedHours = parseInt(officeHours);
    if (isNaN(parsedHours) || parsedHours < 0) {
      toast.error("Please enter a valid number of hours");
      return;
    }

    // send selection to backend
    if (Object.keys(userSelection).length > 0) {
      const courseDataReq = await fetch("/api/course_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [currentCourse]: userSelection[currentCourse] }),
      });

      if (!courseDataReq.ok) {
        toast.error("Failed to submit selection");
        return;
      }
    }

    const officeHoursReq = await fetch("/api/office_hours", {
      method: "PUT",
      body: JSON.stringify({ course: currentCourse, hours: officeHours }),
    });

    if (!officeHoursReq.ok) {
      toast.error("Failed to submit office hours");
      return;
    }

    toast.success("Selection submitted for " + currentCourse);

    queryClient.setQueryData(["office_hours"], (oldOfficeHours) => ({
      ...oldOfficeHours,
      [currentCourse]: officeHours,
    }));
    queryClient.setQueryData(["sections", currentCourse], (oldSections) => {
      return oldSections.map((section) => {
        const selection = userSelection[currentCourse].find(
          (s) => s.section === section.section,
        );

        const updateSet = (set, condition) => {
          return new Set(
            condition
              ? [...set, userEmail]
              : [...set].filter((email) => email !== userEmail),
          );
        };

        return {
          ...section,
          preferred: updateSet(section.preferred, selection?.preferred),
          available: updateSet(section.available, selection?.available),
          unavailable: updateSet(section.unavailable, selection?.unavailable),
        };
      });
    });
    queryClient.invalidateQueries({ queryKey: ["usersModal", currentCourse] });
  };

  return (
    <div className="flex justify-center items-center w-full my-3">
      <div className="w-full flex justify-between items-center flex-col md:flex-row">
        <div className="flex justify-center md:justify-end flex-wrap md:flex-nowrap">
          {courseList.map((course, i) => (
            <Tag
              key={course}
              title={course}
              onClick={() => {
                setCurrentCourse(course);
                setModalEvent(null);
              }}
              selected={currentCourse === course}
              first={i === 0}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-md">Office Hours / Week:</label>
          <input
            type="text"
            pattern="[0-9]"
            className="border shadow rounded w-12 p-0.5"
            maxLength={4}
            defaultValue={officeHours}
            onChange={(e) => setOfficeHours(e.target.value)}
          ></input>
          <button
            onClick={handleSubmit}
            className="bg-blue-200 hover:bg-blue-300 px-2 py-1 border-3 rounded ml-2 disabled"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;
