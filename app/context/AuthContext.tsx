import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("student").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  const login = async (student: any) => {
    setUser(student);
    await AsyncStorage.setItem("student", JSON.stringify(student));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("student");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
