import React from 'react'
import api from '../util/api'

type State = {
    coolInfo: string;
}

class UserInfoPageComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {coolInfo: ""};
    }

    componentDidMount() {
        api.get('/authtest2')
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