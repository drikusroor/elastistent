export type TimeType = "a" | "d" | "n";

export type ElasticPoint = {
  tooth: number;
  outside: boolean;
}

export type Elastic = {
  teeth: ElasticPoint[];
  type: number;

  /*
   * Which time of day the elastic should be worn
   * 24h: 24 hours a day
   * daytime: only during the day
   * nighttime: only during the night
   *   (emojis are used for display)
   */
  time: TimeType;

  /*
   * Placed on the outer side of the teeth or inner side
   */
  outer?: boolean;
};