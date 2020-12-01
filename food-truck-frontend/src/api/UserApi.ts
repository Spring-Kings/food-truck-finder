import api from "../util/api";
import User, {UserMeta} from "../domain/User";
import {parse} from "../util/type-checking";
import * as t from 'io-ts'
import Truck, {TruckMeta} from "../domain/Truck";

export async function loadUserById(id: number): Promise<User | null> {
  const result = await api.get(`/user/${id}`)
    .catch(err => {
      console.log("Error getting user: " + JSON.stringify(err))
    });

  if (!result)
    return null;

  return parse(UserMeta, result.data)
}

export async function loadUserByName(username: string): Promise<User | null> {
  const result = await api.get('/search-usernames?username=' + username)
    .catch(err => {
      console.log("Error getting user: " + JSON.stringify(err))
    });
  if (!result)
    return null;

  return parse(UserMeta, result.data);
}

export async function getUsername(userId: number): Promise<string | null> {
  if (userId === -1)
    return 'Anonymous';

  const name: any = await api.request({
    url: `/get-username?id=${userId}`,
    method: "GET",
  });
  return parse(t.string, name.data);
}

export async function loadSubscriptionsForUser(username: string): Promise<Truck[] | null> {
  const resp = await api.get(`/user/subscriptions?username=${username}`);
  if (resp.data)
    return parse(t.array(TruckMeta), resp.data);
  return null;
}