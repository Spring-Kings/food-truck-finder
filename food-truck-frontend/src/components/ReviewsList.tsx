import React, {Component} from 'react';
import axios, {AxiosResponse} from 'axios'
import index from "jest-leak-detector";

const reviewsJSON = [{
    "id": "",
    "userId": "",
    "truckId": "",
    "starRating": "",
    "costRating": "",
    "reviewText": "",
    "day_time": ""
}]

type Props = {
    username: string | string[] | undefined
}

type State = {
    data : {
    "id": string,
    "userId": string,
    "truckId": string,
    "starRating": string,
    "costRating": string,
    "reviewText": string,
    "day_time": string
    }[]
}





class ReviewsList extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {data: reviewsJSON};
    }


    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/user/reviews`, {
            params: {
                username: this.props.username,
            }
        }).then((response) => {
                this.setState({ data: response.data })
        }).catch((error) => {
                this.setState({data: error.toString()})
        });
    }

    renderReviewElement(index: number){
        return(
            <div>
                <p>{this.state.data[index].reviewText}</p>
            </div>
        );
    }

    render() {
        return (
            <div>
            <h2>Reviews</h2>
                <div>
                    <p>{this.state.data.map((value,index) => this.renderReviewElement(index))}</p>
                </div>
            </div>
        );
    }
}

export default ReviewsList;