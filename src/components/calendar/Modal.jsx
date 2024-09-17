import { AiOutlinePlus } from "react-icons/ai";
import {
  LiaCheckDoubleSolid,
  LiaCheckSolid,
  LiaTimesSolid,
} from "react-icons/lia";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useState } from "react";

const fetchUsers = async (req) => {
  const reqs = req.map((user) => {
    console.log("p", user);
    if (user.length > 0) {
      return api({ url: `/api/users?users=${user}`, method: "GET" });
    } else {
      return Promise.resolve([]);
    }
  });
  const results = await Promise.all(reqs);
  return results;
};

const Modal = ({ event, setEvent }) => {
  const [selected, setSelected] = useState({ group: null, index: null });

  const handleUserClick = (group, index) => {
    console.log(selected);
    // Toggle user selection: if the same user is clicked, deselect; otherwise, select the new one
    if (selected.group === group && selected.index === index) {
      setSelected({ group: null, index: null }); // Deselect if clicking the same user again
    } else {
      setSelected({ group, index }); // Select new user
    }
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usersModal", event?.id],
    queryFn: () =>
      fetchUsers([event.preferred, event.available, event.unavailable]),
    enabled: !!event,
  });

  return (
    <div className=" bg-blue-400 font-playfair  bottom-2/3 fixed -translate-y-3 md:min-w-[30vw] z-10 drop-shadow-lg">
      {isLoading ? (
        <div className="text-white text-2xl flex flex-row justify-center items-center my-[15%]">
          Loading...
        </div>
      ) : isError ? (
        <div className="text-white text-2xl">Error!</div>
      ) : (
        <>
          <div className={`flex justify-between items-center`}>
            <p
              className={
                " m-0 py-2 md:py-3 px-3 md:px-4 text-lg md:text-2xl text-white"
              }
            >
              {event.title}
            </p>

            <div className="absolute right-2 md:py-3 px-12 md:px-12 text-lg text-white">
              Location
            </div>

            <AiOutlinePlus
              onClick={() => setEvent(null)}
              className="text-white rotate-45 p-0 hover:scale-110 duration-300 hover:cursor-pointer text-3xl m-3"
            />
          </div>
          <div className="p-3">
            <div className="md:text-lg p-2 text-white flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <LiaCheckDoubleSolid className="text-3xl bg-[#225b8c] rounded-lg text-green-300 p-0.5" />
                <div className="flex flex-row gap-2">
                  {users[0].map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "preferred" && selected.index === index ? "bg-[#225b8c] px-1 rounded-lg" : ""} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() => handleUserClick("preferred", index)}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <LiaCheckSolid className="text-3xl bg-[#225b8c] rounded-lg text-yellow-300 p-0.5" />
                <div className="flex flex-row gap-2">
                  {users[1].map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "available" && selected.index === index ? "bg-[#225b8c] px-1 rounded-lg" : ""}} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() => handleUserClick("available", index)}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <LiaTimesSolid className="text-3xl bg-[#225b8c] rounded-lg text-red-300 p-0.5" />
                <div className="flex flex-row gap-2">
                  {users[2].map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "unavailable" && selected.index === index ? "bg-[#225b8c] px-1 rounded-lg" : ""} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() => handleUserClick("unavailable", index)}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
