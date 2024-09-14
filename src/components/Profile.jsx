"use client";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();
  console.log(session);

  if (!session) return <>Loading...</>;

  if (session.user.ula === 0) {
    return <>Your ula value is 0</>;
  }

  return <div>ULA {session.user.name}</div>;
};

export default Profile;
