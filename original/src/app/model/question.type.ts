import {Enum, EnumValue} from 'ts-enums';

export class QuestionType extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

class QuestionTypesEnum extends Enum<QuestionType> {

  MULTI_CHOICES: QuestionType = new QuestionType('Закрытый вопрос');
  WORD_CLOUD: QuestionType = new QuestionType('Открытый вопрос');
  OPEN_ENDED: QuestionType = new QuestionType('Свободный вопрос');
  // QA: QuestionType = new QuestionType('Вопросы аудитории'); // TODO left for future use

  constructor() {
    super();
    this.initEnum('QuestionTypes');
  }

  getDescription(type: string) {
    switch (type) {
      case this.MULTI_CHOICES.propName:
        return this.MULTI_CHOICES.description;

      case this.WORD_CLOUD.propName:
        return this.WORD_CLOUD.description;

      // case this.QA.propName: // TODO left for future use
      //   return this.QA.description;

      default:
        return this.OPEN_ENDED.description;
    }
  }

  isMultiChoices(type: string): boolean {
    return type === this.MULTI_CHOICES.propName;
  }

  isWordCloud(type: string): boolean {
    return type === this.WORD_CLOUD.propName;
  }

  isOpenEnded(type: string): boolean {
    return type === this.OPEN_ENDED.propName;
  }
}

export const QuestionTypes: QuestionTypesEnum = new QuestionTypesEnum();
