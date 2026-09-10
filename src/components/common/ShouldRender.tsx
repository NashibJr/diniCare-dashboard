import { PropsWithChildren } from "react";

type ShouldRenderTypes = PropsWithChildren & {
  shouldRender: boolean;
};

const ShouldRender: React.FC<ShouldRenderTypes> = ({
  shouldRender,
  children,
}) => {
  return <>{shouldRender ? <>{children}</> : null}</>;
};

export default ShouldRender;
