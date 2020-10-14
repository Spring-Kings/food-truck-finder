import React from 'react';
import ReviewsList from "./ReviewsList";
import SubscriptionList from "./SubscriptionList";
import api from "../util/api";

type UserDetailsProps = {
    username: string
}

type UserDetailsState = {
    data: {username: string,
            id: string,
            email: string}[];
}

class UserDetails extends React.Component<UserDetailsProps, UserDetailsState>{
    constructor(props: UserDetailsProps) {
        super(props);
        this.state = {data: [{username: "", id: "", email: ""}]}
    }

    componentDidMount() {
        api.get(`/search-usernames?username=${this.props.username}`)
            .then(response => {
                this.setState({data: response.data});
            }).catch(error => {
             console.log(error.toString())
        });
    }

    render() {
        if(this.state.data.length == 0){
            return(
                <div>
                    <h1>User Doesn't Exist</h1>
                </div>
            );
        }

        return(
            <div>
                <h1>{this.props.username}</h1>
                <ReviewsList username={this.props.username}/>
                <br/>
                <SubscriptionList username={this.props.username}/>
            </div>
        );
    }
}

export default UserDetails;