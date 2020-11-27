import React, {Component, ReactElement} from 'react'
import {AxiosError, AxiosResponse} from 'axios'
import api from '../util/api'
import {Button, Grid} from '@material-ui/core';

export type Props = {
    submitUrl: string,
    submitMethod?: "POST" | "PUT" | "DELETE",
    onSuccessfulSubmit?: (formData: any, response: AxiosResponse<any>) => void,
    onFailedSubmit?: (formData: any, response: AxiosError<any>) => void, // TODO: Figure out type of response
    children?: React.ReactNode,
    customSubmitHandler?: Function,
    formProps?: any
}

type State = {
  formData: any
};

/* Allow passing information other than a ReactEvent, under odd circumstances */
export interface ReactEventAdapter {
  target: {
    type: undefined;
    value: any;
    name: string;
  };
}

class Form extends Component<Props, State> {
  static defaultProps = {
    submitMethod: "POST"
  }

  constructor(props: Props) {
    super(props);

    this.state = {formData: {}};
    React.Children.forEach(this.props.children, c => {
      // Ensure a null didn't slip through (can happen in dynamic forms)
      if (c === null)
        return;

      // Parse child
      const child = c as ReactElement;
      if (child.props.name != null) {
        if (child.props.value != null) {
          this.state.formData[child.props.name] = child.props.value;
        } else if (child.props.defaultValue != null) {
          this.state.formData[child.props.name] = child.props.defaultValue;
        } else {
          this.state.formData[child.props.name] = "";
        }
      }
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  mapChild = (child: React.ReactNode) => {
    const c = child as ReactElement;
    if (c === null || c.props.name === undefined)
      return child;
    return (
      <Grid item>
        {React.cloneElement(c, {
          onChange: this.onValueChanged,
          value: this.state.formData[c.props.name],
          defaultValue: undefined
        })}
      </Grid>
    );
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} {...this.props.formProps}>
        <Grid container spacing={2}>
          {React.Children.map(this.props.children, this.mapChild)}
          <Grid item>
            <Button type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
    )
  }

  onSubmit(event: React.FormEvent) {
    if (this.props.customSubmitHandler) {
      this.props.customSubmitHandler(event, this.state.formData);
      event.preventDefault();
      return;
    }

    api.request({
      url: this.props.submitUrl,
      data: this.state.formData,
      method: this.props.submitMethod
    })
      .then(response => {
        if (this.props.onSuccessfulSubmit)
          this.props.onSuccessfulSubmit(this.state.formData, response);
        console.log(`Submitted to ${this.props.submitUrl}`);
      })
      .catch(error => {
        if (error.response) {
          console.log("Got response with error status code");
        } else if (error.request) {
          console.log("Got no response")
        } else {
          console.log('Failed to make request', error.message);
        }
        if (this.props.onFailedSubmit)
          this.props.onFailedSubmit(this.state.formData, error);
      })

    event.preventDefault();
  }

  onValueChanged(event: React.ChangeEvent<HTMLInputElement> | ReactEventAdapter) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState(prev => ({
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let newFormData: any = {};
    if (props.children)
      React.Children.forEach(props.children, (c: any) => {
        // Ensure a null didn't slip through (can happen in dynamic forms)
        if (c === null)
          return;

        // Parse child
        let name: string = (c as ReactElement).props.name as string;
        newFormData[name] = state.formData[name];
      });
    state.formData = newFormData;
    return state;
  }
}


export default Form;