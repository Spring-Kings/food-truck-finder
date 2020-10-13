/** TODO: fix pfp to not be an any type */

import UserSubscription from "../../../../domain/Subscription";

/**
 * Props used by the UserDashboardComponent
 */
interface UserDashboardProps {
  username: string;
  pfp: any;

  subscribedTrucks: UserSubscription[];
  isOwner: boolean;

  // This says: let me index into this interface using strings, but only to access
  // the elements that are here, not to add new ones.
  // Learned from: https://blog.logrocket.com/writing-idiomatic-typescript/
  readonly [x: string]: string | string[] | any;
}

export default UserDashboardProps;
