import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationPartyAddressHandlerComponent } from './quotation-party-address.handler';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-quotation-party-address',
  templateUrl: './quotation-party-address.component.html',
  styleUrls: ['./quotation-party-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPartyAddressComponent extends QuotationPartyAddressHandlerComponent implements OnInit {
  @Input() model: any;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  public residency_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model.PermanentAddress, 'countryCd', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'stateCd', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'cityCd', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'addressLine1Lang1', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'addressLine2Lang1', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'addressLine3Lang1', null);
    this.service.setModelFieldValue(item.model.PermanentAddress, 'pinCode', null);
  }
  public educationCd_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.Proposer.OfficeAddress, 'countryCd', null);
    this.service.setModelFieldValue(this.service.responseIO.data.Proposer.OfficeAddress, 'stateCd', null);
    this.service.setModelFieldValue(this.service.responseIO.data.Proposer.OfficeAddress, 'cityCd', null);
    this.service.setModelFieldValue(
      this.service.responseIO.data.Proposer.OfficeAddress,
      'addressLine1Lang1',
      null
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.Proposer.OfficeAddress,
      'addressLine2Lang1',
      null
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.Proposer.OfficeAddress,
      'addressLine3Lang1',
      null
    );
    this.service.setModelFieldValue(this.service.responseIO.data.Proposer.OfficeAddress, 'pinCode', null);
  }
}
