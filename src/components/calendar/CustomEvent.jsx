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
            eventState?.checkDouble
              ? "bg-[#225b8c] rounded-lg text-green-300"
              : "text-white"
          } ${!eventState?.checkDouble ? "hover:text-green-300" : ""}  p-0.5`}
          onClick={() => onEventClick(event.id, "checkDouble")}
        />
        <LiaCheckSolid
          className={`${
            eventState?.check
              ? "bg-[#225b8c] rounded-lg text-yellow-300"
              : "text-white"
          } ${!eventState?.check ? "hover:text-yellow-300" : ""} p-0.5`}
          onClick={() => onEventClick(event.id, "check")}
        />
        <LiaTimesSolid
          className={`${
            eventState?.no
              ? "bg-[#225b8c] rounded-lg text-red-300"
              : "text-white"
          } ${!eventState?.no ? "hover:text-red-300" : ""}  p-0.5`}
          onClick={() => onEventClick(event.id, "no")}
        />
      </div>
    </div>
  );
};

export default CustomEvent;
