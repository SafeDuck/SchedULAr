"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { unparse } from "papaparse";

const Report = () => {
  const handleSubmit = async () => {
    const courses = await api({
      url: "/api/course_list",
      method: "GET",
    });
    
    const output = [["Course","ULA","Office Hours","Sections"]];

    for (const course of courses.sort().slice(0, 2)) {
        console.log(course) 
    }
  };

  const mutation = useMutation({
    mutationFn: handleSubmit,
  });
  return (
    <button
      type="button"
      className="bg-blue-300 text-lg rounded-lg px-4 py-1 hover:bg-blue-400 hover:cursor-pointer mx-auto"
      onClick={mutation.mutate}
    >
      Full Report
    </button>
  );
};

export default Report;
