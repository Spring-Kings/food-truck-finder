import React from 'react';

import Link from 'next/link'

require('dotenv').config();

function HomePage() {
    return (
        <div>
            <p>This is the home page!</p>
            <Link href="/register" passHref>Register</Link>
        </div>
    )
}

export default HomePage