import React from "react";
import Router from "next/router";
import api from "../util/api";
import {IconButton} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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
                this.setState({daysData: res.data? res.data : []});
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
                <td><IconButton onClick={() => Router.replace(`/routes/edit/${this.props.routeId}`)}><EditIcon /></IconButton></td>
                <td><IconButton onClick={this.props.removeRow}><DeleteForeverIcon /></IconButton></td>
            </tr>
        );
    }

}

export default RouteListRow;