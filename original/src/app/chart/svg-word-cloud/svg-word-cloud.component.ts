import * as d3 from "d3";
import * as svgIntersections from "svg-intersections";

import {
    OnInit, OnDestroy, OnChanges, Component, ElementRef, Input, SimpleChanges, ViewChild
} from "@angular/core";

import {Question} from "../../model/question.model";
import {ChartAction} from "../chart.types";
import {CalcFontSizeOptions, ScoreMap, Utils} from "../Utils";
import {ColorPalette} from "../ColorPalette";
import {fromEvent} from "rxjs/observable/fromEvent";
import {debounceTime} from "rxjs/operators/debounceTime";
import {Subscription} from "rxjs/Subscription";

const fontFamilyText = "font-family";
const textAnchorText = "text-anchor";

@Component({
    selector: 'socs-svg-word-cloud',
    templateUrl: './svg-word-cloud.component.html',
    styleUrls: ['./svg-word-cloud.component.scss']
})
export class SvgWordCloudComponent implements OnInit, OnDestroy, OnChanges {
    @Input() question: Question;
    @Input() action: ChartAction;

    @ViewChild('chartContainer') chartContainer: ElementRef;

    private width: number;
    private height: number;
    private svg: any;
    private svgTemp: any;
    private readonly tickId;
    private tickDataNumber = 3;
    private transitionDuration;
    private redrawOnResizeSubscription: Subscription;

    constructor(private readonly utils: Utils, private readonly colorPalette: ColorPalette) {
    }

    ngOnInit() {
        this.draw();
        this.startRedrawOnResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.action && !changes.action.firstChange) {
            if (changes.action.currentValue.draw) {
                this.draw();

            } else if (changes.action.currentValue.update) {
                this.draw();
            }
        }
    }

    draw() {
        this.clearTemp();

        if (this.svg) {
            this.svg.selectAll("*").remove();
        } else {
            this.svg = this.selectChartContainer().append("svg")
                .attr("width", "100%")
                .attr("height", "98%")
                .attr("preserveAspectRatio", "xMidYMid meet");
        }

        this.svg.append("g")
            .attr("class", "g-cloud");

        this.update();
    }

    update(redraw?: boolean) {
        this.setOptions();

        const data: SvgWordCloudDataArray = this.getData();

        this.setColorPaletteByData(data);
        this.setAnimationSetting(data.length);
        this.calcCoordinates(data);
    }

    private setOptions() {
        const rect = this.getChartContainerRect();

        this.width = rect.width;
        this.height = rect.height;
    }

    private getChartContainerRect() {
        return this.chartContainer.nativeElement.getBoundingClientRect();
    }

    getData(): SvgWordCloudDataArray {
        const data: SvgWordCloudDataArray = [];

        for (const choice of this.question.choices) {
            data.push({
                text: choice.label,
                score: choice.score
            });
        }

        data.sort((a, b) => b.score - a.score);

        this.calcFontSize(data);

        return data;
    }

    private setColorPaletteByData(data) {
        const colorsGenerator = this.colorPalette.getColors6Generator();
        data.map((d) => {
            d.color = colorsGenerator();
        });
    }

    private setColorPaletteByFontSize(data) {
        const fontSizes = [];

        data.map((d) => {
            if (!fontSizes.includes(d.fontSize)) {
                fontSizes.push(d.fontSize);
            }
        });

        const fontSizeMap = {};

        fontSizes.forEach((fontSize, i) => {
            fontSizeMap[fontSize] = this.colorPalette.nextColor(i, fontSizes.length);
        });

        data.map((d) => {
            d.color = fontSizeMap[d.fontSize];
        });
    }

    private calcFontSize(data: SvgWordCloudDataArray) {
        const scores = [];

        for (const d of data) {
            scores.push(d.score);
        }

        const calcFontSizeOptions: CalcFontSizeOptions = {
            scores
        };

        const sizeMap: ScoreMap = this.utils.calcFontSize(calcFontSizeOptions);

        for (const d of data) {
            d.fontSize = sizeMap[d.score];
        }
    }

    getGCloud() {
        return this.svg.select("g.g-cloud");
    }

    drawWords(data: SvgWordCloudDataArray) {
        const g = this.getGCloud();

        const update = g.selectAll("g")
            .data(data);

        update.selectAll("text")
            .style("font-size", function (d) {
                return d.fontSize + "px";
            })
            .style("fill", function (d) {
                return d.color;
            })
            .style(fontFamilyText, fontFamily)
            .attr(textAnchorText, "middle")
            .attr("dy", "0.35em")
            .text(function (d) {
                return d.text;
            });

        const enter = update.enter().append("g")
            .attr("transform", function (d) {
                return `translate(${d.x}, ${d.y})`
            });

        enter.append("text")
            .style("font-size", function (d) {
                return d.fontSize + "px";
            })
            .style("fill", function (d) {
                return d.color;
            })
            .style(fontFamilyText, fontFamily)
            .attr(textAnchorText, "middle")
            .attr("dy", "0.35em")
            .text(function (d) {
                return d.text;
            });

        update.exit().remove();

        this.onDrawEnd();
    }

    selectChartContainer() {
        return d3.select("socs-svg-word-cloud .chart-container");
    }

    private calcCoordinates(data: SvgWordCloudDataArray) {
        this.svgTemp = d3.select("body").append('svg')
            .attr("width", 100)
            .attr("height", 100)
            .style("position", "absolute")
            .style("left", "0")
            .style("top", "0")
            .style("z-index", -100);

        const ellipticity = this.height / this.width;

        const spiral = new Spiral(0.5, ellipticity);

        const dataToDraw: SvgWordCloudDataArray = [];
        let i = 0;
        tick.call(this);

        function tick() {
            const slice = data.slice(i, i + this.tickDataNumber);
            slice.forEach((d, j) => {
                this.calcCoordinate({
                    data,
                    d,
                    i: i + j,
                    svgTemp: this.svgTemp,
                    spiral
                });
                dataToDraw.push(d);
            });

            this.drawWords(dataToDraw);

            i += this.tickDataNumber;

            if (i > data.length - 1) {
                this.svgTemp.remove();
            } else {
                this.tickId = setTimeout(tick.bind(this), this.transitionDuration);
            }
        }
    }

    private calcCoordinate(options: CalcCoordinateOptions) {
        const {data, d, i, svgTemp, spiral} = options;
        const text = svgTemp.append("text")
            .style("font-size", function () {
                return d.fontSize + "px";
            })
            .style("fill", function () {
                return d.color;
            })
            .style(fontFamilyText, fontFamily)
            .attr(textAnchorText, "middle")
            .text(function () {
                return d.text;
            });

        const textBBox = text.node().getBBox();
        d.width = textBBox.width;
        d.height = textBBox.height;
        svgTemp.selectAll("*").remove();

        while (true) {
            let intersect = false;

            const {x, y} = spiral.nextPoint();
            d.x = x;
            d.y = y;

            if (i !== 0) {
                for (let j = i - 1; j >= 0; j--) {
                    const prev = data[j];

                    if (this.hasIntersection(prev, d)) {
                        intersect = true;
                        break;
                    }
                }
            }

            if (!intersect) {
                break;
            }
        }
    }

    private hasIntersection(prev: SvgWordCloudData, curr: SvgWordCloudData): boolean {
        const prevBBox = this.getBBox(prev);
        const prevShape = svgIntersections.shape("rect", {
            x: prevBBox.lt.x,
            y: prevBBox.lt.y,
            width: prevBBox.width,
            height: prevBBox.height
        });

        const currBBox = this.getBBox(curr);
        const currShape = svgIntersections.shape("rect", {
            x: currBBox.lt.x,
            y: currBBox.lt.y,
            width: currBBox.width,
            height: currBBox.height
        });

        const prevOuter = this.isInside(prevBBox, currBBox);
        const currOuter = this.isInside(currBBox, prevBBox);

        if (prevOuter || currOuter) {
            return true;
        }

        const intersections = svgIntersections.intersect(prevShape, currShape);

        if (intersections.points.length !== 0) {
            return true;
        }

        return false;
    }

    private isInside(outerBBox: BBox, innerBBox: BBox): boolean {
        return outerBBox.lt.x < innerBBox.lt.x && outerBBox.lt.y < innerBBox.lt.y &&
            outerBBox.rt.x > innerBBox.rt.x && outerBBox.rt.y < innerBBox.rt.y &&
            outerBBox.rb.x > innerBBox.rb.x && outerBBox.rb.y > innerBBox.rb.y &&
            outerBBox.lb.x < innerBBox.lb.x && outerBBox.lb.y > innerBBox.lb.y;
    }

    private getBBox(d: SvgWordCloudData): BBox {
        return {
            lt: {
                x: d.x - d.width / 2,
                y: d.y - d.height / 2
            },
            rt: {
                x: d.x + d.width / 2,
                y: d.y - d.height / 2
            },
            lb: {
                x: d.x - d.width / 2,
                y: d.y + d.height / 2
            },
            rb: {
                x: d.x + d.width / 2,
                y: d.y + d.height / 2
            },
            width: d.width,
            height: d.height
        };
    }

    onDrawEnd() {
        const gRect = this.getGCloud().node().getBBox();

        const newViewBox = `${gRect.x} ${gRect.y} ${gRect.width} ${gRect.height}`;

        this.svg
            .transition()
            .duration(this.transitionDuration)
            .ease(d3.easeLinear)
            .attr('viewBox', newViewBox);
    }

    setAnimationSetting(dataSize) {
        this.setTickDataNumber(dataSize);
        this.setTransitionDuration(dataSize);
    }

    setTickDataNumber(dataSize) {
        if (dataSize < 10) {
            this.tickDataNumber = 3;
        } else if (dataSize < 30) {
            this.tickDataNumber = 10;
        } else if (dataSize < 60) {
            this.tickDataNumber = 20;
        } else {
            this.tickDataNumber = 30;
        }
    }

    setTransitionDuration(dataSize) {
        if (dataSize < this.tickDataNumber) {
            this.transitionDuration = dataSize / this.tickDataNumber * 400 + 75;
        } else {
            this.transitionDuration = this.tickDataNumber / dataSize * 400 + 75;
        }
    }

    private startRedrawOnResize() {
        this.redrawOnResizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.draw();
            });
    }

    private stopRedrawOnResize() {
        if (this.redrawOnResizeSubscription) {
            this.redrawOnResizeSubscription.unsubscribe();
            this.redrawOnResizeSubscription = undefined;
        }
    }

    clearTemp() {
        if (this.tickId) {
            clearTimeout(this.tickId);
        }

        if (this.svgTemp) {
            this.svgTemp.remove();
        }
    }

    ngOnDestroy() {
        this.stopRedrawOnResize();
        this.clearTemp();
    }
}


declare type SvgWordCloudData = {
    text: string;
    score: number;
    fontSize?: number;
    color?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};

declare type SvgWordCloudDataArray = Array<SvgWordCloudData>;

declare type Point = {
    x: number;
    y: number;
};

class Spiral {
    private readonly degStep = 12.25;
    private t = 0;
    private points: Array<Point> = [];

    constructor(private readonly r: number, private readonly ellipticity = 1) {
    }

    private get radStep(): number {
        return Math.PI / 180 * this.degStep;
    }

    get state() {
        return {
            t: this.t,
            points: [...this.points]
        };
    }

    clear() {
        this.t = 0;
        this.points = [];
    }

    allPoints(interval: number, saveLastTime?: boolean) {
        const points = [];
        for (let t = 0; t < interval; t++) {
            const point = this.getPoint(t);
            points.push(point);
        }

        if (saveLastTime) {
            this.t = interval;
            this.points = [...points];
        }

        return points;
    }

    nextPoint(): Point {
        const point = this.getPoint(this.t);

        this.t++;
        this.points.push(point);

        return point;
    }

    private getPoint(t: number): Point {
        const x = this.getX(t);
        const y = this.getY(t);

        return {x, y};
    }

    private getX(t: number): number {
        return +(this.r * this.alpha(t) * Math.cos(this.alpha(t))).toFixed(2);
    }

    private getY(t: number): number {
        return +(this.ellipticity * this.r * this.alpha(t) * Math.sin(this.alpha(t))).toFixed(2);
    }

    private alpha(t: number): number {
        return t * this.radStep;
    }
}

declare type CalcCoordinateOptions = {
    data: SvgWordCloudDataArray,
    d: SvgWordCloudData,
    i: number,
    svgTemp: any,
    spiral: Spiral
}

declare type BBox = {
    lt: Point,
    rt: Point,
    rb: Point,
    lb: Point,
    width: number,
    height: number
}

const fontFamily = "'PT Sans Regular', 'PT Sans', 'Helvetica Neue'";
