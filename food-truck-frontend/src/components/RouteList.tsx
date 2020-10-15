import React from "react";
import api from "../util/api";

const TruckObject = {
        id: "",
        userId: "",
        name: "",
        schedule: "",
}

const RouteObject = [{
    routeName: "",
    active: ""
}]




type RouteState = {
    truck: {
        "id": string,
        userId: string,
        name: string,
        schedule: string,
    }
    routeData: {
        routeName: string
        active: string
    }[],
    error: {}
}


type RouteProps = {
    truckId: string
}

class RouteList extends React.Component<RouteProps, RouteState>{
    constructor(props: RouteProps) {
        super(props);
        this.state = {
            truck: TruckObject,
            routeData: RouteObject,
            error: {}
        }

    }

    componentDidMount(){
        api.get(`/truck/${this.props.truckId}`).then(res => {
            this.setState({truck : res.data});
        }).catch(err => {
            console.log(err);
            this.setState({error: err})
        });

        api.get(`/truck/${this.props.truckId}/routes`, {}).then(res => {
            this.setState({routeData : res.data});
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <p>{JSON.stringify(this.state.truck)}</p>
                <p>{this.state.routeData[0].routeName}</p>

            </div>
        );
    }
}

export default RouteList;