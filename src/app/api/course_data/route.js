import { db } from "@/utils/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    const course = req.nextUrl.searchParams.get("course");

    const termRef = doc(db, "settings", "selected_term");
    const termSnap = await getDoc(termRef);
    const { selected_term: term } = termSnap.data();

    const courseRef = collection(db, term, "courses", course);
    const courseSnap = await getDocs(courseRef);
    const course_data = courseSnap.docs.map((doc) => doc.data());

    return Response.json(course_data);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const course_data = await req.json();

    const session = await getServerSession(authOptions);
    const user_id = session.user.id;

    const termRef = doc(db, "settings", "selected_term");
    const termSnap = await getDoc(termRef);
    const { selected_term: term } = termSnap.data();

    for (const course of Object.keys(course_data)) {
      const courseRef = collection(db, term, "courses", course);

      for (const section of course_data[course]) {
        const sectionRef = doc(courseRef, section.section);

        if (section.preferred) {
          await updateDoc(sectionRef, {
            preferred: arrayUnion(user_id),
            available: arrayRemove(user_id),
            unavailable: arrayRemove(user_id),
          });
        } else if (section.available) {
          await updateDoc(sectionRef, {
            preferred: arrayRemove(user_id),
            available: arrayUnion(user_id),
            unavailable: arrayRemove(user_id),
          });
        } else if (section.unavailable) {
          await updateDoc(sectionRef, {
            preferred: arrayRemove(user_id),
            available: arrayRemove(user_id),
            unavailable: arrayUnion(user_id),
          });
        } else {
          await updateDoc(sectionRef, {
            preferred: arrayRemove(user_id),
            available: arrayRemove(user_id),
            unavailable: arrayRemove(user_id),
          });
        }
      }
    }

    return new Response("Success");
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
