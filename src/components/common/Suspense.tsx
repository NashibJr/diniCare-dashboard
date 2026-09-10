import { PropsWithChildren } from "react";
import { Spinner } from "../ui/spinner";

type SuspenseTypes = PropsWithChildren & {
  isLoading: boolean;
};

const Suspense: React.FC<SuspenseTypes> = ({ isLoading, children }) => {
  return (
    <>{isLoading ? <Spinner className="mx-auto my-10" /> : <>{children}</>}</>
  );
};

export default Suspense;
