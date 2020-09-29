"use strict";
import React from 'react'
import Form from "../components/Form";

function RegisterPage() {
    return (
        <Form elementNames={["Username", "Password", "Email"]}
              submitUrl={`${process.env.FOOD_TRUCK_API_URL}/user`}/>
    )
}

export default RegisterPage;