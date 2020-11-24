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

export async function queryUser(id: number): Promise<User | null> {
  const result = await api.get(`/user/${id}`)
    .catch(err => {
      console.log("Error getting user: " + JSON.stringify(err))
    });
  if (result && result.data && result.data.username && result.data.email && result.data.owner && result.data.privacySetting)
    return result.data;
  console.log("Invalid response getting user: " + JSON.stringify(result));
  return null;
}