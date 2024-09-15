import { db } from "@/utils/firebase.js";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const termRef = doc(db, "settings", "selected_term");
    const termSnap = await getDoc(termRef);
    const { selected_term: term } = termSnap.data();

    const courseRef = doc(db, term, "course_list");
    const courseSnap = await getDoc(courseRef);
    const course_data = courseSnap.data();

    return Response.json(course_data);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
