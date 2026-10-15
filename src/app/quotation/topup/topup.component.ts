import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { TopupHandlerComponent } from './topup.handler';
import { CustomFormatPipe } from '../../system-common/pipe/custom-format.pipe';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TopupComponent extends TopupHandlerComponent {
  constructor(quotationService: QuotationService, customFormatPipe: CustomFormatPipe) {
    super(quotationService, customFormatPipe);
  }

  public topupOptionCd_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topUpPeriod', null);
    this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topUpAmount', null);
    this.service.setModelFieldValue(this.service.responseIO.data.InitialInvestment, 'topUpAmount', null);
    this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'payingYears', null);
    this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'targetFundVal', null);
    this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'targetPeriod', null);
    if (
      this.service != undefined &&
      this.service.responseIO != undefined &&
      (this.service.responseIO.data.Entity.topupOptionCd == 'EXCESSWITHOUTPH' ||
        this.service.responseIO.data.Entity.topupOptionCd == 'EXCESSANDTFCALCULATIONWITHPH' ||
        this.service.responseIO.data.Entity.topupOptionCd == 'EXCESSWITHPH')
    ) {
      if (this.service.responseIO.data.BasePlan.paymentTypeCd == 'SINGLE') {
        this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topUpPeriod', 2);
      } else if (
        this.service.responseIO.data.BasePlan.paymentTypeCd == 'REGULAR' ||
        this.service.responseIO.data.BasePlan.paymentTypeCd == 'LIMITED'
      ) {
        this.service.setModelFieldValue(
          this.service.responseIO.data.RegularTopup,
          'topUpPeriod',
          this.service.responseIO.data.BasePlan.premiumPayingTerm
        );
      }
    }
  }
}
