import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const authenticate = async (role) => {
  const session = await getServerSession(authOptions);
  if (role === "ula") {
    if (
      !session?.user ||
      (session.user.ula === 0 && session.user.admin === 0)
    ) {
      return false;
    }
  } else if (role === "admin") {
    if (!session?.user || session.user.admin === 0) {
      return false;
    }
  }

  return true;
};
