import React from "react";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  DialogActions,
} from "@material-ui/core";
import DateFns from "@date-io/date-fns";

import { RouteStop } from "./RouteMap";

interface ERSDProps {
  routePt: RouteStop | undefined;
  confirm: (arrival: Date, departure: Date) => void;
  cancel: () => void;
}

interface ERSDState {
  arrival: Date;
  departure: Date;

  readonly [x: string]: Date;
}

class EditRouteStopDialogComponent extends React.Component<
  ERSDProps,
  ERSDState
> {
  constructor(props: ERSDProps) {
    super(props);
  }

  render() {
    return (
      <Dialog open={this.props.routePt != undefined}>
        <DialogTitle>
          Edit times for Stop #{this.props.routePt?.stopId}
        </DialogTitle>
        <DialogContent>
          {/* Learned from: https://material-ui.com/components/pickers/ */}
          <MuiPickersUtilsProvider utils={DateFns}>
            <Grid container direction="column">
              <Grid item>{this.getPicker("arrival")}</Grid>
              <Grid item>{this.getPicker("departure")}</Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
        <Button variant="outlined" onClick={this.props.cancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              this.props.confirm(this.state.arrival, this.state.departure)
            }
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private getPicker(propName: string) {
    return (
      <KeyboardTimePicker
        label={propName.toLocaleUpperCase}
        value={this.state?.[propName]}
        onChange={(date) => {
          if (date != null) {
            this.setState({ [propName]: new Date(date.getTime()) });
          }
        }}
      />
    );
  }
}

export default EditRouteStopDialogComponent;
