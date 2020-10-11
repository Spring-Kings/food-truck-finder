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
    return toUserInfo(parsed);
}

export default getUserInfo;