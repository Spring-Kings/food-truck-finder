import api from "../util/api";
import User, {UserMeta} from "../domain/User";
import {parse} from "../util/type-checking";
import * as t from 'io-ts'
import Truck, {TruckMeta} from "../domain/Truck";

export async function loadUserById(id: number, onFail: (e) => void = console.log): Promise<User | null> {
  const result = await api.get(`/user/${id}`).catch(onFail);
  if (!result || !result.data) {
    onFail("Couldn't load user by id");
    return null;
  }
  return parse(UserMeta, result.data)
}

export async function loadUserByName(username: string, onFail: (e) => void = console.log): Promise<User | null> {
  const result = await api.get('/search-usernames?username=' + username).catch(onFail);
  if (!result || !result.data) {
    onFail("Couldn't load user by name");
    return null;
  }

  return parse(UserMeta, result.data);
}

export async function getUsername(userId: number, onFail: (e) => void = console.log): Promise<string | null> {
  if (userId === -1)
    return 'Anonymous';

  try {
    const name: any = await api.request({
      url: `/get-username?id=${userId}`,
      method: "GET",
    });
    return parse(t.string, name.data);
  } catch (e) {
    onFail(e);
    return null;
  }
}

export async function loadSubscriptionsForUser(username: string, onFail: (e) => void = console.log): Promise<Truck[] | null> {
  try {
    const resp = await api.get(`/user/subscriptions?username=${username}`);
    if (resp.data)
      return parse(t.array(TruckMeta), resp.data);
  } catch (e) {
    onFail(e);
    return null;
  }
  onFail("Couldn't load subscriptions for user");
  return null;
}