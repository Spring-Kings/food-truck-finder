import React from 'react'
import api from '../util/api'
import getUserInfo from "../util/token";

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
        const userInfo = getUserInfo();
        if (!userInfo) {
            this.setState({
                done: true,
                error: "You are not currently logged in."
            });
        } else {
            api.get(`/user/${userInfo.userID}`)
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