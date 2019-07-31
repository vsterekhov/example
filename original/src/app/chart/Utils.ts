import {Injectable} from "@angular/core";

export interface CalcFontSizeOptions {
    scores: Array<number>;
    fontSizeMin?: number;
    fontSizeRange?: number;
}

export interface ScoreMap {
    [key: number]: number
}

@Injectable()
export class Utils {
    private readonly fontSizeMin = 10;
    private readonly fontSizeRange = 20;

    constructor() {
    }

    calcFontSize(options: CalcFontSizeOptions): { [key: number]: number } {
        const scoreMap = {};

        const fontSizeMin = options.fontSizeMin || this.fontSizeMin;
        const fontSizeRange = options.fontSizeRange || this.fontSizeRange;

        const fontSizeMax = fontSizeMin + fontSizeRange - 1;

        const minScore = Math.min(...options.scores);
        const maxScore = Math.max(...options.scores);
        const scoreStep = (maxScore - minScore) / (fontSizeRange - 1);

        if (scoreStep === 0) {
            scoreMap[options.scores[0]] = fontSizeMax;
        } else {
            const scores = [];
            for (let i = 0; i < fontSizeRange; i++) {
                const score = minScore + i * scoreStep;
                scores.push(Math.round(score));
            }

            for (let i = 0; i < scores.length; i++) {
                const score = scores[i];

                if (i > 0) {
                    const prevScore = scores[i - 1];
                    for (let scoreBetween = prevScore + 1; scoreBetween < score; scoreBetween++) {
                        scoreMap[scoreBetween] = fontSizeMin + i - 1;
                    }
                }

                scoreMap[score] = fontSizeMin + i;
            }
        }

        return scoreMap;
    }

    guid() {
        function _p8(s?: boolean) {
            const p = (Math.random().toString(16) + "000000000").substr(2, 8);

            return s ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    }
}
