import { Typography } from "@material-ui/core";
import React from 'react';
import NextLink from 'next/link'

require('dotenv').config();

function HomePage() {
    return (
        <>
            <Typography variant="h4">Food Truck Finder</Typography>
            <NextLink href="/login" passHref><a>Login</a></NextLink><br/>

            <br/>

            <Typography variant="h5">Guest Zone</Typography>
            <NextLink href="/recommended-trucks" passHref><a>Truck Recommendation Search</a></NextLink><br/>
            <NextLink href="/search/truck" passHref><a>Truck Search</a></NextLink><br/>
            <NextLink href="/interactive-map" passHref><a>Trucks Nearby</a></NextLink><br/>
            
            <br />

            <Typography variant="h5">User Zone</Typography>
            <NextLink href="/dashboard/user" passHref><a>User Dashboard</a></NextLink><br/>
            <NextLink href="/account" passHref><a>Account</a></NextLink><br/>
            <NextLink href="/reviews" passHref><a>Reviews</a></NextLink><br/>
            <NextLink href="/notifications" passHref><a>Notifications Page</a></NextLink><br/>

            <br />

            <Typography variant="h5">Truck Owner Zone</Typography>
            <NextLink href="/dashboard/owner" passHref><a>Owner Dashboard</a></NextLink><br/>
            <NextLink href="/manage-trucks" passHref><a>Manage Trucks</a></NextLink><br/>
            <NextLink href="/create-truck" passHref><a>Create Truck Page</a></NextLink><br/><br/>
        </>
    )
}

/*<Link href={`/truck/${}`}*/

export default HomePage