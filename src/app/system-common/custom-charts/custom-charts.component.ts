import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as d3 from 'd3';
import { SettingService } from '../services/setting.service';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'sym-custom-charts',
  templateUrl: './custom-charts.component.html',
  styleUrls: ['./custom-charts.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CustomChartsComponent implements OnInit, AfterViewInit {
  /**
   * Expects width of canvas in px. e.g: 600
   * This is optional parameter. Default width is 700
   */
  @Input() widthInPX: number;
  /**
   * Expects height of canvas in px. e.g: 500
   * This is optional parameter. Default height is 300
   */
  @Input() heightInPX: number;
  /**
   * Expects margin that needs to be added. eg: { top: 30, right: 150, bottom: 100, left: 100 }
   * This is optional parameter. Default margin is { top: 30, right: 150, bottom: 100, left: 100 }
   */
  @Input() margins: { top: number; right: number; bottom: number; left: number };

  /**
   * expects y-axis details. Mandatory input
   */
  @Input() lineChartYPlotDetails: ChartYPlotDetails[];
  /***
   * expects list of data in format of{x:[..], y1:[..]}
   * This is mandatory input
   */
  @Input() dataList: any[];
  /**
   * Label that will be displayed on X axis
   */
  @Input() xAxisLabel: string;
  /**
   * Label that will be displayed on Y axis
   */
  @Input() yAxisLabel: string;
  /**
   * By default its line chart for now.
   */
  @Input() chartType: string;

  /**
   * Interval count for X axis to avoid over lap of X axis.
   */
  @Input() xAxisIntervalCount: number;

  /**
   * It expects a string value to load the chart using Chart.js or d3 chartLibrary.
   * Expected values: chartjs, d3
   * Default value is chartjs
   */
  @Input() chartLibrary: string;

  static idCount: number = 0;

  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  dataGroup;
  colourRange1: any; // move to custom-chart
  colourRange2: any;
  data: any[];
  yPlotDetails: ChartYPlotDetails[];
  lineChartData = [];
  labelOption = [];
  chartID: string;
  chart: any;
  /**Based on the IM chart data it will set the unit and the scaleFactor to display the values in the chart accordingly */
  scaleInfo: { scaleFactor: number; unit: string };

  constructor(
    public chartElem: ElementRef,
    public settingService: SettingService,
    private decimalPipe: DecimalPipe
  ) {
    this.chartID = 'linechart' + CustomChartsComponent.idCount++;
    this.margin = { top: 30, right: 10, bottom: 200, left: 50 };
    let iwidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
    this.width =
      settingService.isMobileViewRendered() && settingService.isLandScapeViewRendered()
        ? 550 - this.margin.left - this.margin.right
        : settingService.isMobileViewRendered() &&
          !settingService.isLandScapeViewRendered() &&
          settingService.getApplicationMode() == 'offline'
        ? 680 - this.margin.left - this.margin.right
        : settingService.isMobileViewRendered() &&
          !settingService.isLandScapeViewRendered() &&
          settingService.getApplicationMode() == 'online' &&
          iwidth > 550
        ? 650 - this.margin.left - this.margin.right
        : settingService.isMobileViewRendered() &&
          !settingService.isLandScapeViewRendered() &&
          settingService.getApplicationMode() == 'online' &&
          iwidth < 550
        ? 300 - this.margin.left - this.margin.right
        : 630 - this.margin.left - this.margin.right;
    this.height =
      settingService.isMobileViewRendered() && settingService.isLandScapeViewRendered()
        ? 500 - this.margin.top - this.margin.bottom
        : settingService.isMobileViewRendered() && !settingService.isLandScapeViewRendered()
        ? 680 - this.margin.top - this.margin.bottom
        : 500 - this.margin.top - this.margin.bottom;

    this.colourRange1 = d3.schemeSet1;
    this.colourRange2 = d3.schemeDark2;
    this.chartLibrary = 'chartjs';
  }

  ngAfterViewInit(): void {
    if (this.dataList && this.yPlotDetails && this.chartLibrary != 'd3') this.renderChart();
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes['widthInPX'] && changes['widthInPX'].currentValue) {
      this.width = this.widthInPX;
    }
    if (changes['heightInPX'] && changes['heightInPX'].currentValue) {
      this.height = this.heightInPX;
    }
    if (changes['margins'] && changes['margins'].currentValue) {
      this.margin = this.margins;
    }
    if (changes['lineChartYPlotDetails'] && changes['lineChartYPlotDetails'].currentValue) {
      if (this.yPlotDetails == undefined) this.yPlotDetails = [];
      this.yPlotDetails = this.lineChartYPlotDetails;
      if (this.chartLibrary != 'd3') this.updateChart();
    }
    if (changes['xAxisIntervalCount'] && changes['xAxisIntervalCount'].currentValue) {
    }
    if (changes['dataList'] && changes['dataList'].currentValue) {
      // if (this.data == undefined) this.data = [];
      // this.data = this.dataList;
      if (this.chartLibrary != 'd3') this.updateChart();
      else {
        setTimeout(() => {
          if (document.getElementById(this.chartID) !== undefined) {
            this.createLineGraph();
          }
        }, 0);
      }
    }
    if (changes['chartLibrary'] && this.chartLibrary === 'chartjs') {
      this.renderChart();
    }
  }

  public createLineGraph() {
    this.refreshChartObject();
    this.initD3Object();
    this.data = [];
    if (this.xAxisIntervalCount != undefined) {
      for (let i = 0; i < this.dataList.length; i = i + this.xAxisIntervalCount) {
        this.data.push(this.dataList[i]);
      }
    } else {
      this.data = this.dataList;
    }
    this.drawD3LineChart();
  }

  private initD3Object() {
    /** creating d3 logic */
    this.dataGroup = d3
      .select(this.chartElem.nativeElement)
      .select('#' + this.chartID)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom - 20)

      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + (this.margin.top + -25) + ')');
    if (this.settingService.isMobileViewRendered() && !this.settingService.isLandScapeViewRendered()) {
      this.dataGroup = d3
        .select(this.chartElem.nativeElement)
        .select('#' + this.chartID)
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom - 20)
        .attr(
          'viewBox',
          '0 0 ' +
            (this.width + this.margin.left + this.margin.right) +
            ' ' +
            (this.height + this.margin.top + this.margin.bottom)
        )
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ', ' + (this.margin.top + -25) + ')');
    } else {
      this.dataGroup = d3
        .select(this.chartElem.nativeElement)
        .select('#' + this.chartID)
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom - 20)

        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ', ' + (this.margin.top + -25) + ')');
    }

    if (this.widthInPX != undefined) {
      d3.select(this.chartElem.nativeElement)
        .select('#' + this.chartID)
        .select('g')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');
    }
  }

  private refreshChartObject() {
    if (d3.selectAll('circle') != undefined) d3.selectAll('#circle' + this.chartID).remove();
    d3.selectAll('#path' + this.chartID).remove();
    this.yPlotDetails.filter((axis, i) => {
      d3.selectAll(this['y' + i + 'AxisGroup']).remove();
    });
    d3.selectAll('.legend_' + this.chartID).remove();
    d3.selectAll(this['xAxisGroup']).remove();
    d3.selectAll('#xAxisLabel' + this.chartID).remove();
    d3.selectAll('#yAxisLabel' + this.chartID).remove();
  }

  private drawD3LineChart() {
    /** axis logic */
    if (!isNaN(this.data[0]['x'])) {
      this['x'] = d3
        .scaleLinear()
        .domain(
          d3.extent(this.data, function (d) {
            return d.x;
          })
        )
        .range([0, this.width])
        .nice();
    } else {
      this['x'] = d3
        .scalePoint()
        .domain(
          d3.map(this.data, function (d) {
            return d.x;
          })
        ) // This is what is written on the Axis: from 0 to 100
        .range([0, this.width]);
    }

    let minV: number;
    let maxV: number;
    let arr = [];
    this.yPlotDetails.filter((yDetails, i) => {
      if (yDetails.lineColor === undefined) yDetails.lineColor = this.colourRange1[i];
      if (yDetails.plotColor === undefined) yDetails.plotColor = this.colourRange2[i];
      arr[yDetails.fieldCd] = [];
      this.data.filter((val) => {
        arr[yDetails.fieldCd].push(val[yDetails.fieldCd]);
      });

      let max = Math.max(...arr[yDetails.fieldCd]);
      let min = Math.min(...arr[yDetails.fieldCd]);

      if (minV === undefined && maxV === undefined) {
        minV = min;
        maxV = max;
      } else {
        minV = minV < min ? minV : min;
        maxV = maxV > max ? maxV : max;
      }
    });

    this.yPlotDetails.filter((detail) => {
      this['y' + detail.fieldCd] = d3.scaleLinear().domain([minV, maxV]).range([this.height, 0]).nice();
      // if (!isNaN(minV) && !isNaN(maxV)) {
      //   this['y' + detail.fieldCd] = d3.scaleLinear().domain([minV, maxV]).range([this.height, 0]).nice();
      // } else {
      //   this['y' + detail.fieldCd] = d3
      //     .scaleLinear()
      //     .domain([0, arr[detail.fieldCd].length])
      //     .range([this.height, 0])
      //     .nice();
      // }
    });

    this.yPlotDetails.filter((detail) => {
      this.plotVariable(detail, this.chartID);
    });

    /** drawing x axis logic */
    this['xAxisGroup'] = this.dataGroup
      .append('g')
      .attr('class', 'xAxisGroup')
      .attr('transform', 'translate(0,' + (this.height + 10) + ')');
    // .selectAll('.tick text')
    // .style('font-size', '16px');

    this['xAxis'] = d3.axisBottom(this['x']).tickPadding(8);

    this['xAxis'](this['xAxisGroup']);
    /** drawing y axis logic */
    this.yPlotDetails.filter((axis, i) => {
      let ri = this.yPlotDetails.length - i >= 0 ? this.yPlotDetails.length - i : 0;
      d3.selectAll(this['y' + ri + 'AxisGroup']).remove();
      this['y' + i + 'AxisGroup'] = this.dataGroup
        .append('g')
        .attr('class', 'y' + i + 'AxisGroup')
        .attr('class', 'yAxisGrid')
        .attr('transform', 'translate( ' + 0 + ', 10 )');
      // .attr('transform', 'translate( ' + -10 * (i + 2) + ',   ' + (i + 1) * 20   + ')');

      // this['y' + i + 'Axis'] = d3.axisLeft(this['y' + axis.fieldCd]);
      this['y' + i + 'Axis'] = d3
        .axisLeft(this['y' + axis.fieldCd])
        .tickFormat(d3.format('.2s'))
        // .tickFormat((d, i) => arr[axis.fieldCd][i])
        .tickPadding(8);

      d3.selectAll('g.yAxisGrid g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', this.width)
        .attr('y2', 0)
        .attr('stroke', '#d3d3d3')
        .attr('stroke-dasharray', '3');
      // Added condition to display the last axis only
      if (ri === this.yPlotDetails.length) this['y' + i + 'Axis'](this['y' + i + 'AxisGroup']);
    });

    // d3.selectAll('.tick text').style('font-size', '12px');
    d3.selectAll('g.xAxisGroup g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('x1', 0)
      .attr('y1', -this.height)
      .attr('x2', 0)
      .attr('y2', 0)
      .attr('stroke', '#d3d3d3')
      .attr('stroke-dasharray', '3');
    // this['y' + (this.yPlotDetails.length - 1) + 'AxisGroup'] = this.dataGroup
    //   .append('g')
    //   .attr('class', 'y' + (this.yPlotDetails.length - 1) + 'AxisGroup')
    //   .attr('transform', 'translate( ' + -10 + ', 0 )');

    // this['y' + (this.yPlotDetails.length - 1) + 'Axis'] = d3.axisLeft(
    //   this['y' + this.yPlotDetails[this.yPlotDetails.length - 1].title]
    // );

    // this['y' + (this.yPlotDetails.length - 1) + 'Axis'](this['y' + (this.yPlotDetails.length - 1) + 'AxisGroup']);

    this.setXAxisLabel(this.dataGroup, this.xAxisLabel);
    this.setYAxisLabel(this.dataGroup, this.yAxisLabel);

    this.yPlotDetails.filter((p) => {
      this.circlePoints(this.yPlotDetails, this.dataGroup, this.chartID);
    });

    this.drawLegend(
      this.dataGroup,
      this.width,
      this.height,
      this.chartElem.nativeElement,
      this.chartID,
      this.widthInPX == undefined ? true : false
    );
  }

  private plotVariable(plot, chartId) {
    let line = d3
      .line()
      .x((d) => this['x'](d['x']))
      .y((d) => this['y' + plot.fieldCd](d[plot.fieldCd]))
      .curve(d3.curveMonotoneX);

    this.dataGroup
      .append('path')
      .attr('id', 'circle' + chartId)
      .data([this.data])
      .attr('fill', 'none')
      .attr('stroke', plot.lineColor)
      .attr('d', line);
  }

  private setXAxisLabel(dg, text) {
    dg.append('text')
      .attr('id', 'xAxisLabel' + this.chartID)
      .attr('transform', 'translate(' + (this.width / 2 - 25) + ' ,' + (this.height + this.margin.top + 25) + ')')
      .style('text-anchor', 'middle')
      .text(text);
  }

  private setYAxisLabel(dg, text) {
    dg.append('text')
      .attr('id', 'yAxisLabel' + this.chartID)
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left - 0)
      .attr('x', 0 - this.height / 2 - 15)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(text);
  }

  private circlePoints(propertyNames, dg, chartId) {
    let x = this['x'];
    let text = this.xAxisLabel;
    for (let i = 0; i < propertyNames.length; i++) {
      let y = this['y' + propertyNames[i].fieldCd];
      this.data.forEach(function (point) {
        dg.append('circle')
          .attr('id', 'circle' + chartId)
          .attr('fill', propertyNames[i].plotColor)
          .attr('r', 3)
          .attr('cx', x(point.x))
          .attr('cy', y(point[propertyNames[i].fieldCd]))
          .append('title')
          .text(
            (d) =>
              ` ${text}:  ${point.x}  ${propertyNames[i].displayedLabelText}:  ${point[propertyNames[i].fieldCd]}`
          );
      });
    }
  }

  private drawLegend(dg, width, height, elm, chartID, splitLegend) {
    let mv =
      this.settingService.isMobileViewRendered() &&
      !this.settingService.isLandScapeViewRendered() &&
      this.settingService.getApplicationMode() === 'offline';
    let wd =
      this.settingService.isMobileViewRendered() &&
      !this.settingService.isLandScapeViewRendered() &&
      this.settingService.getApplicationMode() === 'offline'
        ? -(width / 2 + 500)
        : this.settingService.isMobileViewRendered() &&
          !this.settingService.isLandScapeViewRendered() &&
          this.settingService.getApplicationMode() === 'online'
        ? -(width / 2 + 100)
        : -(width / 2 + 280);
    let legend = dg
      .append('g')
      .attr('class', 'legend_' + chartID)
      .attr('transform', 'translate(' + wd + ' ,' + (height + this.margin.top + 40) + ')')
      .style('text-anchor', 'left')
      .style('margin', '8px')
      .attr('x', width)
      .attr('y', 25)
      .attr('fill', 'none')
      .attr('width', height)
      .attr('height', 100);
    let margin = this.margin;
    this.yPlotDetails.forEach(function (x, i) {
      legend
        .append('rect')
        .attr('id', 'rect' + i)
        .attr('fill', x.lineColor)
        .attr('x', width + 20)
        .attr('y', i * 12)
        .attr('width', 15)
        .attr('height', 5)
        .append('title')
        .text(x.displayedLabelText);

      let title =
        x.displayedLabelText.length < 30 ? x.displayedLabelText : x.displayedLabelText.substring(0, 30) + '...';

      legend
        .append('text')
        .attr('id', 'text' + i)
        .text(title)
        .attr('font-size', '9pt')
        .attr('fill', x.lineColor)
        .attr('x', width + 45)
        .attr('y', i * 12 + 6)
        .append('title')
        .text(x.displayedLabelText);

      if (splitLegend) {
        if (i % 2 == 0) {
          let swd = mv ? width - 210 : width - 310;
          d3.select('rect[id=rect' + i + ']').attr('transform', 'translate(' + swd + ' ,' + 38 + ')');
          d3.select('text[id=text' + i + ']').attr('transform', 'translate(' + swd + ' ,' + 38 + ')');
        } else if (i % 2 == 1) {
          d3.select('rect[id=rect' + i + ']').attr(
            'transform',
            'translate(' + (width / 2 - 280) + ' ,' + 25 + ')'
          );
          d3.select('text[id=text' + i + ']').attr(
            'transform',
            'translate(' + (width / 2 - 280) + ' ,' + 25 + ')'
          );
        }
      }
    });
    let newHeight = height + 50;
    this.yPlotDetails.forEach(function (x, i) {
      if (i % 2 == 0) {
        newHeight = newHeight + 60;
        d3.select(elm)
          .select('#' + chartID)
          .attr('height', newHeight);
      }
    });
    if (this.widthInPX != undefined) {
      d3.select('.legend_' + chartID).attr(
        'transform',
        'translate(' + -(this.widthInPX + 10) + ' ,' + (height + this.margin.top + 70) + ')'
      );
    }
  }

  private renderChart(): void {
    let chartContext = (document.getElementById(this.chartID) as HTMLCanvasElement)?.getContext('2d');
    if (!chartContext) return;

    this.scaleInfo = this.getDynamicScaleFactor();

    // Prepare datasets
    const datasets = this.yPlotDetails.map((plotDetail, index) => {
      const color = this.getColor(index);
      const dataPoints = this.dataList.map((dp) => {
        const val = dp[plotDetail.fieldCd];
        if (val === undefined || val === null) {
          console.warn(`Missing value for ${plotDetail.fieldCd} at data point`, dp);
          return 0; // or skip, or handle as needed
        }
        return val / this.scaleInfo.scaleFactor;
      });

      return {
        label: plotDetail.displayedLabelText,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color,
        pointRadius: 2,
        pointBackgroundColor: color,
        fill: false,
        barThickness: 1,
        borderWidth: 1,
      };
    });

    // Compute max value
    const allValues = [].concat(...datasets.map((ds) => ds.data));
    const maxV = Math.max(...allValues);

    let tickStep;
    if (maxV > 500) {
      tickStep = 100;
    } else if (maxV > 100) {
      tickStep = 50;
    } else if (maxV > 50) {
      tickStep = 10;
    } else {
      tickStep = 5;
    }
    const maxVNextTick = Math.ceil(maxV / tickStep) * tickStep;

    this.chart = new Chart(chartContext, {
      type: 'line',
      data: {
        labels: this.dataList.map((dp) => dp.x),
        datasets: datasets,
      },
      options: {
        responsive: true,
        legend: {
          align: 'start',
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
        tooltips: {
          enabled: true,
          callbacks: {
            title: (tooltipItems, data) => {
              // tooltipItems is an array; take the first item for the age (x-axis label)
              const age = tooltipItems[0].label;
              return `${this.xAxisLabel}: ${age}`;
            },
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label || '';
              const value: any = tooltipItem.yLabel;
              // Convert back to original value by multiplying scaleFactor
              const originalValue = this.decimalPipe.transform(
                Math.round(value * this.scaleInfo.scaleFactor),
                '1.0-0'
              );
              return `${label}: ${originalValue} ${this.scaleInfo.unit}`;
            },
          },
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.xAxisLabel,
              },
              gridLines: {
                color: '#d3d3d3',
                borderDash: [3, 3],
                drawTicks: true,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.yAxisLabel,
              },
              ticks: {
                min: 0,
                max: maxVNextTick,
                callback: (value: any) => `${value.toFixed(2)} ${this.scaleInfo.unit}`,
              },
              gridLines: {
                color: '#d3d3d3',
                borderDash: [3, 3],
                drawTicks: true,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Updates the chart with the latest data, labels, scaling, and Y-axis settings.
   * Dynamically adjusts datasets and Y-axis tick intervals based on data values.
   */
  private updateChart(): void {
    if (this.chart && this.dataList && this.yPlotDetails) {
      this.scaleInfo = this.getDynamicScaleFactor();

      this.chart.data.labels = this.dataList.map((dp) => dp.x);
      this.chart.data.datasets = this.yPlotDetails.map((plotDetail, index) => {
        return {
          ...this.chart.data.datasets[index],
          label: plotDetail.displayedLabelText,
          data: this.dataList.map((dp) => dp[plotDetail.fieldCd] / this.scaleInfo.scaleFactor),
        };
      });

      // Flatten all scaled values across datasets for max tick calculation
      let allValues: number[] = [].concat(
        ...this.yPlotDetails.map((plotDetail) =>
          this.dataList.map((dp) => dp[plotDetail.fieldCd] / this.scaleInfo.scaleFactor)
        )
      );
      const maxV = Math.max(...allValues);
      // Dynamically determine Y-axis tick step based on max value
      let tickStep;
      if (maxV > 500) {
        tickStep = 100;
      } else if (maxV > 100) {
        tickStep = 50;
      } else if (maxV > 50) {
        tickStep = 10;
      } else {
        tickStep = 5;
      }

      // Round maxV up to the nearest tick step
      const maxVNextTick = Math.ceil(maxV / tickStep) * tickStep;
      this.chart.options.scales.yAxes[0].ticks.max = maxVNextTick;

      this.chart.update();
    } else if (this.dataList && this.yPlotDetails) {
      // Chart not yet created — create it
      this.renderChart();
    }
  }

  private getColor(index: number): string {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink', 'teal'];
    return colors[index % colors.length];
  }

  /**
   * Calculates the appropriate scale factor and unit (M, G, or T)
   * based on the maximum value found in the data set.
   *
   * @returns An object containing:
   *   - scaleFactor: The divisor to scale large values (1e6, 1e9, or 1e12)
   *   - unit: A string indicating the scale unit ('M', 'G', or 'T')
   */
  private getDynamicScaleFactor(): { scaleFactor: number; unit: string } {
    let maxVal = 0;

    for (const dp of this.dataList) {
      for (const plotDetail of this.yPlotDetails) {
        const val = dp[plotDetail.fieldCd];
        if (val !== undefined && val !== null) {
          maxVal = Math.max(maxVal, val);
        }
      }
    }

    if (maxVal < 1e9) {
      return { scaleFactor: 1e6, unit: 'M' }; // Million
    } else if (maxVal < 1e12) {
      return { scaleFactor: 1e9, unit: 'G' }; // Billion
    } else {
      return { scaleFactor: 1e12, unit: 'T' }; // Trillion
    }
  }
}

export class ChartYPlotDetails {
  fieldCd: string;
  displayedLabelText: string;
  lineColor?: string;
  plotColor?: string;
}
