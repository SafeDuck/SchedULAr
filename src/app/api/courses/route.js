import { db } from "@/utils/firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const term = req.nextUrl.searchParams.get("term");
    const course = req.nextUrl.searchParams.get("course");

    const courseRef = collection(db, "course_data", term, course);
    const courseSnap = await getDocs(courseRef);
    const course_data = courseSnap.docs.map((doc) => doc.data());

    return Response.json(course_data);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
