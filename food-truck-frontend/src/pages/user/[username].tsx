import React from 'react';
import {NextRouter, useRouter} from 'next/router';
import LoginPageComponent from "../login";

function CustomerDetailPage(){
    const router: NextRouter = useRouter();
    const {username} = router.query;

    return (
        <div>
            <h1>hello {username}.</h1>
            <LoginPageComponent/>
        </div>
    );

}



export default CustomerDetailPage;