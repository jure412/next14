"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./Session.provider";

const queryClient = new QueryClient();

export default function Provider({
  sessionData,
  children,
}: Readonly<{
  sessionData: any;
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider value={sessionData}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
