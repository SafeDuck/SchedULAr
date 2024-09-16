import Tag from "./Tag";
import toast from "react-hot-toast";

const CustomToolbar = ({
  currentCourse,
  setCurrentCourse,
  userSelection,
  courseList,
}) => {
  const handleSubmit = async () => {
    const courses = Object.keys(userSelection);

    // move currentCourse to beginning of courses
    const index = courses.indexOf(currentCourse);
    if (index > -1) {
      courses.splice(index, 1);
    }
    courses.unshift(currentCourse);

    for (const course of courses) {
      let selectionInCourse = false;
      let unselectedInCourse = false;
      for (const section of userSelection[course]) {
        if (section.preferred || section.available || section.unavailable) {
          selectionInCourse = true;
        } else {
          unselectedInCourse = true;
        }
        if (selectionInCourse && unselectedInCourse) {
          toast.error(`Please finish filling out ${course}`);
          return;
        }
      }
    }

    // send selection to backend
    const req = await fetch("/api/course_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userSelection),
    });

    if (req.ok) {
      toast.success("Selection submitted");
    } else {
      toast.error("Failed to submit selection");
    }
  };

  return (
    <div className="flex justify-center items-center w-full my-3">
      <div className="w-full flex justify-between items-center flex-col md:flex-row">
        <button
          onClick={handleSubmit}
          className="bg-blue-200 hover:bg-blue-300 px-2 py-1 border-3 rounded m-2 disabled"
        >
          Submit
        </button>
        <div className="flex w-full justify-center md:justify-end flex-wrap md:flex-nowrap">
          {courseList.map((course) => (
            <Tag
              key={course}
              title={course}
              onClick={() => setCurrentCourse(course)}
              selected={currentCourse === course}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;
