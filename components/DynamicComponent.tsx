"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUserId } from "@/hooks/useUserId";
import { LiveProvider, LiveError, LivePreview } from "react-live-runner";
import * as shadcn from "@/components/ui/index";
import { db } from "@/app/firebase"; // Import the Firestore instance
import { doc, getDoc } from "firebase/firestore";

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

// ... existing scope definition ...

const DynamicComponent: React.FC<DynamicComponentProps> = ({
  componentKey,
}) => {
  const { userId, updateUserKeyVariantMap } = useUserId();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const fetchCode = async () => {
      console.log(`Fetching code for componentKey: ${componentKey}`);

      try {
        const docRef = doc(
          db,
          "developer",
          "zjLHwJHVUHxNsyxFK0tX",
          "keys",
          componentKey
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(`Document found for ${componentKey}`);
          const data = docSnap.data();
          console.log("Document data:", data);

          const variants = data.variants || [];
          console.log(`Number of variants: ${variants.length}`);

          if (variants.length > 0) {
            const randomIndex = Math.floor(Math.random() * variants.length);
            const selectedCode = variants[randomIndex];
            console.log(
              "Selected code (first 100 characters):",
              selectedCode.substring(0, 100)
            );
            setCode(selectedCode);

            // Update the user's key-variant map in Firebase with the full code
            if (userId) {
              updateUserKeyVariantMap(componentKey, selectedCode);
            }
          } else {
            console.warn("No variants found in the document");
          }
        } else {
          console.warn(`No document found for componentKey: ${componentKey}`);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchCode();
  }, [componentKey, userId, updateUserKeyVariantMap]);

  console.log("Rendering component with code length:", code.length);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <LiveProvider code={code} scope={{ ...scope }}>
        <LivePreview />
        <LiveError />
      </LiveProvider>
    </div>
  );
};

export default DynamicComponent;
