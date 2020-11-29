import React from 'react';
import {useRouter} from 'next/router';
import UserDetails from "../../components/UserDetails";


function renderError(){
    return (
        <div>
            <p>Error: Wrong URL or User Not Found</p>
        </div>
    );
}


function CustomerDetailPage(){
    /*const router: NextRouter = useRouter();
    const {username} = router.query;

    if(username == undefined){
        return renderError();
    }
    if(Array.isArray(username)){
        return renderError();
    }

    return <UserDetails username={username}/>*/

    const router = useRouter();
    if (router.query.username) {
        return (
          <UserDetails username={(router.query.username as unknown) as string}/>
        );
    }

    return renderError()

}



export default CustomerDetailPage;