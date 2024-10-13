import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  return userId;
}
