import { Presenter } from "./presenter.model";
import { Question } from "./question.model";

export interface Survey {
  id?: number;
  name: string;
  code?: number;
  respondents?: number;
  vote?: number;
  votes?: number;
  voting?: boolean;
  type: string;
  presenter: Presenter;
  createdAt?: Date;
  updatedAt?: Date;
  settings?: string;
  questions?: Array<Question>;
  questionsNumber?: number;
  activeQuestionId?: number;
}
