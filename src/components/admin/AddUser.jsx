"use client";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

const AddUser = () => {
  const emailRef = useRef(null);
  const ulaRef = useRef(null);
  const adminRef = useRef(null);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const email = emailRef.current.value.trim();
    const ula = ulaRef.current.checked ? 1 : 0;
    const admin = adminRef.current.checked ? 1 : 0;
    try {
      await api({
        url: "/api/users",
        method: "POST",
        body: { email, ula, admin },
      });
    } catch (err) {
      console.log("Error Adding User:", err);
    }
  };

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      // queryClient.setQueryData(["users"], (oldData) => newData)
      queryClient.invalidateQueries(["users"]);
      emailRef.current.value = "";
      ulaRef.current.checked = false;
      adminRef.current.checked = false;
    },
  });
  return (
    <form
      className=" w-1/3 flex flex-row justify-center items-center gap-3 mb-20"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="email" className="text-xl">
        Email:{" "}
      </label>
      <input
        type="text"
        name="email"
        ref={emailRef}
        className="border shadow rounded"
      />

      <label htmlFor="ula" className="text-xl">
        ULA:{" "}
      </label>
      <input
        type="checkbox"
        name="ula"
        ref={ulaRef}
        className="border hover:cursor-pointer size-5 rounded-xl"
      />

      <label htmlFor="admin" className="text-xl">
        Admin:{" "}
      </label>
      <input
        type="checkbox"
        name="admin"
        ref={adminRef}
        className="border hover:cursor-pointer size-5 rounded-xl "
      />

      <button
        type="button"
        className="bg-blue-300 text-lg rounded-lg px-4 py-1 hover:bg-blue-400 hover:cursor-pointer mx-auto"
        onClick={mutation.mutate}
      >
        Add
      </button>
    </form>
  );
};

export default AddUser;
