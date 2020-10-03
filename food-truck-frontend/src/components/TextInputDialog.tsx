import React, { Component, ReactFragment } from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

// State of the dialog contents
interface DialogContentState {
    content: string
}

// Props of the dialog contents
interface DialogContentProps {
  title: string;
  question: string;
  submitString: string | null;
  cancelString: string | null;

  onSubmit: (text: string) => void;
  onCancel: () => void;
}

/**
 * Simple wrapper handling boilerplate of a text-input dialog.
 * Needs to be wrapped in a 'Dialog' which handles opening/closing. I could have used some Redux wizardry to bypass this,
 * but determined that it would not be time-efficient when a simple solution exists.
 * 
 * May fix it later to be at true drop-in dialog.
 * 
 * Heavily inspired by: https://material-ui.com/components/dialogs/ (open form dialog version)
 */
class TextInputDialogContent extends Component<DialogContentProps, DialogContentState> {
  constructor(props: DialogContentProps) {
    super(props);

    // Create the default state
    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogText>{this.props.question}</DialogText>
          <TextField onChange={this.onValueChanged}/>
        </DialogContent>

        {/** Specifies OK button */}
        <DialogActions>
          <Button onClick={() => this.props.onSubmit(this.state.content)}>
            {this.props.submitString ? this.props.submitString : "OK"}{" "}
          </Button>
          <Button onClick={this.props.onCancel} variant="outlined">
            {this.props.submitString ? this.props.cancelString : "Cancel"}{" "}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }

  onValueChanged(event: React.ChangeEvent<Element>) {
    var value: string | null = event.target.textContent;
    this.setState({
        content: value? value : ""
    })
  }
}
