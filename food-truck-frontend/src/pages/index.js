import CoolLayout from '../components/CoolLayout'
import logout from "../util/logout";

import React from 'react';
import Link from 'next/link'

require('dotenv').config();

function HomePage() {
    return (
        <CoolLayout>
            <p>This is the home page!</p>

            <Link href="#" passHref><a onClick={logout}>Log Out</a></Link><br/>
            <Link href="/register" passHref>Register</Link><br/>
            <Link href="/dashboard/user" passHref>User Dashboard</Link><br/>
            <Link href="/dashboard/owner" passHref>Owner Dashboard</Link><br/>
            <Link href="/account" passHref>Account</Link><br/>
            <Link href="/interactive-map" passHref>Interactive Map</Link><br/>
            <Link href="/routes" passHref>Routes</Link><br/>
            <Link href="/login" passHref>Login</Link><br/>
            <Link href="/manage-trucks" passHref>Manage Trucks</Link><br/>
            <Link href="/reviews" passHref>Reviews</Link><br/>
            <Link href="/user-info" passHref>User info</Link><br/>
            <Link href="/search/user" passHref>User Search Page</Link><br/>
            <Link href="/search/owner" passHref>Owner Search Page</Link><br/>
            <Link href="/create-truck" passHref>Create Truck Page</Link>
        </CoolLayout>
    )
}

/*<Link href={`/truck/${}`}*/

export default HomePage