import React from 'react'
import axios from 'axios'

type State = {
    coolInfo: string;
}

class UserInfoPageComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {coolInfo: ""};
    }

    componentDidMount() {
        const id = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (id && token) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/user/${id}`, {
                params: {
                    viewerId: id,
                    viewerToken: token
                }
            })
                .then(response => {
                    this.setState({coolInfo: JSON.stringify(response, null, 4)});
                })
                .catch(error => {
                    this.setState({coolInfo: "Failed to authenticate: " + JSON.stringify(error, null, 4)});
                })
        } else {
            this.setState({coolInfo: "Not logged in."});
        }
    }

    render() {
        return (
            <div>
                <h1>User Info</h1>
                <pre>{this.state.coolInfo}</pre>
            </div>
        )
    }
}

function UserInfoPage() {
    return (
        <UserInfoPageComponent/>
    )
}

export default UserInfoPage;