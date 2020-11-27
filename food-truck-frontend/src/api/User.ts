import api from "../util/api";

export interface User {
  id: number,
  username: string,
  email: string
  owner: boolean,
  privacySetting: "PUBLIC" | "USERS_ONLY" | "PRIVATE"
}

export function privacySettingDisplayString(u: User): string {
  if (u.privacySetting === 'PUBLIC')
    return 'Public';
  if (u.privacySetting === 'USERS_ONLY')
    return 'Users Only';
  if (u.privacySetting == 'PRIVATE')
    return 'Private';
  throw 'Invalid privacy setting';
}

export function parseUser(obj: any): User|null {
  if (obj && obj.username != null && obj.email != null && obj.owner != null && obj.privacySetting != null)
    return obj;
  console.log("Invalid user object");
  console.log(obj);
  return null;
}

export async function queryUserById(id: number): Promise<User | null> {
  const result = await api.get(`/user/${id}`)
    .catch(err => {
      console.log("Error getting user: " + JSON.stringify(err))
    });
  return result ? parseUser(result.data) : null;
}

export async function queryUserByName(username: string): Promise<User | null> {
  const result = await api.get('/search-usernames?username=' + username)
      .catch(err => {
        console.log("Error getting user: " + JSON.stringify(err))
      });
  return result ? parseUser(result.data) : null;
}