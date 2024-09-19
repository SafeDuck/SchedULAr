import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authenticate } from "@/utils/authenticate";
export async function PUT(req) {
  if (!(await authenticate("ula"))) {
    return new Response("Unauthenticated");
  }
  try {
    let { hours, sid } = await req.json();
    hours = parseInt(hours);
    if (!sid || isNaN(hours) || hours < 0 || !/^\d{9}$/.test(sid)) {
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
          hours: Number(hours),
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
