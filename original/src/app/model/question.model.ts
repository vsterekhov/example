import {Survey} from "./survey.model";
import {Choice} from "./choice.model";
import {HasPosition} from "./has-position.model";

export interface Question extends HasPosition {
    id?: number;
    question: string;
    survey?: Survey;
    type: string;
    settings?: any;
    createdAt?: Date;
    choices: Choice[];
    votesNumber: number;
}
