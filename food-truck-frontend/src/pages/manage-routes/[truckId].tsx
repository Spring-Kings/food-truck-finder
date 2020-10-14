import React from 'react';
import {NextRouter, useRouter} from "next/router";

function ManageRoutes(){
    const router: NextRouter = useRouter();
    const truckId: number = router.query.truckId as unknown as number;

    return(
        <div>

        </div>
    )

}

export default ManageRoutes;