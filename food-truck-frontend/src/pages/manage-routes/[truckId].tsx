import React from 'react';
import {NextRouter, useRouter} from "next/router";
import RouteList from "../../components/route/RouteList";

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
        <RouteList truckId={truckId}/>
    )

}

export default ManageRoutes;