import * as t from 'io-ts'

export const UserMeta = t.type({
  id: t.number,
  username: t.string,
  email: t.string,
  owner: t.boolean,
  privacySetting: t.union([t.literal("PUBLIC"), t.literal("USERS_ONLY"), t.literal("PRIVATE")])
}, "User")

export type User = t.TypeOf<typeof UserMeta>

export function privacySettingDisplayString(u: User): string {
  if (u.privacySetting === 'PUBLIC')
    return 'Public';
  if (u.privacySetting === 'USERS_ONLY')
    return 'Users Only';
  if (u.privacySetting == 'PRIVATE')
    return 'Private';
  throw 'Invalid privacy setting';
}

export default User;