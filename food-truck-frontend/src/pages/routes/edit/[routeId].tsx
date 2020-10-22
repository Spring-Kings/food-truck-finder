import React from "react";
import { useRouter } from "next/router";
import RouteMapComponent from "../../../components/map/route-map/RouteMap";
import NotFound from "../../../components/NotFound";
import CoolLayout from "../../../components/CoolLayout";

function RoutesPage() {
  const router = useRouter();
  if (router.query.routeId) {
    return (
      <CoolLayout>
        <RouteMapComponent
          routeId={(router.query.routeId as unknown) as number}
        />
      </CoolLayout>
    );
  }
  return <NotFound />;
}

export default RoutesPage;
