import { FC } from "react";
import { Router, useRouter, useLocation } from "wouter";

type NestedRoutesProps = {
  base: string;
};

const NestedRoutes: FC<NestedRoutesProps> = ({ base, children }) => {
  const router = useRouter();
  const [parentLocation] = useLocation();

  const nestedBase = `${router.base}${base}`;

  // don't render anything outside of the scope
  if (!parentLocation.startsWith(nestedBase)) return null;

  // we need key to make sure the router will remount when base changed
  return (
    <Router base={nestedBase} key={nestedBase}>
      {children}
    </Router>
  );
};

export default NestedRoutes;
