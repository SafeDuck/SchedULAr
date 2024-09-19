"use client";
import { api } from "@/utils/api";
import { useUsers } from "@/utils/useUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const deleteUser = async (email) => {
  try {
    await api({
      url: "/api/users",
      method: "DELETE",
      body: { email },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const updateUser = async (updatedUser) => {
  try {
    await api({
      url: "/api/users",
      method: "PUT",
      body: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: updateUser,
  });

  const handleCheckboxChange = (email, field, value) => {
    const updatedUser = users.find((user) => user.email === email);
    value ? (updatedUser[field] = 1) : (updatedUser[field] = 0);

    mutationUpdate.mutate({
      email: updatedUser.email,
      ula: updatedUser.ula,
      admin: updatedUser.admin,
    });
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error fetching users! Please try again</div>;
  }
  return (
    <div className="w-1/2 flex flex-col items-center justify-center">
      <div className="text-2xl font-semibold mb-4">Manage Users</div>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">ULA</th>
            <th className="border border-gray-400 p-2">Admin</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="border border-gray-400 p-2 0 w-1/2">
                {user.email}
              </td>
              <td align="middle" className="border border-gray-400 p-2">
                <input
                  type="checkbox"
                  checked={user.ula ? true : false}
                  id="ula"
                  onChange={(e) =>
                    handleCheckboxChange(user.email, "ula", e.target.checked)
                  }
                  className="border size-5 rounded-xl"
                />
              </td>
              <td align="middle" className="border border-gray-400 p-2">
                <input
                  type="checkbox"
                  checked={user.admin ? true : false}
                  id="admin"
                  onChange={(e) =>
                    handleCheckboxChange(user.email, "admin", e.target.checked)
                  }
                  className="border size-5 rounded-xl"
                />
              </td>
              <td align="middle" className="border border-gray-400 p-2">
                <button
                  className="bg-red-300 rounded-lg px-2 py-1 hover:bg-red-400"
                  onClick={() => mutationDelete.mutate(user.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
