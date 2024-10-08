"use client";

import { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import CustomToolbar from "./Toolbar";
import Modal from "./Modal.jsx";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const mLocalizer = momentLocalizer(moment);

const convertToDate = (day, time) => {
  const date = new Date(2023, 0, 2);
  const dayIndex = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ].indexOf(day);
  date.setDate(date.getDate() + dayIndex);
  date.setHours(parseInt(time.split(":")[0]));
  date.setMinutes(parseInt(time.split(":")[1]));
  return date;
};

const CalendarEvents = () => {
  const [modalEvent, setModalEvent] = useState(null);
  const session = useSession();
  const userEmail = session.data.user.email;
  const { data: courseList } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch("/api/course_list");
      if (!response.ok) {
        toast.error("Failed to fetch course list");
        return [];
      }

      const courseList = await response.json();
      return courseList.sort((a, b) => a.localeCompare(b));
    },
    placeholderData: [],
  });

  const [currentCourse, setCurrentCourse] = useState("CS009A");

  const [eventStates, setEventStates] = useState({});

  const { data: sections } = useQuery({
    queryKey: ["sections", currentCourse],
    queryFn: async () => {
      const response = await fetch(`/api/course_data?course=${currentCourse}`);
      if (!response.ok) {
        toast.error("Failed to fetch course data");
        return [];
      }

      const sectionData = await response.json();
      const sections = sectionData.map((section) => ({
        id: section.id,
        title: `Sec ${section.section}`,
        section: section.section,
        start: convertToDate(section.day, section.begin_time),
        end: convertToDate(section.day, section.end_time),
        preferred: section.preferred ? new Set(section.preferred) : new Set(),
        available: section.available ? new Set(section.available) : new Set(),
        unavailable: section.unavailable
          ? new Set(section.unavailable)
          : new Set(),
        location: section.location,
        ula: section.ula,
      }));

      return sections;
    },
  });

  const { data: officeHours } = useQuery({
    queryKey: ["office_hours"],
    queryFn: async () => {
      const response = await fetch("/api/office_hours");
      return response.json();
    },
    placeholderData: {},
  });

  if (sections !== undefined && !(currentCourse in eventStates)) {
    setEventStates({
      ...eventStates,
      [currentCourse]: sections.map((section) => ({
        id: section.id,
        section: section.section,
        preferred: section.preferred?.has(userEmail) || false,
        available: section.available?.has(userEmail) || false,
        unavailable: section.unavailable?.has(userEmail) || false,
      })),
    });
  }

  // Update the state for the clicked icon while resetting others
  const handleEventClick = (e, eventId, iconType) => {
    e.stopPropagation();
    setEventStates((prevStates) => ({
      ...prevStates,
      [currentCourse]: prevStates[currentCourse]?.map((event) => {
        if (event.id === eventId) {
          // Toggle the state of the clicked icon
          return {
            ...event,
            preferred: iconType === "preferred" ? !event.preferred : false,
            available: iconType === "available" ? !event.available : false,
            unavailable:
              iconType === "unavailable" ? !event.unavailable : false,
          };
        }
        return event;
      }),
    }));
  };

  return (
    <section className="w-full flex justify-center items-center flex-col my-[6vh]">
      <div className="w-11/12 flex justify-center items-center">
        <div className="w-full h-[90vh] relative">
          <Calendar
            className="w-full m-0 p-0"
            events={sections}
            localizer={mLocalizer}
            defaultDate={new Date(2023, 0, 1)}
            defaultView={"work_week"}
            views={["day", "work_week"]}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            dayLayoutAlgorithm={"no-overlap"}
            components={{
              event: (props) => (
                <CustomEvent
                  {...props}
                  eventState={eventStates[currentCourse]?.find(
                    (state) => state.id === props.event.id,
                  )}
                  onEventClick={handleEventClick}
                />
              ),
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  currentCourse={currentCourse}
                  setCurrentCourse={setCurrentCourse}
                  userSelection={eventStates}
                  courseList={courseList}
                  setModalEvent={setModalEvent}
                  defaultOfficeHours={officeHours[currentCourse] || 0}
                />
              ),
            }}
            formats={{
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, "dddd", culture),
            }}
            onSelectEvent={(event) => {
              setModalEvent(event);
            }}
            eventPropGetter={(event) => {
              if (event.preferred.size > 0) {
                return {
                  className: "!bg-green-300 !text-black !border-green-400",
                };
              } else if (event.available.size > 0) {
                return {
                  className: "!bg-yellow-300 !text-black !border-yellow-400",
                };
              } else {
                return { className: "!bg-red-300 !text-black !border-red-400" };
              }
            }}
          />
        </div>
        {modalEvent && (
          <Modal
            event={modalEvent}
            setEvent={setModalEvent}
            course={currentCourse}
          />
        )}
      </div>
    </section>
  );
};

export default CalendarEvents;
