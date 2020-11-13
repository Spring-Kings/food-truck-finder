import logout from "../util/logout";
import { Typography } from "@material-ui/core";

import React from 'react';
import Link from 'next/link'

require('dotenv').config();

function HomePage() {
    return (
        <>
            <Typography variant="h4">Food Truck Finder</Typography>
            <Link href="/login" passHref><a>Login</a></Link><br/>
            <Link href="#" passHref><a onClick={logout}>Log Out</a></Link><br/>
            
            <br/>

            <Typography variant="h5">Guest Zone</Typography>
            <Link href="/recommended-trucks" passHref><a>Truck Recommendation Search</a></Link><br/>
            <Link href="/search/truck" passHref><a>Truck Search</a></Link><br/>
            <Link href="/interactive-map" passHref><a>Trucks Nearby</a></Link><br/>
            
            <br />

            <Typography variant="h5">User Zone</Typography>
            <Link href="/dashboard/user" passHref><a>User Dashboard</a></Link><br/>
            <Link href="/account" passHref><a>Account</a></Link><br/>
            <Link href="/reviews" passHref><a>Reviews</a></Link><br/>
            <Link href="/notifications" passHref><a>Notifications Page</a></Link><br/>

            <br />

            <Typography variant="h5">Truck Owner Zone</Typography>
            <Link href="/dashboard/owner" passHref><a>Owner Dashboard</a></Link><br/>
            <Link href="/manage-trucks" passHref><a>Manage Trucks</a></Link><br/>
            <Link href="/create-truck" passHref><a>Create Truck Page</a></Link><br/><br/>
        </>
    )
}

/*<Link href={`/truck/${}`}*/

export default HomePage