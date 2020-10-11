import React, {Component} from 'react'
import {AxiosResponse} from 'axios'
import api from '../util/api'
import {Button, Grid, TextField} from '@material-ui/core';

type Props = {
    elementNames: string[],
    submitUrl: string,
    onSuccessfulSubmit?: (formData: any, response: AxiosResponse<any>) => void;
    onFailedSubmit?: (formData: any, response: any) => void; // TODO: Figure out type of response
}

type State = {
    result: string | null;
    formData: any
};

class Form extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            result: null,
            formData: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    renderFormElement(name: string) {
        return (
            <Grid key={name} item>
                <TextField label={name} variant="outlined" name={name} onChange={this.onValueChanged}/>
            </Grid>
        )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <Grid container justify="center" direction="column" alignItems="center" spacing={2}>
                        {this.props.elementNames.map((name, idx) => this.renderFormElement(name))}
                        <Button variant="contained" type="submit">Submit</Button>
                    </Grid>
                </form>
                <div>{this.state.result}</div>
            </div>

        )
    }

    onSubmit(event: React.FormEvent) {
        api.post(this.props.submitUrl, this.state.formData)
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