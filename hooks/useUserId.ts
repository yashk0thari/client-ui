import { useState, useEffect } from "react";
import { db } from "@/app/firebase";
import { doc, setDoc } from "firebase/firestore";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", id);
      console.log("New user ID generated:", id);
    } else {
      console.log("Existing user ID retrieved:", id);
    }
    setUserId(id);
    sendUserIdToFirebase(id);
  }, []);

  const sendUserIdToFirebase = async (id: string) => {
    try {
      await setDoc(
        doc(db, "users", id),
        {
          createdAt: new Date(),
          // Add any other initial user data you want to store
        },
        { merge: true }
      );
      console.log("User ID sent to Firebase");
    } catch (error) {
      console.error("Error sending user ID to Firebase:", error);
    }
  };

  return userId;
}
