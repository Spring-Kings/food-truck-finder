import React from 'react'
import {useRouter} from "next/router";
import TruckView from "../../components/TruckView";
import NotFound from "../../components/NotFound";
import CoolLayout from "../../components/CoolLayout";
import RouterSelectableComponent from '../../components/util/RouterSelectableComponent';

function TruckPage() {
  const router = useRouter();
  if (router.query.truckId) {
    let truckId: number = router.query.truckId as unknown as number;
    return (
      <CoolLayout>
        <TruckView truckId={truckId}/>
      </CoolLayout>
    );
  }
  return (
    <CoolLayout>
      <NotFound/>
    </CoolLayout>
  );
}

export default RouterSelectableComponent<number>((truckId: number) => (<TruckView truckId={truckId}/>), "truckId");