"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Landing = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <p className="text-3xl font-semibold font-mono">UCR-ULA-Scheduler</p>
      {session ? (
        <>
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
          className="bg-green-300 rounded-xl text-lg p-2 hover:bg-green-400"
          onClick={() => signIn("google")}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Landing;
