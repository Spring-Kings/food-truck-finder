import { Grid, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { Component } from "react";

type MultiProps = {
  title: string;
  name: string;
};
type MultiState = {
  defaultValue: string[];
  num_kids: number;
};

class MultiField extends Component<MultiProps, MultiState> {
  constructor(props: MultiProps) {
    super(props);
    this.state = {
      defaultValue: [],
      num_kids: 1,
    };
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item key="head">
          <Typography variant="h6">{this.props.title}</Typography>
        </Grid>
        {this.state.defaultValue.map((val: string, ndx: number) => {
          const INDEX: number = ndx;
          return (
            <Grid key={INDEX} item>
              <TextField
                value={this.state.defaultValue[INDEX]}
                onChange={(event) =>
                  this.setState({
                    defaultValue: this.state.defaultValue.map((v2, i2) =>
                      INDEX === i2 ? event.target.value : v2
                    ),
                  })
                }
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

  addKid = () => {
    this.setState({
      defaultValue: this.state.defaultValue.concat(""),
    });
  };

  dropKid = (dropNdx: number) => {
    console.log(this.state.defaultValue);
    console.log(dropNdx)
    this.setState({
      defaultValue: this.state.defaultValue.filter(
        (val, ndx) => ndx !== dropNdx
      ),
    });
  };
}

export default MultiField;
