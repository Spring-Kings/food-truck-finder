import React, {Component, ReactElement} from 'react'
import {AxiosError, AxiosResponse} from 'axios'
import api from '../util/api'
import {Button, Grid} from '@material-ui/core';
import {recursiveMap} from "../util/react-utils";

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
    recursiveMap(this.props.children, node => {
      if (!React.isValidElement(node))
        return;
      const e = node as ReactElement;

      if (e.props.name) {
        this.state.formData[e.props.name] =
            e.props.value ??
            e.props.defaultValue ??
            e.props.checked ??
            "";
      }
    });

    console.log("Initial state: ");
    console.log(this.state);

    this.onSubmit = this.onSubmit.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  wrapInGrid = (child: React.ReactNode) => {
    if (!React.isValidElement(child))
      return child;
    const c = child as ReactElement;

    return <Grid item key={c.key + "_wrapper"}>{c}</Grid>
  }

  mapChild = (child: React.ReactNode) => {
    if (!React.isValidElement(child))
      return child;

    const c = child as ReactElement;
    if (c.props.name) {
      //console.log("Mapping " + c.props.name + " => " + this.state.formData[c.props.name]);
      const someProps = (c.props.checked) ? {
        checked: this.state.formData[c.props.name]
      }
      : {
        value: this.state.formData[c.props.name]
      }

      return React.cloneElement(c, {
        onChange: this.onValueChanged,
        ...someProps,
        defaultValue: undefined,
      });
    }

    else
      return c;
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} {...this.props.formProps}>
        <Grid container spacing={2}>
          {recursiveMap(this.props.children, this.mapChild)
              .map(this.wrapInGrid)
          }
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
      }),
() => console.log(this.state)
    );

  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let newFormData: any = {};
    if (props.children)
      recursiveMap(props.children, node => {
        if (!React.isValidElement(node))
          return;
        const e = node as ReactElement;

        if (e.props.name) {
          newFormData[e.props.name] =
              state.formData[e.props.name] ??
              e.props.value ??
              e.props.defaultValue ??
              e.props.checked ??
              "";
        }
      });

    state.formData = newFormData;
    return state;
  }
}


export default Form;