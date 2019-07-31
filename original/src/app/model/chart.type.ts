import {Enum, EnumValue} from 'ts-enums';

export class ChartType extends EnumValue {
    constructor(name: string) {
        super(name);
    }
}

class ChartTypesEnum extends Enum<ChartType> {

    BAR_CHART: ChartType = new ChartType('Гистограмма');
    PIE_CHART: ChartType = new ChartType('Круговая диаграмма');

    constructor() {
        super();
        this.initEnum('ChartType');
    }

    isBarChart(type: string): boolean {
        return type === this.BAR_CHART.propName;
    }

    isPieChart(type: string): boolean {
        return type === this.PIE_CHART.propName;
    }
}

export const ChartTypes: ChartTypesEnum = new ChartTypesEnum();
