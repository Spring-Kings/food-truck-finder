import jwt_decode from 'jwt-decode'

type UserInfo = {
    readonly username: string,
    readonly userID: number
};

function toUserInfo(obj: any): UserInfo | null {
    if (typeof obj.sub === 'string' && typeof obj.userID === 'number')
        return {username: obj.sub, userID: obj.userID};
    return null;
}

function getUserInfo(): UserInfo | null {
    const token = localStorage.getItem('authToken');
    if (token === null) {
        return null;
    }
    const parsed: any = jwt_decode(token);
    // If no exp. field or if token is expired
    if (typeof (parsed.exp) !== 'number' || Date.now() >= parsed.exp * 1000) {
        localStorage.removeItem('authToken');
        return null;
    }

    return toUserInfo(parsed);
}

export default getUserInfo;