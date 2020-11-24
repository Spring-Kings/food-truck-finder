import loggedInUser from "../util/token";
import Form from "../components/Form";
import React from 'react'
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Switch,
    TextField
} from '@material-ui/core';
import {AxiosResponse} from 'axios';
import {privacySettingDisplayString, queryUser, User} from "../api/User";

type PageState = {
    editMode: boolean,
    error: string | null,
    user: User | null,
    submitResultText: string | null;
};

type PageProps = {};

class AccountPageComponent extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            editMode: false,
            error: null,
            submitResultText: null,
            user: null
        };
    }

    async componentDidMount() {
        await this.refreshUserInfo();
    }

    render() {
        if (this.state.user == null) {
            return <p>Please wait...</p>
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
                        <FormControl>
                            <Select label="New Privacy Setting" name="newPrivacySetting" defaultValue="PUBLIC">
                                <MenuItem value="PUBLIC">Public</MenuItem>
                                <MenuItem value="USERS_ONLY">Users Only</MenuItem>
                                <MenuItem value="PRIVATE">Private</MenuItem>
                            </Select>
                            <FormHelperText>New Privacy Setting</FormHelperText>
                        </FormControl>
                        <FormControlLabel
                          control={<Switch name="newOwnerStatus"/>}
                          label="Secondary"
                        />
                    </Form>
                    {resultP}
                </div>
            }

            return (
              <div>
                  <h2>Hello, {this.state.user.username}!</h2>
                  <h4>Current user information:</h4>
                  <Grid container alignItems="flex-start">
                      <Grid item>
                          ID: {this.state.user.id}
                      </Grid>
                      <Grid item>
                          Email: {this.state.user.email}
                      </Grid>
                      <Grid item>
                          Privacy Setting: {privacySettingDisplayString(this.state.user)}
                      </Grid>
                      <Grid item>
                          Is Owner? {this.state.user.owner ? "Y" : "N"}
                      </Grid>
                  </Grid>

                  <Button variant="contained" onClick={this.toggleEditMode}>Edit</Button>
                  {editForm}
              </div>
            )
        }
    }

    onSubmitSuccess = async (formData: any, resp: AxiosResponse<any>) => {
        if (resp.data === true) {
            this.setState({submitResultText: "Saved user info"});
        } else {
            this.setState({submitResultText: "Failed to save user info"});
        }
        await this.refreshUserInfo();
    }

    toggleEditMode = () => {
        this.setState({editMode: !this.state.editMode});
    }

    refreshUserInfo = async () => {
        const curUser = loggedInUser();
        if (!curUser) {
            this.setState({
                error: "You are not currently logged in."
            });
        } else {
            const user = await queryUser(curUser.userID);
            console.log(user);
            if (user != null)
                this.setState({user});
            else
                this.setState({error: "Couldn't get user info"});
        }
    }
}

function AccountPage() {
    return (
        <AccountPageComponent/>
    )
}

export default AccountPage;