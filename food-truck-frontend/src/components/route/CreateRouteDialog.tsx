import React from "react";
import { Dialog, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import Form from "../Form";

export interface CreateRouteProps {
  open: boolean;
  truckId: number;

  onSuccess: (form: any, response: any) => void;
  onFailure: (form: any, response: any) => void;
}
export interface CreateRouteState {}

class CreateRouteDialog extends React.Component<
  CreateRouteProps,
  CreateRouteState
> {
  constructor(props: CreateRouteProps) {
    super(props);
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Create Route</DialogTitle>
        <DialogContent>
          <Form
            submitMethod="POST"
            submitUrl={`/truck/${this.props.truckId}/create-route`}
            onSuccessfulSubmit={this.props.onSuccess}
            onFailedSubmit={this.props.onFailure}
          >
            <TextField
              label="Route Name"
              variant="outlined"
              name="routeName"
            />
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default CreateRouteDialog;
