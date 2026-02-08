import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { ChildProfile } from "./types";
import { demoStore } from "./demoStore";

export interface CreateChildData {
  name: string;
  age: number;
  avatar?: string;
}

export interface UpdateChildData {
  name?: string;
  age?: number;
  avatar?: string;
}

export const childrenService = {
  // Get all children for current parent
  getAll: async (): Promise<ChildProfile[]> => {
    try {
      return await apiClient.get<ChildProfile[]>(ENDPOINTS.USERS.CHILDREN);
    } catch (error) {
      console.warn("API unavailable, using demo store");
      return demoStore.getChildren();
    }
  },

  // Create a new child
  create: async (data: CreateChildData): Promise<ChildProfile> => {
    try {
      return await apiClient.post<ChildProfile>(ENDPOINTS.USERS.CHILDREN, data);
    } catch (error) {
      console.warn("API unavailable, using demo store");
      return demoStore.addChild(data);
    }
  },

  // Update a child
  update: async (id: string, data: UpdateChildData): Promise<ChildProfile> => {
    try {
      return await apiClient.patch<ChildProfile>(
        `${ENDPOINTS.USERS.CHILDREN}${id}/`,
        data,
      );
    } catch (error) {
      console.warn("API unavailable, using demo store");
      return demoStore.updateChild(id, data);
    }
  },

  // Delete a child
  delete: async (id: string): Promise<void> => {
    try {
      return await apiClient.delete(`${ENDPOINTS.USERS.CHILDREN}${id}/`);
    } catch (error) {
      console.warn("API unavailable, using demo store");
      return demoStore.deleteChild(id);
    }
  },
};
