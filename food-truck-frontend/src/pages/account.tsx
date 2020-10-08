import React from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

type PageState = {
    done: boolean,
    error: string | null,
    username: string,
    email: string,
    id: number,
    debugText: string | null
};

type PageProps = {};

class AccountPageComponent extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            done: false,
            error: null,
            username: "",
            email: "",
            id: 0,
            debugText: null
        };
    }

    componentDidMount() {
        const token = sessionStorage.getItem('authToken');
        const decoded: any = token ? jwt_decode(token) : null;
        if (!decoded) {
            this.setState({
                done: true,
                error: "You are not currently logged in."
            });
        } else {
            console.log(`Username = ${decoded.sub}, id = ${decoded.userID}`);
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/user/${decoded.userID}`)
                .then(response => {
                    this.setState({
                        done: true,
                        username: response.data.username,
                        email: response.data.email,
                        id: response.data.id,
                        debugText: JSON.stringify(response.data, null, 4)
                    })
                });
        }

    }

    render() {
        if (!this.state.done) {
            return <div/>
        } else if (this.state.error) {
            return <h2>Error: {this.state.error}</h2>
        } else {
            return (
                <div>
                    <h2>Hello, {this.state.username}!</h2>
                    <p>Your ID is {this.state.id} and your email is {this.state.email}.</p>
                    <p>Here is some nerdy debug information:</p>
                    <pre>{this.state.debugText}</pre>
                </div>
            )
        }
    }
}

function AccountPage() {
    return (
        <AccountPageComponent/>
    )
}

export default AccountPage;