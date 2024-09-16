import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";
import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signin function called");
      try {
        // Check if the user has an email
        if (!profile?.email) {
          throw new Error("No profile");
        }

        // Get user document reference
        const userRef = doc(db, "users", user.id);
        // Check if user already exists in Firestore
        // const userSnap = await getDoc(userRef);

        // Create a new user document in Firestore
        await setDoc(userRef, {
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date().toISOString(),
          provider: account.provider,
          ula: 0,
          admin: 0,
        });

        return true;
      } catch (error) {
        console.error("Error saving user to Firestore:", error);
        return false; // This will prevent sign-in
      }
    },

    async session({ session, token }) {
      console.log("session function called");

      // Fetch latest user data from Firestore
      const userRef = doc(db, "users", token.sub); // Use `token.sub` for user ID
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        session.user.ula = userData.ula || 0; // Fetch ula from Firestore
        session.user.admin = userData.admin || 0; // Fetch admin from Firestore
        session.user.id = token.sub;
      }

      return session;
    },

    async jwt({ token, user }) {
      console.log("jwt function called");
      if (user) {
        // Fetch user ula and admin fields from Firestore
        const userRef = doc(db, "users", user.id || user.sub);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          token.ula = userData.ula || 0; // Default ula to 0 if not set
          token.admin = userData.admin || 0; // Default admin to 0 if not set
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
