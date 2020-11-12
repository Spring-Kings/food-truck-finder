import {Grid, IconButton, TextField, Typography} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {ChangeEvent, Component} from "react";
import { ReactEventAdapter } from "../Form";

type MultiProps = {
  title: string;
  value?: string[];
  onChange?: (event: ReactEventAdapter) => void;
  name: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "subtitle1" | "subtitle2" | "body1" | "body2";
};
type MultiState = {
  defaultValue: string[];
  num_kids: number;
};

class MultiField extends Component<MultiProps, MultiState> {
  constructor(props: MultiProps) {
    super(props);
    console.log(props);
    this.state = {
      defaultValue: props.value? props.value : [],
      num_kids: 1,
    };
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item key="head">
          <Typography variant={this.props.variant? this.props.variant : "h6"}>{this.props.title}</Typography>
        </Grid>
        {this.state.defaultValue.map((val: string, ndx: number) => {
          const INDEX: number = ndx;
          return (
            <Grid key={INDEX} item>
              <TextField
                value={this.state.defaultValue[INDEX]}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => this.updateKid(event, INDEX)}
              />
              <IconButton onClick={() => this.dropKid(INDEX)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          );
        })}
        <Grid item key="add">
          <IconButton onClick={this.addKid}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  updateKid = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ndx: number) => {
    this.updateState(this.state.defaultValue.map((v2, i2) => ndx === i2 ? event.target.value : v2));
  }

  addKid = () => {
    this.updateState(this.state.defaultValue.concat(""));
  };

  dropKid = (dropNdx: number) => {
    this.updateState(this.state.defaultValue.filter(
      (val, ndx) => ndx !== dropNdx
    ));
  };

  updateState = (values: string[]) => {
    this.setState({
      defaultValue: values
    })
    if (this.props.onChange)
      this.props.onChange({
        target: {
          name: this.props.name,
          value: values,
          type: undefined
        }
      });
  }
}

export default MultiField;
