export interface UserNotification {
  /** Variant of client Code **/
  readonly derivateTitle: string;
  /** Start time of notification in UTC ISO String. Example 2021-03-24T17:00:00.000Z **/
  readonly startTime: string;
  /** End time of notification in UTC ISO String **/
  readonly endTime: string;
  /** Displayed message **/
  readonly message: string;
}

export const userNotifications: Array<UserNotification> = [];
