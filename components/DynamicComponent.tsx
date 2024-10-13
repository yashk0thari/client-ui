"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUserId } from "@/hooks/useUserId";
import { LiveProvider, LiveError, LivePreview } from "react-live-runner";
import * as shadcn from "@/components/ui/index";
import { db } from "@/app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const fetchComponentData = async () => {
      if (!userId) return;

      try {
        // First, ensure the user document exists
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { createdAt: new Date() }, { merge: true });

        const componentDocRef = doc(userDocRef, "keyvar-maps", componentKey);
        const docSnap = await getDoc(componentDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCode(data.code || "");
        } else {
          // If no data exists, fetch from the default location
          const defaultDocRef = doc(
            db,
            "developer",
            "zjLHwJHVUHxNsyxFK0tX",
            "keys",
            componentKey
          );
          const defaultDocSnap = await getDoc(defaultDocRef);

          if (defaultDocSnap.exists()) {
            const data = defaultDocSnap.data();
            const variants = data.variants || [];
            if (variants.length > 0) {
              const randomIndex = Math.floor(Math.random() * variants.length);
              const selectedCode = variants[randomIndex];
              setCode(selectedCode);
              await setUserComponentData(selectedCode);
            } else {
              console.warn("No variants found in the default document");
            }
          } else {
            console.warn(
              `No default document found for componentKey: ${componentKey}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };

    fetchComponentData();
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
