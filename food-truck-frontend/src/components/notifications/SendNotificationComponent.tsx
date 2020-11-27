import React, {Component} from 'react';
import {TextField} from "@material-ui/core";
import Form from "../Form";
import {AxiosError, AxiosResponse} from "axios";

interface SendNotificationProps {
  truckId: number;
}

interface SendNotificationState {
  truckId: number;
  message: string;
  error: string;
}

class SendNotificationComponent extends Component<SendNotificationProps, SendNotificationState> {
  constructor(props: SendNotificationProps) {
    super(props);
    this.state = {
      truckId: props.truckId,
      message: "",
      error: ""
    }
  }

  render() {
    return (
      <Form submitMethod="POST"
            submitUrl={'/truck/notification'}
            onSuccessfulSubmit={this.onSuccess}
            onFailedSubmit={this.onFail}>
        <TextField className="hidden" disabled label="Truck ID" name="truckId"
                   defaultValue={this.state.truckId}/>
        <TextField label="Message"
                   name="message"
                   defaultValue={this.state.message}
                   fullWidth
                   multiline
                   rows={3}
                   rowsMax={8}/>
      </Form>
    );
  }

  onFail = (formData: any, response: AxiosError) => {
    this.setState({
      ...this.state,
      error: `Failed to send notification: ${JSON.stringify(response)}`
    });
  }

  onSuccess = (formData: any, response: AxiosResponse) => {
    this.setState({
      ...this.state,
      message: ""
    });
  }
}

export default SendNotificationComponent;