import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { PremiumSummaryHandlerComponent } from '../premium-summary/premium-summary.handler';

@Component({
  selector: 'sym-life-premium-summary',
  templateUrl: './life-premium-summary.component.html',
  styleUrls: ['./life-premium-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LifePremiumSummaryComponent extends PremiumSummaryHandlerComponent implements OnInit {
  constructor(quotationService: QuotationService, router: Router, public settingService: SettingService) {
    super(quotationService, router, settingService);
  }

  ngOnInit() {}
}
