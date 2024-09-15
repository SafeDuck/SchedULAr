import Tag from "./Tag";
import toast from "react-hot-toast";

const CustomToolbar = ({
  calendar,
  setCalendar,
  userSelection,
  courseList,
}) => {
  const handleSubmit = () => {
    // Create a dictionary with course as keys and an object of filled status as values
    const count_true = (event) => {
      let count = 0;
      for (let key in event) {
        if (
          (key === "preferred" ||
            key === "available" ||
            key === "unavailable") &&
          event[key] === true
        ) {
          count = count + 1;
        }
      }
      return count;
    };

    let dict = {};
    userSelection.forEach((event) => {
      if (!dict[event.course]) {
        dict[event.course] = {
          numSelected: count_true(event),
          totalCourses: 1,
        };
      } else {
        dict[event.course].numSelected += count_true(event);
        dict[event.course].totalCourses += 1;
      }
    });

    //validate user's selection to make sure they filled out everything

    let validationFlag = true;
    let courseUnCompleted;
    for (let course in dict) {
      const userSelected = dict[course].numSelected;
      const totalCourses = dict[course].totalCourses;
      if (userSelected !== totalCourses && userSelected > 0) {
        validationFlag = false;
        courseUnCompleted = course;
        break;
      }
    }
    if (validationFlag === true) {
      toast.success("Submitted!"); //TODO: Post request to submit user selections to DB
    } else {
      toast.error(`Please complete filling out ${courseUnCompleted}`);
    }
  };

  return (
    <div className="flex justify-center items-center w-full my-3">
      <div className="w-full flex justify-between items-center flex-col md:flex-row">
        <button
          onClick={handleSubmit}
          className="bg-blue-200 hover:bg-blue-300 p-4 rounded-lg"
        >
          Submit
        </button>
        <div className="flex w-full justify-center md:justify-end flex-wrap md:flex-nowrap">
          {courseList.map((course) => (
            <Tag
              key={course}
              title={course}
              onClick={() => setCalendar(course)}
              selected={calendar === course}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;
