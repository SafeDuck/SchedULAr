import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authenticate } from "@/utils/authenticate";

export async function GET(req) {
  if (!(await authenticate("ula"))) {
    return new Response("Unauthenticated", { status: 403 });
  }
  try {
    const session = await getServerSession();
    const user_email = session.user.email;

    const selectedTermRef = doc(db, "settings", "selected_term");
    const selectedTermSnap = await getDoc(selectedTermRef);
    const { selected_term: term } = selectedTermSnap.data();

    const totalHoursRef = doc(db, term, "total_hours");
    const totalHoursSnap = await getDoc(totalHoursRef);
    const totalHours = totalHoursSnap.data();

    if (!totalHours) {
      return Response.json({});
    }

    if (req.nextUrl.searchParams.get("all") === "true") {
      if (!(await authenticate("admin"))) {
        return new Response("Unauthenticated", { status: 403 });
      }
      return Response.json(totalHours);
    }

    return new Response.json(totalHours[user_email]);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}

export async function PUT(req) {
  if (!(await authenticate("ula"))) {
    return new Response("Unauthenticated", { status: 403 });
  }
  try {
    let { hours, sid } = await req.json();
    hours = parseInt(hours);
    if (!hours || !sid || isNaN(hours) || hours < 0 || !/^\d{9}$/.test(sid)) {
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
