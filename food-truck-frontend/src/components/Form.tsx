import React, {Component} from 'react'
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'

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
            <tr key={name}>
                <td><label htmlFor={name}>{name}:</label></td>
                <td><input name={name} onChange={this.onValueChanged}/></td>
            </tr>
        )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <table>
                        <tbody>
                        {this.props.elementNames.map((name, idx) => this.renderFormElement(name))}
                        </tbody>
                    </table>

                    <button type="submit">Submit</button>
                </form>
                <div>{this.state.result}</div>
            </div>

        )
    }

    onSubmit(event: React.FormEvent) {
        // TODO: Use redux or something to automatically handle auth header anywhere
        let config: AxiosRequestConfig | undefined;
        if (sessionStorage.getItem('authToken')) {
            config = {headers: {'Authorization': sessionStorage.getItem('authToken')}};
        }

        axios.post(this.props.submitUrl,
            this.state.formData,
            config
        )
            .then(response => {
                if (this.props.onSuccessfulSubmit)
                    this.props.onSuccessfulSubmit(this.state.formData, response);
                console.log(`Submitted to ${process.env.FOOD_TRUCK_API_URL}`);
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