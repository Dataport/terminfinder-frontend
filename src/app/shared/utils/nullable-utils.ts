export class NullableUtils {
  /**
   * Detect if submitted instance is null or undefined
   * @param  obj<T>
   * @return {boolean} true if instance is null or undefined. otherwise false.
   */
  public static isObjectNullOrUndefined<T>(obj: T): boolean {
    return obj === null || obj === undefined;
  }

  /**
   * Detect if submitted array is null or undefined or empty
   * @param arr<T[]>
   * @return {boolean} true if instance is null or undefined or empty. otherwise false.
   */
  public static isArrayNullOrEmpty<T>(arr: T[]): boolean {
    return this.isObjectNullOrUndefined(arr) || arr.length === 0;
  }

  /**
   * Detect if submitted string is null or undefined or empty
   * @param {string} value
   * @return {boolean} true if instance is null or undefined or empty. otherwise false.
   */
  public static isStringNullOrEmpty(value: string): boolean {
    return this.isObjectNullOrUndefined(value) || value === '';
  }

  /**
   * Detect if string is null or undefined or contains only white spaces.
   * @param {string} value
   * @return {boolean} true if instance is null or undefined or contains only white spaces. otherwise false.
   */
  public static isStringNullOrWhitespace(value: string): boolean {
    return this.isObjectNullOrUndefined(value) || !/\S/.test(value);
  }
}
