import {Injectable} from "@angular/core";

@Injectable()
export class ColorPalette {
    constructor() {
    }

    createPalette(size) {
        const colors = [];

        for (let i = 0; i < size; i++) {
            const h = (i / size * 240).toFixed(2);
            const color = `hsl( ${h}, 100%, 50% )`;

            colors.push(color);
        }

        return colors;
    }

    nextColor(i, size) {
        const h = (i / size * 240).toFixed(2);

        return `hsl( ${h}, 100%, 50% )`;
    }

    get colors20() {
        return [
            '#1f77b4',
            '#aec7e8',
            '#ff7f0e',
            '#ffbb78',
            '#2ca02c',
            '#98df8a',
            '#d62728',
            '#ff9896',
            '#9467bd',
            '#c5b0d5',
            '#8c564b',
            '#c49c94',
            '#e377c2',
            '#f7b6d2',
            '#7f7f7f',
            '#c7c7c7',
            '#bcbd22',
            '#dbdb8d',
            '#17becf',
            '#9edae5'
        ];
    }

    get colors6() {
        return [
            '#d62728',
            '#ff7f0e',
            '#2ca02c',
            '#1f77b4',
            '#9467bd',
            '#7f7f7f'
        ];
    }

    getColors20Generator(): () => any {
        return this.getColorsGenerator(this.colors20);
    }

    getColors6Generator(): () => any {
        return this.getColorsGenerator(this.colors6);
    }

    private getColorsGenerator(colors): () => any {
        let i = 0;

        return function (): any {
            if (i % colors.length === 0) {
                i = 0;
            }

            const result = colors[i];

            i++;

            return result;
        };
    }
}
