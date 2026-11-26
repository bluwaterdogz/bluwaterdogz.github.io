import { ComponentType, Suspense } from "react";
import { Loader } from "../components/common/loader";

interface LazyMicroappProps {
  component: ComponentType;
}

export const LazyMicroapp = ({ component: Component }: LazyMicroappProps) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);
