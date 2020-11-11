import { RouteLocation } from "../components/map/route-map/RouteLocation";
import { backendToFrontend } from "../components/map/route-map/RouteLocation";
import api from "../util/api";

export const getNearbyTruckLocations = async (onFail: (err: any) => void) => {
    let result: RouteLocation[] = [];
    try {
        let ptId: number = 0;
        let trucks: any = (await api.get(`/truck/nearby`)).data.map((truck: any) => truck.id);
        console.log(trucks)
        let result = (await api.post(`/truck/locations`, trucks)).data.map((pt: any) => backendToFrontend(pt, ptId++));
        console.log(result);
    } catch(err) {
        result = []
        onFail(err);
    }
    return result;
};
