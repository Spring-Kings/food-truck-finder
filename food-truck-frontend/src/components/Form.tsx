import React, {Component} from 'react'
import {AxiosResponse} from 'axios'
import api from '../util/api'
import {Button, Grid} from '@material-ui/core';

type Props = {
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

        this.state = {
            formData: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    /*renderFormElement(name: string) {
        return (
            <Grid key={name} item>
                <TextField label={name} variant="outlined" name={name} onChange={this.onValueChanged}/>
            </Grid>
        )
    }*/

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    {/* For each child, shove it in a Grid and add the onChange event callback */}
                    {React.Children.map(this.props.children,
                        child => <Grid item>
                            {React.cloneElement(child as React.ReactElement, {onChange: this.onValueChanged})}
                        </Grid>
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
        //console.log(this.state);
    }

}

export default Form;