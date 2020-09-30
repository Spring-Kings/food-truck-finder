import axios from "axios";

function logout() {
    const id = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (id && token) {
        axios.post(`${process.env.FOOD_TRUCK_API_URL}/` + "logout", {id, token});
    }

    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
}

export default logout;