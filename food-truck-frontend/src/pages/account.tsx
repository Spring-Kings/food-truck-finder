import CoolLayout from '../components/CoolLayout'
import api from '../util/api'
import getUserInfo from "../util/token";
import Form from "../components/Form";
import React from 'react'
import {Button, TextField} from '@material-ui/core';
import {AxiosResponse} from 'axios';

type PageState = {
    done: boolean,
    editMode: boolean,
    error: string | null,
    username: string,
    email: string,
    id: number,
    submitResultText: string | null;
    debugText: string | null
};

type PageProps = {};

class AccountPageComponent extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            done: false,
            editMode: false,
            error: null,
            username: "",
            email: "",
            id: 0,
            submitResultText: null,
            debugText: null
        };
    }

    componentDidMount() {
        this.refreshUserInfo();
    }

    render() {
        if (!this.state.done) {
            return <div/>
        } else if (this.state.error) {
            return <h2>Error: {this.state.error}</h2>
        } else {
            let editForm = null;
            if (this.state.editMode) {
                const resultP = (this.state.submitResultText !== null) ? <p>{this.state.submitResultText}</p> : null;
                editForm = <div>
                    <Form submitUrl="/user" submitMethod="PUT" onSuccessfulSubmit={this.onSubmitSuccess}>
                        <TextField required label="Current Password" type="password" name="password"/>
                        <TextField label="New Password" type="password" name="newPassword"/>
                        <TextField label="New Email" name="newEmail"/>
                    </Form>
                    {resultP}
                </div>
            }

            return (
                <div>
                    <h2>Hello, {this.state.username}!</h2>
                    <p>Your ID is {this.state.id} and your email is {this.state.email}.</p>
                    <Button variant="contained" onClick={this.toggleEditMode}>Edit</Button>
                    {editForm}
                    <p>Here is some nerdy debug information:</p>
                    <pre>{this.state.debugText}</pre>
                </div>
            )
        }
    }

    onSubmitSuccess = (formData: any, resp: AxiosResponse<any>) => {
        if (resp.data === true) {
            this.setState({submitResultText: "Success"});
        } else {
            this.setState({submitResultText: "Failed"});
        }
        this.refreshUserInfo();
    }

    toggleEditMode = () => {
        this.setState({editMode: !this.state.editMode});
    }

    refreshUserInfo = () => {
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
                })
                .catch(err => {
                    this.setState({
                        done: true,
                        error: "Failed to connect to server."
                    })
                });
        }
    }
}

function AccountPage() {
    return (
        <CoolLayout>
            <AccountPageComponent/>
        </CoolLayout>

    )
}

export default AccountPage;