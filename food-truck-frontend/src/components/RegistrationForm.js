import React, {Component} from 'react'

class RegistrationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: null,
            formData: {
                username: "",
                password: "",
                email: ""
            }
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label htmlFor="username">Username:</label></td>
                            <td><input name="username" onChange={this.onValueChanged}
                                       value={this.state.formData.username}/></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="password">Password:</label></td>
                            <td><input name="password" onChange={this.onValueChanged}
                                       value={this.state.formData.password}/></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="email">Email:</label></td>
                            <td><input name="email" onChange={this.onValueChanged} value={this.state.formData.email}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <button type="submit">Submit</button>
                </form>
                <div>{this.state.result}</div>
            </div>

        )
    }

    onSubmit(event) {
        fetch('http://localhost:8080/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.formData)
        })
            .then(response => response.text())
            .then(text => this.setState({result: text}))
            .catch(fail => this.setState({result: "failed"}));

        event.preventDefault();
    }

    onValueChanged(event) {
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

export default RegistrationForm;