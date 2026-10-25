import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import PanelFallback from "./PanelFallback";

export const lazyPage = (loader: () => Promise<{ default: ComponentType }>, fallback: ReactNode = null) => {
  const Page = lazy(loader);
  return (
    <Suspense fallback={fallback}>
      <Page />
    </Suspense>
  );
};

export const lazyPanel = (loader: () => Promise<{ default: ComponentType }>) => lazyPage(loader, <PanelFallback />);
