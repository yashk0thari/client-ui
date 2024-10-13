"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUserId } from "@/hooks/useUserId";
import { LiveProvider, LiveError, LivePreview } from "react-live-runner";
import * as shadcn from "@/components/ui/index";
import { db } from "@/app/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

interface DynamicComponentProps {
  componentKey: string;
}

const scope = {
  React,
  ReactDOM: React,
  shadcn,
  useState,
  useEffect,
  useRef,
  useCallback,
};

const DynamicComponent: React.FC<DynamicComponentProps> = ({
  componentKey,
}) => {
  const [code, setCode] = useState<string>("");
  const [styles, setStyles] = useState<React.ReactNode | null>(null);
  const userId = useUserId();
  const [userKeyVariantMaps, setUserKeyVariantMaps] = useState<
    Record<string, string>
  >({});

  const setUserComponentData = useCallback(
    async (codeVariant: string) => {
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId);
        const componentDocRef = doc(userDocRef, "keyvar-maps", componentKey);

        await setDoc(
          componentDocRef,
          {
            code: codeVariant,
            createdAt: new Date(),
          },
          { merge: true }
        );

        console.log(`Data set for user ${userId}, component ${componentKey}`);

        // Update local state
        setUserKeyVariantMaps((prev) => ({
          ...prev,
          [componentKey]: codeVariant,
        }));
      } catch (error) {
        console.error("Error setting user component data:", error);
      }
    },
    [userId, componentKey]
  );

  useEffect(() => {
    setStyles(
      <style>{`
        @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
        :root {
          --background: 0 0% 100%;
          --foreground: 240 10% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 240 10% 3.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 240 10% 3.9%;
          --primary: 240 5.9% 10%;
          --primary-foreground: 0 0% 98%;
          --secondary: 240 4.8% 95.9%;
          --secondary-foreground: 240 5.9% 10%;
          --muted: 240 4.8% 95.9%;
          --muted-foreground: 240 3.8% 46.1%;
          --accent: 240 4.8% 95.9%;
          --accent-foreground: 240 5.9% 10%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 5.9% 90%;
          --input: 240 5.9% 90%;
          --ring: 240 10% 3.9%;
          --radius: 0.5rem;
        }
        .dark {
          --background: 240 10% 3.9%;
          --foreground: 0 0% 98%;
          --card: 240 10% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 240 5.9% 10%;
          --secondary: 240 3.7% 15.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 3.7% 15.9%;
          --muted-foreground: 240 5% 64.9%;
          --accent: 240 3.7% 15.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 3.7% 15.9%;
          --input: 240 3.7% 15.9%;
          --ring: 240 4.9% 83.9%;
        }
      `}</style>
    );
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // User doesn't exist, create new user and assign random variants
          await setDoc(userDocRef, { createdAt: new Date() });
          await assignRandomVariants(userDocRef);
        }

        // Fetch all keyvar-maps for the user
        const keyvarMapsRef = collection(userDocRef, "keyvar-maps");
        const keyvarMapsSnapshot = await getDocs(keyvarMapsRef);

        const maps: Record<string, string> = {};
        keyvarMapsSnapshot.forEach((doc) => {
          maps[doc.id] = doc.data().code;
        });

        setUserKeyVariantMaps(maps);

        // Set the code for the current component
        if (maps[componentKey]) {
          setCode(maps[componentKey]);
        } else {
          // If this component doesn't have a variant yet, assign one
          const newVariant = await fetchAndAssignRandomVariant(componentKey);
          setCode(newVariant);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const assignRandomVariants = async (userDocRef: any) => {
      const defaultDocRef = doc(db, "developer", "zjLHwJHVUHxNsyxFK0tX");
      const defaultDocSnap = await getDoc(defaultDocRef);

      if (defaultDocSnap.exists()) {
        const data = defaultDocSnap.data();
        const keys = Object.keys(data);

        for (const key of keys) {
          await fetchAndAssignRandomVariant(key);
        }
      }
    };

    const fetchAndAssignRandomVariant = async (key: string) => {
      const defaultDocRef = doc(
        db,
        "developer",
        "zjLHwJHVUHxNsyxFK0tX",
        "keys",
        key
      );
      const defaultDocSnap = await getDoc(defaultDocRef);

      if (defaultDocSnap.exists()) {
        const data = defaultDocSnap.data();
        const variants = data.variants || [];
        if (variants.length > 0) {
          const randomIndex = Math.floor(Math.random() * variants.length);
          const selectedCode = variants[randomIndex];
          await setUserComponentData(selectedCode);
          return selectedCode;
        }
      }
      return "";
    };

    fetchUserData();
  }, [userId, componentKey, setUserComponentData]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setUserComponentData(newCode);
  };

  console.log("Rendering component with code length:", code.length);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <LiveProvider code={code} scope={{ ...scope, styles }}>
        {styles}
        <LivePreview />
        <LiveError />
      </LiveProvider>
    </div>
  );
};

export default DynamicComponent;
