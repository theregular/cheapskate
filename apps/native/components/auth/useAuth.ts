import { useCallback, useEffect, useState } from "react";
import { deleteToken, getToken, saveToken } from "~/lib/authToken";

type User = {
  sub: string;
  role?: string;
  [key: string]: any;
};

function parseJwt(token: string): User | null {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Invalid JWT", err);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = await getToken();
    if (token) {
      const parsedUser = parseJwt(token);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (token: string) => {
    await saveToken(token);
    const parsedUser = parseJwt(token);
    setUser(parsedUser);
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    reload: loadSession,
  };
}
