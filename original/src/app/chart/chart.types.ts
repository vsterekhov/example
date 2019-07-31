export interface ChartConfig {
    type: string;
    data: any;
    options: any;
}

export class  ChartActions {
    static get DRAW(): ChartAction {
        return {draw: true};
    }

    static get UPDATE(): ChartAction {
        return {update: true};
    }
}

export interface ChartAction {
    draw?: boolean;
    update?: boolean;
}
