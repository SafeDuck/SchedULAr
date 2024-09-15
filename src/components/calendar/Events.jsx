"use client";

import { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import events from "../../data/mockEvents.js";
import { calendars } from "../../data/calendars";
import CustomToolbar from "./Toolbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const mLocalizer = momentLocalizer(moment);

const CalendarEvents = () => {
  const queryClient = useQueryClient();
  const query = useQuery("events", () =>
    fetch(`/api/courses?`).then((res) => res.json()),
  );

  const [current, setCurrent] = useState(0);
  const [eventStates, setEventStates] = useState(
    events.flatMap((eventList) =>
      eventList.map((event) => ({
        id: event.id,
        course: event.class,
        preferred: false,
        available: false,
        unavailable: false,
      })),
    ),
  );
  console.log(eventStates);
  // Update the state for the clicked icon while resetting others
  const handleEventClick = (eventId, iconType) => {
    setEventStates((prevStates) =>
      prevStates.map((event) => {
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
    );
  };

  return (
    <section className="w-full flex justify-center items-center flex-col mt-[6vh]">
      <div className="w-11/12 flex justify-center items-center">
        <div className="w-full relative">
          <Calendar
            className="w-full m-0 p-0"
            events={events[current]}
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
                  eventState={eventStates.find(
                    (state) => state.id === props.event.id,
                  )}
                  onEventClick={handleEventClick}
                />
              ),
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  setCalendar={setCurrent}
                  calendar={{ name: calendars[current].name }}
                  userSelection={eventStates}
                />
              ),
            }}
            formats={{
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, "dddd", culture),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CalendarEvents;
