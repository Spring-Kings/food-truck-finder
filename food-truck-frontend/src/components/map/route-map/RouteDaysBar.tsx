import React from "react";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";

type RouteDaysBarProps = {
    func: (days: string[]) => void
}



type RouteDaysBarState = {
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
}

class RouteDaysBar extends React.Component<RouteDaysBarProps, RouteDaysBarState>{

    constructor(props: RouteDaysBarProps) {
        super(props);

        this.state = {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
        }
    }

    private days: string[] = [];

    render(){
        return (
            <FormGroup row>
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("SUNDAY"):
                            this.days = this.days.filter(s => s != "SUNDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Sunday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("MONDAY"):
                            this.days = this.days.filter(s => s != "MONDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Monday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("TUESDAY"):
                            this.days = this.days.filter(s => s != "TUESDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Tuesday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("WEDNESDAY"):
                            this.days = this.days.filter(s => s != "WEDNESDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Wednesday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("THURSDAY"):
                            this.days = this.days.filter(s => s != "THURSDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Thursday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("FRIDAY"):
                            this.days = this.days.filter(s => s != "FRIDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Friday"
                />
                <FormControlLabel
                    control={<Checkbox onChange={(event) => {
                        event.target.checked ?
                            this.days.push("SATURDAY"):
                            this.days = this.days.filter(s => s != "SATURDAY");
                            this.props.func(this.days);
                    }} />}
                    label="Saturday"
                />
            </FormGroup>

        )
    }
}

export default RouteDaysBar;