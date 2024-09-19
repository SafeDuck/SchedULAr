import { db } from "@/utils/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { authenticate } from "@/utils/authenticate";
export async function GET() {
  if (!(await authenticate("admin"))) {
    return new Response("Unauthenticated");
  }
  try {
    const savedTermsRef = doc(db, "settings", "terms");
    const savedTermsSnap = await getDoc(savedTermsRef);
    const savedTerms = savedTermsSnap.data().terms;

    return Response.json(savedTerms);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
