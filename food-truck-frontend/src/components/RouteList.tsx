import React from "react";
import api from "../util/api";

const TruckObject = {
        id: "",
        userId: "",
        name: "",
        schedule: "",
}

const RouteObject = [{
    routeId: 0,
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
        routeId: number
        routeName: string
        active: string
    }[]
}


type RouteProps = {
    truckId: string
}

class RouteList extends React.Component<RouteProps, RouteState>{
    constructor(props: RouteProps) {
        super(props);
        this.state = {
            truck: TruckObject,
            routeData: RouteObject
        }

    }

    componentDidMount(){
        api.get(`/truck/${this.props.truckId}`).then(res => {
            this.setState({truck : res.data});
        }).catch(err => {
            console.log(err);
            this.setState(err.toString())
        });

        this.fetchRoutes();
    }

    fetchRoutes(){
        api.get(`/truck/${this.props.truckId}/routes`, {}).then(res => {
            this.setState({routeData : res.data});
        }).catch(err => {
            console.log(err.toString());
        });
    }

    renderRouteRow(index: number){

        return(
            <tr>
                <td>{this.state.routeData[index].routeName}</td>
            </tr>
        )
    }

    render() {
        return (
            <div>
                <h1>{this.state.truck.name}</h1>
                <table>
                    <tr>
                       <th>Route Name</th>
                       <th>Days</th>
                       <th>Active</th>
                    </tr>

                    {this.state.routeData.map(((value, index) => this.renderRouteRow(index)))}
                </table>


            </div>
        );
    }
}

export default RouteList;