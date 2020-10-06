import { AnyAction, bindActionCreators, Dispatch } from 'redux'

/**
 * Interface providing the actions that are used by the UserDashboard to update the store.
 */
interface UserDashboardD2P {
    addTruck: (name: string) => void;
}

// Create a constant set of methods to dispatch on
const dispatcher: UserDashboardD2P = {
    addTruck: (name: string) => {
        return (dispatch: Dispatch<AnyAction>) => {
            // Axios calls go here; return the promise.
            alert("I thunk here...");
        }
    }
};
export default dispatcher;
