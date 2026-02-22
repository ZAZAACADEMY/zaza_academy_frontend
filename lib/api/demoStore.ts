// Simple in-memory/local-storage store for demo purposes when backend is offline
import { ChildProfile } from "./types";

const STORAGE_KEY = "zaza_demo_children";

const getStoredChildren = (): ChildProfile[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to read from localStorage", e);
  }
  // Default demo data
  return [{ id: "1", first_name: "Demo Child", age: 10, avatar: "2" }];
};

const setStoredChildren = (children: ChildProfile[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
  } catch (e) {
    console.warn("Failed to write to localStorage", e);
  }
};

export const demoStore = {
  getChildren: async (): Promise<ChildProfile[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredChildren();
  },

  addChild: async (child: Omit<ChildProfile, "id">): Promise<ChildProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const children = getStoredChildren();
    const newChild = { ...child, id: Date.now().toString() };
    setStoredChildren([...children, newChild]);
    return newChild;
  },

  updateChild: async (
    id: string,
    updates: Partial<ChildProfile>,
  ): Promise<ChildProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const children = getStoredChildren();
    const index = children.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Child not found");

    const updatedChild = { ...children[index], ...updates };
    children[index] = updatedChild;
    setStoredChildren(children);
    return updatedChild;
  },

  deleteChild: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const children = getStoredChildren();
    setStoredChildren(children.filter((c) => c.id !== id));
  },
};
