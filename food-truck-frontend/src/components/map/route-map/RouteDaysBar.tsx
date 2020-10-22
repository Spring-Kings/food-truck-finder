import React from "react";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import DayOfWeek, { dayValues } from "./DayOfWeek";
import api from "../../../util/api";
import { DEFAULT_ERR_RESP } from "../../../api/DefaultResponses";

type RouteDaysBarProps = {
    routeId: number
    func: (days: DayOfWeek[], discarded: DayOfWeek[]) => void
}



type RouteDaysBarState = {
    days: DayOfWeek[];
    discarded: DayOfWeek[];
}

class RouteDaysBar extends React.Component<RouteDaysBarProps, RouteDaysBarState>{

    constructor(props: RouteDaysBarProps) {
        super(props);

        this.state = {
            days: [],
            discarded: []
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

    private getDayBox = (name: DayOfWeek) => {
        const findDay = (day: DayOfWeek) => day === name;
        return (<FormControlLabel
            checked={this.state.days.findIndex(findDay) != -1}
            control={<Checkbox onChange={(event) => {
                let newDays: DayOfWeek[] = this.state.days;
                let discarded: DayOfWeek[] = this.state.discarded;

                // Create new state lists
                if (event.target.checked) {
                    discarded = discarded.filter(findDay);
                    newDays = newDays.concat(name);
                } else {
                    newDays = newDays.filter(day => !findDay(day));
                    discarded = discarded.concat(name);
                }

                // Update state
                this.setState({
                    days: newDays,
                    discarded: discarded
                });
                this.props.func(newDays, discarded);
            }} />}
            label={name}
        />)
    }
}

export default RouteDaysBar;