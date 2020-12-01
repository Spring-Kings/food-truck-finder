import {Box, Grid, Typography} from "@material-ui/core";
import React from 'react';
import NextLink from 'next/link'
import TruckLocationMapComponent from "../components/map/truck_location_map/TruckLocationMapComponent";
import {RecommendedSimpleTruck} from "../redux/user/UserReducer";
import api from "../util/api";
import {DEFAULT_ERR_RESP} from "../api/DefaultResponses";
import RecommendTruckMap from "../components/truck/RecommendTruckMap";
import {backendToFrontend} from "../domain/RouteLocation";

require('dotenv').config();

type HomePageState = {
    recommendedTrucks: RecommendedSimpleTruck[];
}

type HomePageProps = {
}

class HomePageComponent extends React.Component<HomePageProps, HomePageState> {

    constructor(props: HomePageProps) {
        super(props);

        this.state = {
            recommendedTrucks: []
        }
    }

    render() {

        return (
            <Grid container direction={'row'} spacing={3}>
                <Grid item xs={6}>
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
                    <NextLink href="/create-truck" passHref>Create Truck Page</NextLink><br/><br/>
                </>
                </Grid>
                <Grid item xs={6}>
                    <RecommendTruckMap recommendedTrucks={this.getRouteLocations(this.state.recommendedTrucks)}/>
                </Grid>
                </Grid>
        )
    }

    getRouteLocations(trucks: RecommendedSimpleTruck[]) {
        var routeLoc: any = [];
        trucks.map((t, ndx) => {
           let loc: any = backendToFrontend(t.loc,ndx);
           routeLoc.push(loc);
        })
        return routeLoc
    }

    async componentDidMount() {
        if (!navigator.geolocation)
            console.log("Geolocation not supported")
        else
            navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError);

        try {
            let resp: any = await api.request({
                url: "/truck/recommended",
                data: {
                    acceptableRadius: 20,
                    priceRating: 0,
                    truckIds: localStorage.getItem("prevSearch") ? JSON.parse(`${localStorage.getItem("prevSearch")}`) : [],
                    tags: [],
                    active: false,
                    numRequested: 10
                },
                method: "POST",
            });
            if (resp.data !== undefined) {
                this.setState({ recommendedTrucks: resp.data })
            }

        } catch (err) {
            DEFAULT_ERR_RESP(err);
        }
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