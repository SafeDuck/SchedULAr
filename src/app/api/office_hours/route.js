import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    const summary = req.nextUrl.searchParams.get("summary");
    const termRef = doc(db, "settings", "selected_term");
    const termSnap = await getDoc(termRef);
    const { selected_term: term } = termSnap.data();

    const officeHoursRef = doc(db, term, "office_hours");
    const officeHoursSnap = await getDoc(officeHoursRef);
    const officeHours = officeHoursSnap.data();
    if (!officeHours) {
      return Response.json({});
    }

    if (summary === "true") {
      const summary = {};
      for (const course in officeHours) {
        for (const user in officeHours[course]) {
          summary[course] = summary[course] || 0;
          summary[course] += officeHours[course][user];
        }
      }

      return Response.json(summary);
    } else {
      const session = await getServerSession();
      const user_email = session.user.email;

      const userOfficeHours = {};
      for (const course in officeHours) {
        userOfficeHours[course] = officeHours[course][user_email] || 0;
      }

      return Response.json(userOfficeHours);
    }
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    let { course, hours } = await req.json();
    hours = parseInt(hours);

    if (!course || !hours || isNaN(hours) || hours < 0) {
      return new Response("Bad request", {
        status: 400,
      });
    }

    const session = await getServerSession();
    const user_email = session.user.email;

    const termRef = doc(db, "settings", "selected_term");
    const termSnap = await getDoc(termRef);
    const { selected_term: term } = termSnap.data();

    const officeHoursRef = doc(db, term, "office_hours");
    setDoc(
      officeHoursRef,
      { [course]: { [user_email]: hours } },
      { merge: true },
    );

    return new Response("Success");
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
