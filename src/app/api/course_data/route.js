import { db } from "@/utils/firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
