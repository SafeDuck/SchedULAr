import Tag from "./Tag";
import toast from "react-hot-toast";

const CustomToolbar = ({
  currentCourse,
  setCurrentCourse,
  userSelection,
  courseList,
  setModalEvent,
}) => {
  const handleSubmit = async () => {
    setModalEvent(null);
    let selectionInCourse = false;
    let unselectedInCourse = false;
    for (const section of userSelection[currentCourse]) {
      if (section.preferred || section.available || section.unavailable) {
        selectionInCourse = true;
      } else {
        unselectedInCourse = true;
      }
      if (selectionInCourse && unselectedInCourse) {
        toast.error("Please select a choice for all sections");
        return;
      }
    }

    // send selection to backend
    const req = await fetch("/api/course_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [currentCourse]: userSelection[currentCourse] }),
    });

    if (req.ok) {
      toast.success("Selection submitted for " + currentCourse);
    } else {
      toast.error("Failed to submit selection");
    }
  };

  return (
    <div className="flex justify-center items-center w-full my-3">
      <div className="w-full flex justify-between items-center flex-col md:flex-row">
        <div className="flex justify-center md:justify-end flex-wrap md:flex-nowrap">
          {courseList.map((course, i) => (
            <Tag
              key={course}
              title={course}
              onClick={() => {
                setCurrentCourse(course);
                setModalEvent(null);
              }}
              selected={currentCourse === course}
              first={i === 0}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-200 hover:bg-blue-300 px-2 py-1 border-3 rounded ml-2 disabled"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
