import React from 'react';
import {NextRouter, useRouter} from 'next/router';
import UserDetails from "../../components/UserDetails";


function renderError(){
    return (
        <div>
            <p>Error: Wrong URL or User Not Found</p>
        </div>
    );
}


function CustomerDetailPage(){
    const router: NextRouter = useRouter();
    const {username} = router.query;

    if(username == undefined){
        return renderError();
    }
    if(Array.isArray(username)){
        return renderError();
    }

    return (
        <div>
            <UserDetails username={username}/>
        </div>
    );

}



export default CustomerDetailPage;