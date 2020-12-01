import React from 'react';
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
            <RecommendTruckMap recommendedTrucks={this.getRouteLocations(this.state.recommendedTrucks)} />
        )
    }


    async componentDidMount() {
        try {
        let resp: any = await api.request({
            url: "/truck/recommended",
            data: {
            acceptableRadius: 20,
            priceRating: 0,
            truckIds: localStorage.getItem("prevSearch")
                ? JSON.parse(`${localStorage.getItem("prevSearch")}`)
                : [],
            tags: [],
            active: false,
            numRequested: 10,
            },
            method: "POST",
        });
        if (resp.data !== undefined) {
            this.setState({ recommendedTrucks: resp.data });
        }
        } catch (err) {
        DEFAULT_ERR_RESP(err);
        }
    }

    getRouteLocations(trucks: RecommendedSimpleTruck[]) {
        return trucks.map((t) => backendToFrontend(t.loc, t.truck.id))
    }
}

function HomePage() {
    return <HomePageComponent/>
}

export default HomePage;