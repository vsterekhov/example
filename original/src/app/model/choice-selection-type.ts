import {Enum, EnumValue} from 'ts-enums';

export class ChoiceSelectionType extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

class ChoiceSelectionTypesEnum extends Enum<ChoiceSelectionType> {

  SINGLE: ChoiceSelectionType = new ChoiceSelectionType('Переключатель');
  MULTIPLE: ChoiceSelectionType = new ChoiceSelectionType('Множественный выбор');

  constructor() {
    super();
    this.initEnum('ChoiceSelectionTypes');
  }

  getDescription(name: string) {
    switch (name) {
      case this.SINGLE.propName:
        return this.SINGLE.description;

      default:
        return this.MULTIPLE.description;
    }
  }
}

export const ChoiceSelectionTypes: ChoiceSelectionTypesEnum = new ChoiceSelectionTypesEnum();
