"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Landing = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <p className="text-3xl font-semibold font-mono">SchedULAr</p>
      {session ? (
        <>
          <Link
            href={"calendar"}
            className="bg-blue-300 rounded-xl p-3 hover:bg-blue-400 text-xl"
          >
            Lab Hours
          </Link>
          <Link
            href={"office-hours"}
            className="bg-blue-300 rounded-xl p-3 hover:bg-blue-400 text-xl"
          >
            Office Hours
          </Link>
          <Link
            href={"admin"}
            className="bg-blue-300 rounded-xl p-3 hover:bg-blue-400 text-xl"
          >
            Admin
          </Link>
          <div className="mt-4">
            <div className="flex flex-col justify-center items-center">
              <p className="text-xl">Hello, {session.user.name}!</p>
              <button
                className="bg-red-300 rounded-xl p-2 hover:bg-red-400 mt-2"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          className="bg-green-300 rounded-xl p-2 hover:bg-green-400"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Landing;
