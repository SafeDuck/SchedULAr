"use client";

import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/utils/useUsers";

const HoursOverview = () => {
  const { data: hours } = useQuery({
    queryKey: ["total_hours"],
    queryFn: async () => {
      const response = await fetch("/api/total_hours?all=true");
      return response.json();
    },
    placeholderData: {},
  });

  const { data: users } = useUsers();

  const total = Object.values(hours).reduce(
    (a, b) => a + parseFloat(b.hours),
    0,
  );

  return (
    <div className="w-2/3 flex flex-col justify-center items-center">
      <div className="text-2xl font-semibold mb-4">Total Hours Overview</div>
      <table className="table-auto border-collapse border border-gray-400 w-3/4">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">SID</th>
            <th className="border border-gray-400 p-2">Total Hours</th>
            <th className="border border-gray-400 p-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(hours).length > 0 ? (
            Object.keys(hours).map((ulaEmail) => {
              const ula = users.find((user) => user.email === ulaEmail);
              return (
                <tr key={ulaEmail}>
                  <td className="border border-gray-400 p-2">{ula?.name}</td>
                  <td className="border border-gray-400 p-2">{ulaEmail}</td>
                  <td className="border border-gray-400 p-2">
                    {hours[ulaEmail].sid}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {hours[ulaEmail].hours}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {(hours[ulaEmail].hours / 40) * 100}%
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-400 p-2 text-center"
              >
                No total hours submitted yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 text-xl flex flex-col gap-2">
        <strong>Total Weekly: {total}</strong>
        <strong>Total Quartly: {total * 10}</strong>
      </div>
    </div>
  );
};

export default HoursOverview;
