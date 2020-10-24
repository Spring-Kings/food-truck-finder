import { frontendToBackend } from "../../components/map/route-map/RouteLocation";

interface Review {
    reviewId: number;
    userId: number;
    truckId: number;
    starRating: number;
    costRating: number;
    review: string;
    timestamp: Date;
}

export function emptyReview(): Review {
    return {
        reviewId: 0,
        userId: 0,
        truckId: 0,
        starRating: 0,
        costRating: 0,
        review: "",
        timestamp: new Date()
    };
};

export function backendToFrontend(obj: any): Review {
    return {
        
    };
}

export default Review;