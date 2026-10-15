import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { PremiumSummaryHandlerComponent } from '../premium-summary/premium-summary.handler';

@Component({
  selector: 'sym-quote-illustration-chart',
  templateUrl: './quote-illustration-chart.component.html',
  styleUrls: ['./quote-illustration-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteIllustrationChartComponent extends PremiumSummaryHandlerComponent implements OnInit, OnChanges {
  @Input() illustrationResult: any;
  @Output() fetchIllustrationResultData = new EventEmitter<any>();

  constructor(quotationService: QuotationService, router: Router, public settingService: SettingService) {
    super(quotationService, router, settingService);
    this.selectedGraphPer = 0;
  }
  ngOnInit() {
    if (!this.illustrationResult) {
      this.fetchIllustrationResultData.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['illustrationResult'] && changes['illustrationResult'].currentValue) {
      if (this.dataList?.length == 0) this.createDataForGraph(0);
      if (this.illustrationResult != undefined && this.illustrationResult.rates != undefined)
        this.rateLength = Object.keys(this.illustrationResult.rates).length;
    }
  }
}
