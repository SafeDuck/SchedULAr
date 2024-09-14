"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const HoursOverview = () => {
  const [officeHours, setOfficeHours] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch all documents from "office_hours" collection on component mount
  useEffect(() => {
    const fetchOfficeHours = async () => {
      try {
        const officeHoursCollection = collection(db, "total_hours");
        const officeHoursSnapshot = await getDocs(officeHoursCollection);
        const officeHoursList = officeHoursSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate the sum of all hours
        const total = officeHoursList.reduce(
          (sum, doc) => sum + parseFloat(doc.hours || 0),
          0,
        );
        setOfficeHours(officeHoursList);
        setTotalHours(total);
      } catch (error) {
        console.error("Error fetching office hours:", error);
      }
    };

    fetchOfficeHours();
  }, []);

  const handleEditClick = (id, data) => {
    setIsEditing(id);
    setEditData({ ...data });
  };

  const handleSaveClick = async (id) => {
    try {
      const docRef = doc(db, "office-hours", id);
      await updateDoc(docRef, {
        hours: editData.hours,
      });

      // Update the local state with the new edited data
      setOfficeHours((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, hours: editData.hours } : doc,
        ),
      );

      // Recalculate the total hours
      const total = officeHours.reduce(
        (sum, doc) =>
          sum +
          (doc.id === id
            ? parseFloat(editData.hours)
            : parseFloat(doc.hours || 0)),
        0,
      );
      setTotalHours(total);

      setIsEditing(null);
      toast.success("Changes Saved!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Error updating document");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(null);
    setEditData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-4">Office Hours Overview</h2>
      <table className="table-auto border-collapse border border-gray-400 w-3/4">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">SID</th>
            <th className="border border-gray-400 p-2">Total Hours</th>
            <th className="border border-gray-400 p-2">Percentage</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {officeHours.length > 0 ? (
            officeHours.map((doc) => (
              <tr key={doc.id}>
                <td className="border border-gray-400 p-2">{doc.userName}</td>
                <td className="border border-gray-400 p-2">{doc.userEmail}</td>
                <td className="border border-gray-400 p-2">{doc.sid}</td>
                {isEditing === doc.id ? (
                  <>
                    <td className="border border-gray-400 p-2 ">
                      <input
                        type="text"
                        name="hours"
                        value={editData.hours}
                        onChange={handleChange}
                        className="border p-1 border-gray-400"
                      />
                    </td>
                    <td className="border border-gray-400 p-2">
                      {(editData.hours / 20) * 100}%
                    </td>
                    <td className="border border-gray-400 p-2 flex justify-center items-center">
                      <button
                        onClick={() => handleSaveClick(doc.id)}
                        className="bg-green-300 rounded-lg px-2 py-1 hover:bg-green-400"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="bg-red-300 rounded-lg px-2 py-1 hover:bg-red-400 ml-2"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-400 p-2">{doc.hours}</td>
                    <td className="border border-gray-400 p-2">
                      {(doc.hours / 20) * 100}%
                    </td>
                    <td className=" p-2 flex justify-center">
                      <button
                        onClick={() => handleEditClick(doc.id, doc)}
                        className="bg-blue-300 rounded-lg px-2 py-1 hover:bg-blue-400"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-400 p-2 text-center"
              >
                No office hours submitted yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 text-xl flex flex-col gap-2">
        <strong>Total Weekly: {totalHours}</strong>
        <strong>Total Quartly: {totalHours * 10}</strong>
      </div>
    </div>
  );
};

export default HoursOverview;
