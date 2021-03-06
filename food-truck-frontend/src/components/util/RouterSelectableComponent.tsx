import React from "react";
import {useRouter} from "next/router";

import NotFound from "../NotFound";

function RouterSelectableComponent<T>(
  createComponent: (routerValue: T) => any,
  routerAttribute: string
) {
  return () => {
    const router = useRouter();
    let result: any = router.query[routerAttribute];

    // If the router has the requested attribute, use the provided factory method to pass it to the new component
    // Otherwise, just store a NotFound component
    if (result) result = createComponent((result as unknown) as T);
    else result = <NotFound />;

    return <>{result}</>;
  };
}

export default RouterSelectableComponent;
