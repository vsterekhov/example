import {Enum, EnumValue} from 'ts-enums';

export class SurveyPace extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

class SurveyPacesEnum extends Enum<SurveyPace> {

  AUDIENCE: SurveyPace = new SurveyPace('Свободное голосование');
  PRESENTER: SurveyPace = new SurveyPace('Спикер (ручное)');

  constructor() {
    super();
    this.initEnum('SurveyPaces');
  }
}

export const SurveyPaces: SurveyPacesEnum = new SurveyPacesEnum();
