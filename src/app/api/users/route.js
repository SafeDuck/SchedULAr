import { NextResponse } from "next/server";
import { db } from "@/utils/firebase.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const userDataExtractor = (data) => ({
  name: data.name,
  email: data.email,
  image: data.image,
  ula: data.ula,
  admin: data.admin,
});

export async function GET(req) {
  try {
    const users = req.nextUrl.searchParams.get("users");
    if (users) {
      const userRefs = users.split(",").map((user) => doc(db, "users", user));
      const userDocs = await Promise.all(userRefs.map(getDoc));
      const userData = userDocs
        .filter((doc) => doc.exists())
        .map((doc) => doc.data())
        .map(userDataExtractor);
      return Response.json(userData);
    } else {
      const userRef = collection(db, "users");
      const userDoc = await getDocs(userRef);
      const userData = userDoc.docs
        .map((doc) => doc.data())
        .map(userDataExtractor);

      return Response.json(userData);
    }
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}

export async function POST(req) {
  const res = NextResponse;
  const { email, ula, admin } = await req.json();

  try {
    const userRef = doc(db, "users", email);
    await setDoc(userRef, {
      email: email,
      ula: ula,
      admin: admin,
    });
    return res.json({ message: "OK" });
  } catch (e) {
    return res.json(
      { message: e.message },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req) {
  const res = NextResponse;
  const { email } = await req.json();

  try {
    const userRef = doc(db, "users", email);
    await deleteDoc(userRef);

    return res.json({ message: "OK" });
  } catch (e) {
    return res.json(
      { message: e.message },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req) {
  const res = NextResponse;
  const { email, ula, admin } = await req.json();

  try {
    const userRef = doc(db, "users", email);
    await setDoc(
      userRef,
      {
        email: email,
        ula: ula,
        admin: admin,
      },
      { merge: true },
    );

    return res.json({ message: "OK" });
  } catch (e) {
    return res.json(
      { message: e.message },
      {
        status: 500,
      },
    );
  }
}
