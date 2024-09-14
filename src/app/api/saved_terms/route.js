import { db } from "@/utils/firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const savedTermsRef = collection(db, "course_data");
    const savedTermsSnap = await getDocs(savedTermsRef);
    const savedTerms = savedTermsSnap.docs.map((doc) => doc.id);

    return Response.json(savedTerms);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
