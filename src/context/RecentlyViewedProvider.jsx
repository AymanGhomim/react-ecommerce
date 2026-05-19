import { useState } from "react";
import { RecentlyViewedContext } from "./RecentlyViewedContext";

const MAX = 8;

export default function RecentlyViewedProvider({ children }) {
  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("recentlyViewed") || "[]"); }
    catch { return []; }
  });

  const addViewed = (product) => {
    setViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const next = [product, ...filtered].slice(0, MAX);
      localStorage.setItem("recentlyViewed", JSON.stringify(next));
      return next;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewed, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}
