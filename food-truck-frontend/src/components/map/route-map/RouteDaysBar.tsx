import React from "react";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import DayOfWeek, { dayValues } from "./DayOfWeek";
import api from "../../../util/api";
import { DEFAULT_ERR_RESP } from "../../../api/DefaultResponses";

type RouteDaysBarProps = {
    routeId: number
    func: (days: DayOfWeek[]) => void
}



type RouteDaysBarState = {
    days: DayOfWeek[];
}

class RouteDaysBar extends React.Component<RouteDaysBarProps, RouteDaysBarState>{

    constructor(props: RouteDaysBarProps) {
        super(props);

        this.state = {
            days: []
        }
    }

    componentDidMount() {
        api.request({
            url: `/route/${this.props.routeId}/days`,
            method: "GET"
        }).then((resp) => {
            if (resp.data)
                this.setState({ days: resp.data });
        }).catch(DEFAULT_ERR_RESP);
    }

    render(){
        return (
            <FormGroup row>
                { dayValues.map(day => this.getDayBox(day)) }
            </FormGroup>
        )
    }

    private getDayBox = (name: DayOfWeek) => (
        <FormControlLabel
                    checked={this.state.days.find(day => day === name) != undefined}
                    control={<Checkbox onChange={(event) => {
                        this.setState({
                            days: event.target.checked?
                                this.state.days.concat(name) : this.state.days.filter(day => day != name)
                        });
                        this.props.func(this.state.days);
                    }} />}
                    label={name}
                />
    )
}

export default RouteDaysBar;