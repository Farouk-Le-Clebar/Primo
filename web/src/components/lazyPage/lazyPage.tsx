import { lazy, Suspense, type ComponentType } from "react";

export const lazyPage = (loader: () => Promise<{ default: ComponentType }>) => {
  const Page = lazy(loader);
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
};
