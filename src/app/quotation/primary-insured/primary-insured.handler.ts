import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { FieldItem } from './../../models/common/field-item';
import { QuotationPartyComponent } from './../quotation-party/quotation-party.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrimaryInsuredHandlerComponent extends QuotationPartyComponent {
  public displayPrimaryUI: boolean;
  public isProposerLASameDisplay: boolean;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
    this.displayPrimaryUI = false;
  }

  ngOnInit(): void {
    this.displayPrimaryUI =
      this.service.responseIO.data['Entity'].proposerLASame == 'YES' && this.isProposerLASameDisplay
        ? false
        : true;
  }

  setIsProposerLASameDisplay(newVal) {
    this.isProposerLASameDisplay = newVal;
  }
  public async proposerLASame_change(item: FieldItem) {
    if (item.model[item.fieldCd] == 'NO') {
      //Clearing party details on the basis of facet.
      let partyModel = this.service.responseIO.data['PrimaryInsured'];
      if (
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] &&
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] == 'YES'
      )
        partyModel = this.service.responseIO.data['Proposer'];
      await this.service.clearPartyDetails(partyModel);
      this.displayPrimaryUI =
        this.service.responseIO.data['Entity'].proposerLASame == 'YES' && this.isProposerLASameDisplay
          ? false
          : true;
    } else {
      this.displayPrimaryUI = false;
    }
  }
}
