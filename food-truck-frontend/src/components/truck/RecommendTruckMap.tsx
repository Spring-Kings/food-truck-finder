import React from 'react';
import {RecommendedSimpleTruck} from "../../redux/user/UserReducer";
import {Box, Typography} from "@material-ui/core";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";
import api from "../../util/api";
import {DEFAULT_ERR_RESP} from "../../api/DefaultResponses";
import {RouteLocation} from "../../domain/RouteLocation";

interface RecommendMapProps{
    recommendedTrucks: RouteLocation[];
}

interface RecommendMapState{
}



class RecommendTruckMap extends React.Component<RecommendMapProps, RecommendMapState>{
    constructor(props: RecommendMapProps) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <>
            <Box py={0.5} px={3}>
                <Typography variant="h6">Recommended Trucks</Typography>
            </Box>
            <TruckLocationMapComponent locations={this.props.recommendedTrucks} height="50vh" allowChangeLocation={true}/>
            </>
        );
    }
}



export default RecommendTruckMap;