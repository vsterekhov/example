import {
    Component, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
    ViewChild
} from "@angular/core";
import {ChartAction, ChartConfig} from "../chart.types";
import {Question} from "../../model/question.model";
import {ChartTypes} from "../../model/chart.type";
import {ColorPalette} from "../ColorPalette";
import {DOCUMENT} from "@angular/common";

declare var Chart;

@Component({
    selector: 'socs-multi-choices',
    templateUrl: './multi-choices.component.html',
    styleUrls: ['./multi-choices.component.scss']
})
export class MultiChoicesComponent implements OnInit, OnChanges, OnDestroy {
    config: ChartConfig = {
        type: '',
        data: {},
        options: {}
    };

    private readonly colors;

    ctx: HTMLElement;
    chart;

    @ViewChild('canvas')
    set chartCtx(canvas) {
        this.ctx = canvas.nativeElement;
    }

    @Input() question: Question;
    @Input() action: ChartAction;

    private delta: number;

    constructor(colorPalette: ColorPalette, @Inject(DOCUMENT) private readonly document: Document) {
        this.colors = colorPalette.colors20;
    }

    ngOnInit() {
        this.setGlobalChartSettings();
        this.drawChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.action && !changes.action.firstChange) {
            if (changes.action.currentValue.draw) {
                this.drawChart();

            } else if (changes.action.currentValue.update) {
                this.updateChart();
            }
        }
    }

    ngOnDestroy() {
        this.chart && this.chart.destroy();
    }

    private setGlobalChartSettings() {
        Chart.defaults.global.defaultFontSize = 16;
        Chart.defaults.global.title.fontSize = 24;
        Chart.defaults.global.title.fontColor = '#333';
        Chart.defaults.global.title.fontStyle = 'normal';
        Chart.defaults.global.title.fontFamily = "'PT Sans Regular', 'PT Sans', 'Helvetica Neue'";

        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.legend.position = 'right';
        Chart.defaults.global.legend.labels.fontSize = 12;
        /* количество голосов */
        Chart.defaults.global.plugins.datalabels.color = 'black';
        Chart.defaults.global.plugins.datalabels.font.size = 20;
        Chart.defaults.global.plugins.datalabels.font.weight = 'bold';

        Chart.defaults.global.tooltips.enabled = false;

        Chart.pluginService.register([{
            afterInit(c) {
                if (c.config.type === "bar") {
                    /* chart.width -- общая ширина графика */
                    c.scales['x-axis-0'].options.ticks.fontSize = (c.chart.width * 36) / 2000;
                }
            }
        }]);
    }

    getColorBoxStyle(label) {
        return {
            backgroundColor: label.backgroundColor,
            border: '1px solid ' + label.borderColor
        };
    }

    private drawChart() {
        if (this.question.settings) {
            if (this.isBarChart()) {
                this.setBarChartConfig(this.question);
            } else if (this.isPieChart()) {
                this.setPieChartConfig(this.question);
            }
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(this.ctx, this.config);
        }
    }

    private updateChart() {
        if (this.isBarChart()) {
            const maxYTick = this.setBarChartData(this.question);

            if (maxYTick !== this.config.options.scales.yAxes[0].ticks.max) {
                this.config.options.scales.yAxes[0].ticks.max = maxYTick + maxYTick / this.delta;
            }

        } else if (this.isPieChart()) {
            this.setPieChartData(this.question);
            this.updatePieChartLabels();
        }

        this.chart.update();
    }

    private isBarChart(): boolean {
        return ChartTypes.isBarChart(this.question.settings.chartType);
    }

    private isPieChart(): boolean {
        return ChartTypes.isPieChart(this.question.settings.chartType);
    }

    private setBarChartConfig(question: Question) {
        this.config.type = "bar";
        const maxYTick = this.setBarChartData(question);
        this.setBarChartOptions({maxYTick});
    }

    private setPieChartConfig(question: Question) {
        this.config.type = "outlabeledPie";
        this.setPieChartData(question);
        this.setPieChartOptions();
    }

    private setBarChartData(question: Question): number {
        const choices = question.choices;
        const datasets = [{
            label: 'Кол-во голосов',
            data: [],
            backgroundColor: [],
            borderColor: []
        }];
        const labels = [];
        let maxYTick = 0;
        const lineLength = this.setLineLength(choices);

        choices.forEach((choice, idx) => {
            let label = [choice.label];

            if (choice.score === 0 && !question.settings.showzero) {
                return;
            }

            if (maxYTick < choice.score) {
                maxYTick = choice.score;
            }

            const i = idx % this.colors.length;

            if (choice.label.length > lineLength) {
                label = [];

                let oldPos = 0;

                for (let pos = lineLength; pos < choice.label.length; pos++) {
                    label.push(choice.label.substring(oldPos, pos));
                    oldPos = pos;
                    pos += lineLength;

                    if (pos > choice.label.length) {
                        label.push(choice.label.substring(oldPos, choice.label.length));

                        break;
                    }
                }
            }

            labels.push(label);
            datasets[0].data.push(choice.score);
            datasets[0].backgroundColor.push(this.colors[i]);
            let curcolor = (choice.score === 0) ? 'black' : this.colors[i];
            datasets[0].borderColor.push(curcolor);
        });

        this.config.data = {
            labels,
            datasets
        };
        maxYTick++;

        return maxYTick;
    }

    private setLineLength(choices) {
        let length = 0;
        choices.forEach((choice) => {
            // для ширины текста под столбцами
            //if (choice.score !== 0) {
                length++;
            //}
        });
        switch (length) {
            case 1:
                return 88;
            case 2:
                return 44;
            case 3:
                return 32;
            case 4:
                return 24;
            case 5:
                return 19;
            case 6:
                return 16;
            case 7:
                return 13;
            case 8:
                return 11;
            case 9:
                return 10;
        }
        return 9;
    }

    private setPieChartData(question: Question) {
        const choices = question.choices;
        const labels = [];

        const datasets = [{
            label: 'Кол-во голосов',
            data: [],
            backgroundColor: [],
            borderColor: []
        }];

        choices.forEach((choice, idx) => {
            const gap = 3;
            const lineLengthThreshold = 15;
            const labelLengthThreshold = 30;
            let label = choice.label.trim().replace(/\s+/g, ' ');

            if (choice.score === 0) {
                return;
            }

            const i = idx % this.colors.length;
            let resultLabel = '';

            if (label.length > labelLengthThreshold) {
                label = label.substr(0, labelLengthThreshold - 3) + '...';
            }

            if (label.length > lineLengthThreshold) {
                const lastIdxInFirst = label.lastIndexOf(' ', lineLengthThreshold - 1);
                const firstIdxInLast = label.indexOf(' ', lineLengthThreshold);

                if (lastIdxInFirst !== -1 && lastIdxInFirst > lineLengthThreshold - gap - 1) {
                    resultLabel = `${label.substring(0, lastIdxInFirst)}\n${label.substring(lastIdxInFirst + 1)}`;
                } else if (firstIdxInLast !== -1 && firstIdxInLast < lineLengthThreshold + gap) {
                    resultLabel = `${label.substring(0, firstIdxInLast)}\n${label.substring(firstIdxInLast + 1)}`;
                } else {
                    resultLabel = `${label.substring(0, lineLengthThreshold)}\n${label.substring(lineLengthThreshold)}`;
                }
            } else {
                resultLabel = label;
            }

            labels.push(resultLabel);
            datasets[0].data.push(choice.score);
            datasets[0].backgroundColor.push(this.colors[i]);
            datasets[0].borderColor.push(this.colors[i]);
        });

        this.config.data = {
            labels,
            datasets
        };
    }

    private setBarChartOptions(options: { maxYTick: number }) {
        if (window.innerHeight < 335) {
            this.delta = 2;
        } else {
            this.delta = 5;
        }
        this.config.options = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback() {
                            return '';
                        },
                        max: options.maxYTick + options.maxYTick / this.delta,
                    },
                    gridLines: {
                        display: false
                    },
                }],
                xAxes: [{
                    ticks: {
                        maxRotation: 0,
                        autoSkip: false,

                    },
                    gridLines: {
                        display: false
                    },
                    afterFit(axis) {
                        axis.paddingLeft = 0;
                        axis.paddingRight = 0;
                    },
                    barPercentage: 1,
                    categoryPercentage: 1,
                }]
            },
            plugins: {
                datalabels: {
                    display(context) {
                        const meta = context.chart.getDatasetMeta(context.datasetIndex);
                        return !meta.hidden && context.dataset.data[context.dataIndex] !== 0;
                    },
                    anchor: 'end',
                    align: 'end',
                    formatter(value, context) {
                        return value;
                    },
                    textAlign: 'center'
                }
            }
        };
    }

    private setPieChartOptions() {
        this.config.options = {
            responsive: true,
            onResize: () => this.updateChart(),
            maintainAspectRatio: false,
            zoomOutPercentage: 47,
            animation: {
                duration: 0
            },
            plugins: {
                datalabels: {
                    backgroundColor(context) {
                        return context.dataset.backgroundColor;
                    },
                    borderRadius: 100,
                    color: 'white',
                    display(context) {
                        return context.dataset.data[context.dataIndex] !== 0;
                    },
                    anchor: 'end',
                    align: 'start',
                    formatter(value) {
                        return value;
                    },
                    textAlign: 'center',
                    font: {
                        resizable: false,
                    }
                },
                legend: false,
                outlabels: {
                    text: '%l',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    color: 'black',
                    lineColor: '#ccc',
                    lineWidth: 1,
                    stretch: 30,
                    font: {
                        resizable: false,
                    }
                }
            }
        };

        this.updatePieChartLabels();
    }

    updatePieChartLabels() {
        const fontCalc: HTMLElement = document.getElementById("fontCalc");
        const style: CSSStyleDeclaration = getComputedStyle(fontCalc);

        const fontSize = Math.max(parseInt(style.fontSize), 18);
        const outlabelsStretch = 1.5 * fontSize;
        const outlabelsPadding = Math.round(4 / 30 * fontSize);

        this.config.options.plugins.outlabels.font.size = fontSize;
        this.config.options.plugins.outlabels.stretch = outlabelsStretch;
        this.config.options.plugins.outlabels.padding = outlabelsPadding;

        this.config.options.plugins.datalabels.font.size = fontSize;
    }

    @HostListener('window:resize')
    onWindowResize() {
        if ((window.innerHeight < 335 && this.delta === 5) || (window.innerHeight >= 335 && this.delta === 2)) {
            this.drawChart();
        }
    }
}
