import React, { Component } from 'react';
import {TextField} from "@material-ui/core";
import Form from "../Form";
import {AxiosResponse} from "axios";

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
      <Form submitMethod="POST" submitUrl={'/truck/notification'} onFailedSubmit={this.onFail}>
        <TextField disabled label="Truck ID" variant="outlined" name="truckId" defaultValue={this.state.truckId}/>
        <TextField label="Message" variant="outlined" name="message" defaultValue={this.state.message}/>
      </Form>
    );
  }

  onFail = (formData: any, response: AxiosResponse) => {
    this.setState({
      ...this.state,
      error: `Failed to send notification: ${JSON.stringify(response)}`
    });
  }
}

export default SendNotificationComponent;