import { RouteLocation } from "../components/map/route-map/RouteLocation";
import { backendToFrontend } from "../components/map/route-map/RouteLocation";
import api from "../util/api";

export const getNearbyTrucks = async (onFail: (err: any) => void) => {
    let result: RouteLocation[];
    try {
        let ptId: number = 0;
        result = (await api.get(`/nearby-trucks`)).data.map((pt: any) => backendToFrontend(pt, ptId++));
    } catch(err) {
        result = []
        onFail(err);
    }
    return result;
};
