import React from "react";
import api from "../util/api";
import RouteListRow from "./RouteListRows";
import {Button} from "@material-ui/core";
import CreateRouteRow from "./CreateRouteRow";

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
    },
    routeData: {
        routeId: number
        routeName: string
        active: string
    }[],
    startCreate: boolean
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
            startCreate: false,
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

    deleteRow(routeId: string){
        api.delete(`/truck/routes-delete/${routeId}`).then(() =>{
            this.fetchRoutes();
        }).catch(err =>{
            console.log(err.toString())
        })

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
            <RouteListRow active={this.state.routeData[index].active} routeId={this.state.routeData[index].routeId}
                          routeName={this.state.routeData[index].routeName} removeRow={() => this.deleteRow(String(this.state.routeData[index].routeId))}/>
        )
    }

    componentDidUpdate(prevProps: Readonly<RouteProps>, prevState: Readonly<RouteState>, snapshot?: any) {

    }

    render() {

        if(this.state.startCreate){
            return(
                <CreateRouteRow truckId={this.props.truckId}/>
            )
        }

        return (
            <div>
                <h1>{this.state.truck.name}</h1>
                <Button onClick={() => {this.setState({startCreate: true})}}>Create Route</Button>
                <table>
                    <tr>
                       <th>Route Name</th>
                       <th>Days</th>
                       <th>Active</th>
                        <th></th>
                    </tr>

                    {this.state.routeData.map(((value, index) => this.renderRouteRow(index)))}
                </table>


            </div>
        );
    }
}

export default RouteList;