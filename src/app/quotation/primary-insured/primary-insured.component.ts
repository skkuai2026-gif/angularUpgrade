import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PrimaryInsuredHandlerComponent } from './primary-insured.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-primary-insured',
  templateUrl: './primary-insured.component.html',
  styleUrls: ['./primary-insured.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrimaryInsuredComponent extends PrimaryInsuredHandlerComponent {
  @Input() isProposerLASameDisplay: boolean;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
    this.isProposerLASameDisplay = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isProposerLASameDisplay'] && changes['isProposerLASameDisplay'].currentValue) {
      super.setIsProposerLASameDisplay(this.isProposerLASameDisplay);
    }
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
      if (
        this.service.responseIO?.data?.Entity.leadId === null ||
        this.service.responseIO?.data?.Entity.leadId === ''
      ) {
        this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'lastname', '(CLIENT)');
      }
    } else {
      this.displayPrimaryUI = false;
    }
  }
}
