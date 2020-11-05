import React from "react";
import { useRouter } from "next/router";
import RouteMapComponent from "../../../components/map/route-map/RouteMap";
import NotFound from "../../../components/NotFound";

function RoutesPage() {
  const router = useRouter();
  if (router.query.routeId) {
    return (
      <RouteMapComponent
        routeId={(router.query.routeId as unknown) as number}
      />
    );
  }
  return <NotFound />;
}

export default RoutesPage;
