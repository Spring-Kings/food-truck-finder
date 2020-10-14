import React from "react";
import api from "../util/api";

type RouteState = {
    truck: {"id": string,
        userId: string,
        name: string,
        menu: string,
        textMenu: string,
        priceRating: string,
        description: string,
        schedule: string,
        foodCategory: string}

}

type RouteProps = {
    truckId: number
}

class RouteList extends React.Component<RouteProps, RouteState>{
    constructor(props: RouteProps) {
        super(props);
    }

    componentDidMount() {
        api.get(`/truck/${this.props.truckId}`, {}).then(res => {

        }).catch();
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default RouteList;