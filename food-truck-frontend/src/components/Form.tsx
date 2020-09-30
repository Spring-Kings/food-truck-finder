import React, {Component} from 'react'

type Props = {
    elementNames: string[],
    submitUrl: string,
    submitCallback?: (formData: any, response: Response) => void;
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
        console.log(process.env.FOOD_TRUCK_API_URL);
        fetch(this.props.submitUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.formData)
        })
            .then(response => {
                if (this.props.submitCallback)
                    this.props.submitCallback(this.state.formData, response);
            })
            .catch(fail => this.setState({result: "failed"}));

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