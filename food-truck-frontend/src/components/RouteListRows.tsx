import React from "react";
import api from "../util/api";
import {Button} from "@material-ui/core";

const RouteDaysObject = [{
    routeDaysId: "",
    routeId: "",
    day: ""
}]

type RouteRowState = {
    daysData: {
        routeDaysId: string,
        routeId: string,
        day: string
    }[]
}

type RouteRowProps = {
    routeId: number,
    routeName: string,
    active: string
    removeRow: () => void
}


class RouteListRow extends React.Component<RouteRowProps, RouteRowState>{

    constructor(props: RouteRowProps) {
        super(props);
        this.state = {
            daysData: RouteDaysObject
        }
    }

    componentDidMount() {
        api.get(`/route/${this.props.routeId}/days`)
            .then(res => {
                this.setState({daysData: res.data});
            })
            .catch(err => {
                console.log(err.toString());
            });
    }

    render() {
        let daysWeek: string = "";

        this.state.daysData.forEach(days => {
            daysWeek += days.day.toLowerCase() + ","
        })

        return (
            <tr>
                <td>{this.props.routeName}</td>
                <td>{daysWeek}</td>
                <td>{this.props.active}</td>
                <td><Button onClick={this.props.removeRow}>X</Button></td>
            </tr>
        );
    }

}

export default RouteListRow;