"use client";

import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MySection from "@/components/calendar/MySection";

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
  const session = useSession();
  const userName = session.data.user.name;

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
  const allQueries = useQueries({
    queries: courseList.map((course) => {
      return {
        queryKey: ["sections", course],
        queryFn: async () => {
          const response = await fetch(`/api/course_data?course=${course}`);
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
            location: section.location,
            ula: section.ula,
            course: course,
          }));

          return sections;
        },
      };
    }),
  });

  let allSections = [];
  allQueries.forEach((query) => {
    allSections.push(query.data);
  });
  allSections = allSections.flat();

  return (
    <section className="w-full flex justify-center items-center flex-col my-[6vh]">
      <div className="w-11/12 flex justify-center items-center">
        <div className="w-full h-[90vh] relative">
          <Calendar
            className="w-full m-0 p-0"
            events={allSections?.filter((section) => userName === section?.ula)}
            localizer={mLocalizer}
            defaultDate={new Date(2023, 0, 1)}
            defaultView={"work_week"}
            views={["day", "work_week"]}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            dayLayoutAlgorithm={"no-overlap"}
            components={{
              event: (props) => <MySection {...props} />,
              toolbar: () => null,
            }}
            formats={{
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, "dddd", culture),
            }}
            eventPropGetter={() => {
              return {
                className:
                  "!bg-blue-300 !text-black !border-blue-400 hover:cursor-default",
              };
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CalendarEvents;
