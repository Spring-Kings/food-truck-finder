import React from 'react';
import {NextRouter, useRouter} from "next/router";
import RouteList from "../../components/route/RouteList";
import CoolLayout from "../../components/CoolLayout";

function ManageRoutes(){
    const router: NextRouter = useRouter();
    const {truckId}= router.query;

    if(truckId == undefined || Array.isArray(truckId)){
        //TODO
        return(
            <div>

            </div>
        )
    }

    return(
        <CoolLayout>
            <RouteList truckId={truckId}/>
        </CoolLayout>
    )

}

export default ManageRoutes;