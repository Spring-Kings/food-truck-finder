import React from "react";
import Router from "next/router";
import api from "../util/api";
import {FormControlLabel, IconButton, Switch} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DayOfWeek from "./map/route-map/DayOfWeek";

const RouteDaysObject = [{
    routeDaysId: "",
    routeId: "",
    day: "",
}]

type RouteRowState = {
    daysData: {
        routeDaysId: string,
        routeId: string,
        day: string
    }[],
}

type RouteRowProps = {
    routeId: number,
    routeName: string,
    active: boolean,
    days: DayOfWeek[],
    removeRow: () => void,
    toggleActive: (routeId: number, active: boolean) => void
}


class RouteListRow extends React.Component<RouteRowProps, RouteRowState>{

    constructor(props: RouteRowProps) {
        super(props);
        this.state = {
            daysData: RouteDaysObject,
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
        let daysWeek: string = this.props.days[0];
        for (let i = 1; i < this.props.days.length; i++)
            daysWeek = `${daysWeek}, ${this.props.days[i]}`;

        return (
            <tr>
                <td>{this.props.routeName}</td>
                <td>{daysWeek}</td>
                <td>
                    <FormControlLabel
                        label="Active"
                        control={<Switch checked={this.props.active}
                                    onChange={(_, checked) => this.props.toggleActive(this.props.routeId, checked)} />
                        }
                    />
                </td>
                <td><IconButton onClick={() => Router.replace(`/routes/edit/${this.props.routeId}`)}><EditIcon /></IconButton></td>
                <td><IconButton onClick={this.props.removeRow}><DeleteForeverIcon /></IconButton></td>
            </tr>
        );
    }
}

export default RouteListRow;