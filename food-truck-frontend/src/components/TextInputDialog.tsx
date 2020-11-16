import React, { Component } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

// State of the dialog contents
interface TextDialogState {
  content: string;
}

// Props of the dialog contents
interface TextDialogProps {
  title: string;
  question: string;
  submitString: string | null;
  cancelString: string | null;
  open: boolean;

  onSubmit: (text: string) => void;
  onCancel: () => void;
}

/**
 * Simple wrapper handling boilerplate of a text-input dialog.
 *
 * Heavily inspired by: https://material-ui.com/components/dialogs/ (open form dialog version)
 */
class TextInputDialogContent extends Component<
  TextDialogProps,
  TextDialogState
> {
  constructor(props: TextDialogProps) {
    super(props);

    // Create the default state
    this.state = {
      content: "",
    };

    // Bind methods
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogText>{this.props.question}</DialogText>
          <TextField onChange={this.onValueChanged} />
        </DialogContent>

        {/** Specifies OK button */}
        <DialogActions>
          <Button onClick={this.props.onCancel}>
            {this.props.cancelString ? this.props.cancelString : "Cancel"}{" "}
          </Button>
          <Button onClick={() => this.props.onSubmit(this.state.content)}>
            {this.props.submitString ? this.props.submitString : "OK"}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onValueChanged(event: React.ChangeEvent<any>) {
    var value: string | null = event.target.value;
    this.setState({
      content: value ? value : "",
    });
  }
}

export default TextInputDialogContent;
