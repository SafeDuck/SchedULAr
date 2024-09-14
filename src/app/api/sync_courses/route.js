import { db } from "@/utils/firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

function insertColon(str) {
  return str.slice(0, 2) + ":" + str.slice(2);
}

export async function POST(req) {
  try {
    const { term } = await req.json();
    if (!term) {
      throw new Error("No term provided.");
    }

    const courseRef = doc(db, "defaults", "courses");
    const courseSnap = await getDoc(courseRef);
    const courses = courseSnap.data().courses;

    for (const course of courses) {
      const session_res = await fetch(
        "https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/term/search?mode=search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `term=${term}`,
        },
      );
      if (!session_res.ok) {
        throw new Error("Failed to get session.");
      }

      const cookies = session_res.headers.get("set-cookie");

      const res = await fetch(
        `https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_subjectcoursecombo=${course}&txt_term=${term}&pageOffset=0&pageMaxSize=500&sortColumn=sequenceNumber&sortDirection=asc`,
        {
          headers: {
            Cookie: cookies,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();

      const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ];
      const sections = data.data.flatMap((section) =>
        section.meetingsFaculty.flatMap((meeting) =>
          daysOfWeek
            .filter(
              (day) =>
                meeting.meetingTime.meetingType === "LAB" &&
                meeting.meetingTime[day],
            )
            .map((day) => ({
              section: section.sequenceNumber,
              day,
              begin_time: insertColon(meeting.meetingTime.beginTime),
              end_time: insertColon(meeting.meetingTime.endTime),
              instruction_method: section.instructionalMethodDescription,
            })),
        ),
      );

      // ensure that the term exists in the database 
      // (implictly created documnts can't be queried)
      const termRef = doc(db, "course_data", term);
      setDoc(termRef, {}, { merge: true });

      // ensure that if a section is removed from r'web, it is also removed from the database
      const sectionRef = collection(db, "course_data", term, course);
      const sectionSnap = await getDocs(sectionRef);
      const existingSections = sectionSnap.docs.map((doc) => doc.data());
      for (const existingSection of existingSections) {
        const found = sections.find(
          (section) => section.section === existingSection.section,
        );
        if (!found) {
          const sectionRef = doc(
            db,
            "course_data",
            term,
            course,
            existingSection.section,
          );
          await deleteDoc(sectionRef);
        }
      }

      // update the database with the new sections
      for (const section of sections) {
        const sectionRef = doc(
          db,
          "course_data",
          term,
          course,
          section.section,
        );
        await setDoc(sectionRef, section, { merge: true });
      }
    }

    return new Response("Success", {
      status: 200,
    });
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
