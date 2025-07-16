"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function useUserId() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let id = sessionStorage.getItem("userId");
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  return userId;
}