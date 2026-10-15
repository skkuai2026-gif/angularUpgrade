import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { RiderExtraListHandlerComponent } from './rider-extra-list.handler';

@Component({
  selector: 'sym-rider-extra-list',
  templateUrl: './rider-extra-list.component.html',
  styleUrls: ['./rider-extra-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RiderExtraListComponent extends RiderExtraListHandlerComponent {
  @Input() modelPath: string;
  @Input() modelList: string;
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  public extraFlatAmt_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public extraFlatDuration_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public extraPercent_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public extraPercDuration_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
}
