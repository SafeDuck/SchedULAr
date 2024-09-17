import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";

export async function PUT(req) {
  try {
    const { hours, sid } = await req.json();
    if (!hours || !sid || isNaN(hours) || !/^\d{9}$/.test(sid)) {
      return new Response("Bad request", {
        status: 400,
      });
    }

    const session = await getServerSession();
    const user_email = session.user.email;

    const selectedTermRef = doc(db, "settings", "selected_term");
    const selectedTermSnap = await getDoc(selectedTermRef);
    const { selected_term: term } = selectedTermSnap.data();

    const totalHoursRef = doc(db, term, "total_hours");
    setDoc(
      totalHoursRef,
      {
        [user_email]: {
          hours,
          sid,
        },
      },
      { merge: true },
    );

    return new Response("Success");
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
