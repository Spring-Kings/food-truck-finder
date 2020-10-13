import React from 'react';
import {NextRouter, useRouter} from 'next/router';
import ReviewsList from "../../components/ReviewsList";

function CustomerDetailPage(){
    const router: NextRouter = useRouter();
    const {username} = router.query;

    return (
        <div>
            <h1>{username}</h1>
            <ReviewsList username={username}/>
        </div>
    );

}



export default CustomerDetailPage;