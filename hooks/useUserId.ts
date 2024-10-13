import { useState, useEffect } from "react";
import { db } from "@/app/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", id);
    }
    setUserId(id);
    createUserInFirebase(id);
  }, []);

  const createUserInFirebase = async (id: string) => {
    try {
      await setDoc(
        doc(db, "users", id),
        {
          createdAt: new Date(),
          "keyvar-maps": {},
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error creating user in Firebase:", error);
    }
  };

  const updateUserKeyVariantMap = async (
    componentKey: string,
    variantCode: string
  ) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [`keyvar-maps.${componentKey}`]: variantCode,
      });
    } catch (error) {
      console.error("Error updating key-variant map:", error);
    }
  };

  return { userId, updateUserKeyVariantMap };
}
