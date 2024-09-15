"use client";
import {
  LiaCheckDoubleSolid,
  LiaCheckSolid,
  LiaTimesSolid,
} from "react-icons/lia";

const CustomEvent = ({ event, eventState, onEventClick }) => {
  return (
    <div className="p-1 h-full flex flex-col justify-between">
      <p className="inline">{event.title}</p>
      <div className="flex flex-row justify-center gap-4 text-3xl">
        <LiaCheckDoubleSolid
          className={`${
            eventState?.preferred
              ? "bg-[#225b8c] rounded-lg text-green-300"
              : "text-white"
          } ${!eventState?.preferred ? "hover:text-green-300" : ""}  p-0.5`}
          onClick={() => onEventClick(event.id, "preferred")}
        />
        <LiaCheckSolid
          className={`${
            eventState?.available
              ? "bg-[#225b8c] rounded-lg text-yellow-300"
              : "text-white"
          } ${!eventState?.available ? "hover:text-yellow-300" : ""} p-0.5`}
          onClick={() => onEventClick(event.id, "available")}
        />
        <LiaTimesSolid
          className={`${
            eventState?.unavailable
              ? "bg-[#225b8c] rounded-lg text-red-300"
              : "text-white"
          } ${!eventState?.unavailable ? "hover:text-red-300" : ""}  p-0.5`}
          onClick={() => onEventClick(event.id, "unavailable")}
        />
      </div>
    </div>
  );
};

export default CustomEvent;
