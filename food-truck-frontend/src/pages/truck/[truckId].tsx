import React from 'react'
import {useRouter} from "next/router";
import TruckView from "../../components/TruckView";
import NotFound from "../../components/NotFound";

function TruckPage() {
  const router = useRouter();
  if (router.query.truckId) {
    let truckId: number = router.query.truckId as unknown as number;
    return (
      <TruckView truckId={truckId}/>
    );
  }
  return (
    <NotFound/>
  );
}

export default TruckPage;