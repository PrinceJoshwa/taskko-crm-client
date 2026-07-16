import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ProjectCtx = createContext(null);

export function ProjectProvider({ children }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(() => localStorage.getItem("tasko.activeProject") || "");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || user === false) return;
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      
      // Fallback to an empty array if data isn't one
      const safeData = Array.isArray(data) ? data : []; 
      setProjects(safeData);
      
      // Use the safeData variable for the find method
      if (!safeData.find((p) => p.id === activeId)) {
        const first = safeData[0]?.id || "";
        setActiveId(first);
        localStorage.setItem("tasko.activeProject", first);
      }
    } finally {
      setLoading(false);
    }
  }, [user, activeId]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setActive = (id) => {
    setActiveId(id);
    localStorage.setItem("tasko.activeProject", id || "");
  };

  const active = projects.find((p) => p.id === activeId) || null;

  return (
    <ProjectCtx.Provider value={{ projects, active, activeId, setActive, refresh, loading }}>
      {children}
    </ProjectCtx.Provider>
  );
}

export const useProjects = () => useContext(ProjectCtx);
