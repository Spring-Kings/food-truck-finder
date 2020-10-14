import React from "react";

type RouteState = {
    data: string
}

type RouteProps = {
    truckId: number
}

class RouteList extends React.Component<RouteState, RouteProps>{
    constructor(props: RouteProps) {
        super(props);
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default RouteList;