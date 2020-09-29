import React from 'react'
import Form from "../components/Form";

function LoginPage(){
    return(
        <div>
            <Form elementNames={["Username", "Password"]}
                  submitUrl={`${process.env.FOOD_TRUCK_API_URL}/login`}/>
        </div>
    )
}

export default LoginPage;