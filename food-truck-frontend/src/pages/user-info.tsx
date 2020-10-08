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
        const token = sessionStorage.getItem('authToken');
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/authtest2`, {
            headers: (token) ? {'Authorization': token} : {}
        })
            .then(response => {
                this.setState({coolInfo: response.data});
            })
            .catch(error => {
                this.setState({coolInfo: `Something bad happened: ${JSON.stringify(error)}`});
            })
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