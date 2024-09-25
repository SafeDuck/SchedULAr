"use client";
import {
  LiaCheckDoubleSolid,
  LiaCheckSolid,
  LiaTimesSolid,
} from "react-icons/lia";

const CustomEvent = ({ event, eventState, onEventClick }) => {
  return (
    <div className="py-1 h-full flex flex-col justify-between ">
      <p className="inline text-black">{event.title}</p>
      <div className="flex justify-center">
        <div className="flex flex-row justify-between text-3xl max-w-[115px] w-full">
          <LiaCheckDoubleSolid
            className={`${
              eventState?.preferred
                ? "backdrop-brightness-[65%] rounded-lg text-green-400"
                : "text-black"
            } ${!eventState?.preferred ? "hover:scale-110 duration-300" : ""}  p-0.5`}
            onClick={(e) => onEventClick(e, event.id, "preferred")}
          />
          <LiaCheckSolid
            className={`${
              eventState?.available
                ? "backdrop-brightness-[65%] rounded-lg text-yellow-400"
                : "text-black"
            } ${!eventState?.available ? "hover:-translate-y-1 duration-300" : ""} p-0.5`}
            onClick={(e) => onEventClick(e, event.id, "available")}
          />
          <LiaTimesSolid
            className={`${
              eventState?.unavailable
                ? "backdrop-brightness-[65%] rounded-lg text-red-400"
                : "text-black "
            } ${!eventState?.unavailable ? "hover:-translate-y-1 duration-300" : ""}  p-0.5`}
            onClick={(e) => onEventClick(e, event.id, "unavailable")}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomEvent;
