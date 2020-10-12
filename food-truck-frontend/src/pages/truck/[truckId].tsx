import React from 'react'
import {useRouter} from "next/router";
import Truck from "../../components/Truck";
import NotFound from "../../components/NotFound";

function TruckPage() {
  const router = useRouter();
  if (router.query.truckId) {
    let truckId: number = router.query.truckId as unknown as number;
    return (
      <Truck truckId={truckId}/>
    );
  }
  return (
    <NotFound/>
  );
}

export default TruckPage;