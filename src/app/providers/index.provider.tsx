import { PrefetchData } from "./PrefetchData.provider";
import QueryProvider from "./Query.provider";

export default async function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <PrefetchData>{children}</PrefetchData>
    </QueryProvider>
  );
}
