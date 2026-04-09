import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "student" | "tutor" | null;

interface UserState {
  isLoggedIn: boolean;
  userRole: UserRole;
  selectedRole: UserRole;
  username: string;
  email: string;
  userId: string;
  enrolledCourses: string[];
}

interface UserContextType extends UserState {
  setSelectedRole: (role: UserRole) => void;
  login: (data: { username: string; email: string; role: UserRole; userId: string }) => void;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>({
    isLoggedIn: false,
    userRole: null,
    selectedRole: null,
    username: "",
    email: "",
    userId: "",
    enrolledCourses: [],
  });

  const setSelectedRole = useCallback((role: UserRole) => {
    setState(s => ({ ...s, selectedRole: role }));
  }, []);

  const login = useCallback((data: { username: string; email: string; role: UserRole; userId: string }) => {
    setState(s => ({
      ...s,
      isLoggedIn: true,
      userRole: data.role,
      username: data.username,
      email: data.email,
      userId: data.userId,
    }));
  }, []);

  const logout = useCallback(() => {
    setState({
      isLoggedIn: false,
      userRole: null,
      selectedRole: null,
      username: "",
      email: "",
      userId: "",
      enrolledCourses: [],
    });
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    setState(s => ({
      ...s,
      enrolledCourses: s.enrolledCourses.includes(courseId) ? s.enrolledCourses : [...s.enrolledCourses, courseId],
    }));
  }, []);

  return (
    <UserContext.Provider value={{ ...state, setSelectedRole, login, logout, enrollCourse }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
