/** TODO make pfp not any */

/**
 * React state of the UserDashboard
 */
interface UserDashboardState {
  username: string;
  pfp: any;

  // This says: let me index into this interface using strings, but only to access
  // the elements that are here, not to add new ones.
  // Learned from: https://blog.logrocket.com/writing-idiomatic-typescript/
  readonly [x: string]: string | any;
}

export default UserDashboardState;
