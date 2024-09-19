import { db } from "@/utils/firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { authenticate } from "@/utils/authenticate";
function insertColon(str) {
  return str.slice(0, 2) + ":" + str.slice(2);
}

function roundUpToNearestHalfHour(time) {
  const [hour, minute] = time.split(":").map(Number);
  const newMinute = Math.ceil(minute / 30) * 30;
  if (newMinute === 60) {
    return `${(hour + 1) % 24}:00`;
  }
  return `${hour}:${newMinute}`;
}

function intervalLength(beginTime, endTime) {
  const [beginHour, beginMinute] = beginTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  return endHour - beginHour + (endMinute - beginMinute) / 60;
}

export async function POST(req) {
  if (!(await authenticate("admin"))) {
    return new Response("Unauthenticated", { status: 403 });
  }
  try {
    const { term } = await req.json();
    if (!term) {
      throw new Error("No term provided.");
    }

    const courseRef = doc(db, "settings", "courses");
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
            .map((day) => {
              let beginTime = insertColon(meeting.meetingTime.beginTime);
              let endTime = roundUpToNearestHalfHour(
                insertColon(meeting.meetingTime.endTime),
              );
              let location =
                meeting.meetingTime.room === "ONLINE"
                  ? "Online"
                  : `${meeting.meetingTime.building} ${meeting.meetingTime.room}`;

              return {
                id: section.id,
                section: section.sequenceNumber,
                location: location,
                day: day,
                begin_time: beginTime,
                end_time: endTime,
                length: intervalLength(beginTime, endTime),
                instruction_method: section.instructionalMethodDescription,
              };
            }),
        ),
      );

      // ensure that if a section is removed from r'web, it is also removed from the database
      const sectionRef = collection(db, term, "courses", course);
      const sectionSnap = await getDocs(sectionRef);
      const existingSections = sectionSnap.docs.map((doc) => doc.data());
      for (const existingSection of existingSections) {
        const found = sections.find(
          (section) => section.section === existingSection.section,
        );
        if (!found) {
          const sectionRef = doc(
            db,
            term,
            "courses",
            course,
            existingSection.section,
          );
          await deleteDoc(sectionRef);
        }
      }

      // update the database with the new sections
      for (const section of sections) {
        const sectionRef = doc(db, term, "courses", course, section.section);
        await setDoc(sectionRef, section, { merge: true });
      }

      // store list of courses under the term
      const termRef = doc(db, term, "course_list");
      await setDoc(termRef, { courses });

      // store term in /settings/terms list
      const termsRef = doc(db, "settings", "terms");
      setDoc(termsRef, { terms: arrayUnion(term) }, { merge: true });
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
