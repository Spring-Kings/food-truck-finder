import {Typography} from "@material-ui/core";
import React from 'react';
import NextLink from 'next/link'

require('dotenv').config();

class HomePageComponent extends React.Component {
    render() {
        return (
            <>
                <Typography variant="h4">Food Truck Finder</Typography>
                <NextLink href="/login" passHref>Login</NextLink><br/>
                <br/>

                <Typography variant="h5">Guest Zone</Typography>
                <NextLink href="/recommended-trucks" passHref>Truck Recommendation Search</NextLink><br/>
                <NextLink href="/search/truck" passHref>Truck Search</NextLink><br/>
                <NextLink href="/interactive-map" passHref>Trucks Nearby</NextLink><br/>

                <br/>

                <Typography variant="h5">User Zone</Typography>
                <NextLink href="/dashboard/user" passHref>User Dashboard</NextLink><br/>
                <NextLink href="/account" passHref>Account</NextLink><br/>
                <NextLink href="/reviews" passHref>Reviews</NextLink><br/>
                <NextLink href="/notifications" passHref>Notifications Page</NextLink><br/>

                <br/>

                <Typography variant="h5">Truck Owner Zone</Typography>
                <NextLink href="/dashboard/owner" passHref>Owner Dashboard</NextLink><br/>
                <NextLink href="/manage-trucks" passHref>Manage Trucks</NextLink><br/>
                <NextLink href="/create-truck" passHref>Create Truck Page</NextLink><br/><br/>
            </>
        )
    }

    componentDidMount() {
        if (!navigator.geolocation)
            console.log("Geolocation not supported")
        else
            navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError);
    }

    geoLocationSuccess(position: Position) {
        localStorage.setItem("longitude", String(position.coords.longitude));
        localStorage.setItem("latitude", String(position.coords.latitude));
        console.log("Set position to " + position.coords.latitude + "," + position.coords.longitude);
    }

    geoLocationError() {
        console.log("Geolocation failure");
    }

}

function HomePage() {
    return <HomePageComponent/>
}

export default HomePage;