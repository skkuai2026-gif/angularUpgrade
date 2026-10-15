import { QuotationService } from './../services/quotation.service';
import { Component, ElementRef, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Router } from '@angular/router';
import { ComboPremiumSummaryHandlerComponent } from './combo-premium-summary.handler';

@Component({
  selector: 'sym-combo-premium-summary,[sym-combo-premium-summary]',
  templateUrl: './combo-premium-summary.component.html',
  styleUrls: ['./combo-premium-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ComboPremiumSummaryComponent extends ComboPremiumSummaryHandlerComponent {
  @Input() isConvertToEappReq: boolean;

  constructor(quotationService: QuotationService, router: Router, public settingService: SettingService) {
    super(quotationService, router, settingService);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isConvertToEappReq'] && changes['isConvertToEappReq'].currentValue) {
      this.isConvertToEappReq = this.isConvertToEappReq;
    }
  }
}
