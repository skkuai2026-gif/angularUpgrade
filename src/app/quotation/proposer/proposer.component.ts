import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ProposerHandlerComponent } from './proposer.handler';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-proposer',
  templateUrl: './proposer.component.html',
  styleUrls: ['./proposer.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProposerComponent extends ProposerHandlerComponent {
  @Input() isProposerLASameDisplay: boolean;

  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
    this.isProposerLASameDisplay = false;
  }
  public async partyTypeCd_change(item: FieldItem) {
    if (
      this.service.responseIO?.data?.Entity.leadId === null ||
      this.service.responseIO?.data?.Entity.leadId === ''
    ) {
      if (item.model[item.fieldCd] === 'ORGANIZATION') {
        let partyModel = this.service.responseIO.data['PrimaryInsured'];
        if (
          this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] &&
          this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] == 'YES'
        )
          partyModel = this.service.responseIO.data['Proposer'];
        await this.service.clearPartyDetails(partyModel);
        this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'lastname', '(CLIENT)');
        this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'proposerLASame', 'NO');
      } else {
        this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'proposerLASame', 'YES');
      }
    }
  }
}
