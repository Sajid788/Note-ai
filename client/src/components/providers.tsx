"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/redux/store";
import { loadUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInit>{children}</AuthInit>
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </Provider>
  );
}
