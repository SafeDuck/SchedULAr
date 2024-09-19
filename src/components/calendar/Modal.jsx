import { AiOutlinePlus } from "react-icons/ai";
import {
  LiaCheckDoubleSolid,
  LiaCheckSolid,
  LiaTimesSolid,
} from "react-icons/lia";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Modal = ({ event, setEvent, course }) => {
  const session = useSession();
  const [selected, setSelected] = useState({
    group: null,
    index: null,
    name: null,
  });
  const queryClient = useQueryClient();

  const fetchUsers = async (req) => {
    const reqs = req.map((user) => {
      if (user.length > 0) {
        return api({ url: `/api/users?users=${user}`, method: "GET" });
      } else {
        return Promise.resolve([]);
      }
    });
    const results = await Promise.all(reqs);
    return results;
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usersModal", event?.id],
    queryFn: () =>
      fetchUsers([
        event?.preferred || [],
        event?.available || [],
        event?.unavailable || [],
      ]),
    enabled: !!event,
  });

  useEffect(() => {
    if (users && event.ula) {
      let found = false;
      users[0].forEach((user, index) => {
        if (user.name === event.ula) {
          setSelected({ group: "preferred", index, name: user.name });
          found = true;
        }
      });
      if (!found) {
        users[1].forEach((user, index) => {
          if (user.name === event.ula) {
            setSelected({ group: "available", index, name: user.name });
            found = true;
          }
        });
      }
      if (!found) {
        users[2].forEach((user, index) => {
          if (user.name === event.ula) {
            setSelected({ group: "unavailable", index, name: user.name });
          }
        });
      }
    }
  }, [users, event.ula]);

  const handleUserClick = async (group, index, name) => {
    try {
      if (!session.data.user.admin) {
        // TODO: Fix Bug session bug
        toast.error("Admin Action Only");
        return;
      }
      if (name === selected.name) {
        name = null;
      }
      await api({
        url: "/api/course_data",
        method: "PUT",
        body: { ula: name, section: event.section, course: course },
      });

      if (selected.group === group && selected.index === index) {
        setSelected({ group: null, index: null, name: null });
      } else {
        setSelected({ group, index, name });
      }
      queryClient.invalidateQueries(["usersModal", event.id]); // refetch modal data
    } catch (err) {
      toast.error("Error!");
    }
  };

  return (
    <div className=" bg-blue-400 font-playfair  bottom-2/3 fixed -translate-y-3 md:min-w-[30vw] z-10 drop-shadow-lg">
      {isLoading ? (
        <div className="text-white text-2xl flex flex-row justify-center items-center my-[15%]">
          Loading...
          <AiOutlinePlus
            onClick={() => setEvent(null)}
            className="text-white rotate-45 p-0 hover:scale-110 duration-300 hover:cursor-pointer text-3xl ml-10 mb-10"
          />
        </div>
      ) : isError ? (
        <div className="text-white text-2xl">
          Error!
          <AiOutlinePlus
            onClick={() => setEvent(null)}
            className="text-white rotate-45 p-0 hover:scale-110 duration-300 hover:cursor-pointer text-3xl m-3"
          />
        </div>
      ) : (
        <>
          <div className={`flex justify-between items-center`}>
            <p
              className={
                " m-0 py-2 md:py-3 px-3 md:px-4 text-lg md:text-2xl text-white"
              }
            >
              {course} - {event.title}
            </p>

            <div className="absolute right-2 md:py-3 px-12 md:px-12 text-lg text-white">
              {event.location}
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
                  {users[0]?.map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "preferred" && selected.index === index ? "bg-[#225B8C] px-1 rounded-lg" : ""} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() =>
                        handleUserClick("preferred", index, user.name)
                      }
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <LiaCheckSolid className="text-3xl bg-[#225b8c] rounded-lg text-yellow-300 p-0.5" />
                <div className="flex flex-row gap-2">
                  {users[1]?.map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "available" && selected.index === index ? "bg-[#225B8C] px-1 rounded-lg" : ""} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() =>
                        handleUserClick("available", index, user.name)
                      }
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <LiaTimesSolid className="text-3xl bg-[#225b8c] rounded-lg text-red-300 p-0.5" />
                <div className="flex flex-row gap-2">
                  {users[2]?.map((user, index) => (
                    <div
                      key={index}
                      className={`${selected.group === "unavailable" && selected.index === index ? "bg-[#225B8C] px-1 rounded-lg" : ""} flex flex-row gap-1 hover:cursor-pointer hover:underline`}
                      onClick={() =>
                        handleUserClick("unavailable", index, user.name)
                      }
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
