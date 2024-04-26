import { PrefetchData } from "./PrefetchData.provider";
import QueryProvider from "./Query.provider";
import { Redirect } from "./Redirect.provider";

export default async function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <PrefetchData>
        <Redirect>{children}</Redirect>
      </PrefetchData>
    </QueryProvider>
  );
}
