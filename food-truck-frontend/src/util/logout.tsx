function logout() {
    sessionStorage.removeItem("authToken");
}

export default logout;