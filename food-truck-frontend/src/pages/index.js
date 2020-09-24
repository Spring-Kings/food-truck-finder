import React from 'react';

import Link from 'next/link'

require('dotenv').config();

function HomePage() {
    return (
        <div>
            <p>This is the home page!</p>
            <Link href="/register" passHref>Register</Link><br/>
            <Link href="/dashboard" passHref>Dashboard</Link><br/>
            <Link href="/account" passHref>Account</Link><br/>
            <Link href="/interactive-map" passHref>Interactive Map</Link><br/>
            <Link href="/routes" passHref>Routes</Link><br/>
            <Link href="/login" passHref>Login</Link><br/>
            <Link href="/manage-trucks" passHref>Manage Trucks</Link>
        </div>
    )
}

export default HomePage