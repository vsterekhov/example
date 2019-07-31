import {HasPosition} from "./has-position.model";

export interface Choice extends HasPosition {
  id?: number;
  label: string;
  score: number;
}
