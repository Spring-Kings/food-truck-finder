import React, {Component, ReactElement} from 'react'
import {AxiosResponse} from 'axios'
import api from '../util/api'
import {Button, Grid} from '@material-ui/core';

export type Props = {
    submitUrl: string,
    submitMethod?: "POST" | "PUT" | "DELETE",
    onSuccessfulSubmit?: (formData: any, response: AxiosResponse<any>) => void,
    onFailedSubmit?: (formData: any, response: any) => void, // TODO: Figure out type of response
    children?: React.ReactNode
}

type State = {
    formData: any
};

class Form extends Component<Props, State> {
    static defaultProps = {
        submitMethod: "POST"
    }

    constructor(props: Props) {
        super(props);

        this.state = {formData: {}};
        React.Children.forEach(this.props.children, c => {
            const child = c as ReactElement;
            if (typeof (child.props.name) !== 'undefined') {
                if (typeof (child.props.value) !== 'undefined') {
                    this.state.formData[child.props.name] = child.props.value;
                } else if (typeof (child.props.defaultValue) !== 'undefined') {
                    this.state.formData[child.props.name] = child.props.defaultValue;
                } else {
                    this.state.formData[child.props.name] = "";
                }
            }
        });

        this.onSubmit = this.onSubmit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    {/* For each child, shove it in a Grid and add the onChange event callback */}
                    {React.Children.map(this.props.children,
                        child => {
                            const c = child as ReactElement;
                            if (typeof (c.props.name) === 'undefined')
                                return c;
                            return (<Grid item>
                                {React.cloneElement(c, {
                                    onChange: this.onValueChanged,
                                    value: this.state.formData[c.props.name]
                                })}
                            </Grid>);
                        }
                    )}
                    <Button variant="contained" type="submit">Submit</Button>
                </Grid>
            </form>
        )
    }

    onSubmit(event: React.FormEvent) {
        api.request({
            url: this.props.submitUrl,
            data: this.state.formData,
            method: this.props.submitMethod,
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

    onValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
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
}


export default Form;