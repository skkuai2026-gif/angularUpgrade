import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { LeadService } from '../services/lead.service';
import { LeadPartyDetailsHandlerComponent } from './lead-party-details.handler';

@Component({
  selector: 'sym-lead-party-details',
  templateUrl: './lead-party-details.component.html',
  styleUrls: ['./lead-party-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyDetailsComponent extends LeadPartyDetailsHandlerComponent {
  @Input() model: any;

  constructor(leadService: LeadService) {
    sessionStorage.setItem('updatedfields', '');
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected contactNum_change(item: FieldItem) {
    if (
      this.service.responseIO.data &&
      this.service.responseIO.data.LeadParty &&
      this.service.responseIO.data.LeadParty.AdditionalFieldsList &&
      this.service.responseIO.data.LeadParty.AdditionalFieldsList.length > 0
    ) {
      this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field1 = null;
      this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field2 = null;
      this.service.isTriggerOtpBtn = false;
    }
  }
  public onInputChanged(item: FieldItem) {
    if (
      this.service.responseIO.data.Entity.leadSource == undefined ||
      this.service.responseIO.data.Entity.leadSource == null
    )
      this.service.responseIO.data.Entity.leadSource = '';
    let fieldIds = ['firstName1', 'middleName1', 'lastName1', 'extensionName1', 'corporateName1'];

    if (fieldIds.includes(item.fieldCd) && item.model.addressTypeCd == undefined) {
      if (item.model.objName == 'LeadParty') {
        var updateFields = sessionStorage.getItem('updatedfields');
        updateFields += `,${item.fieldMetadata.LABELKEY}`;
        sessionStorage.setItem('updatedfields', updateFields);
      }
    }
    super.onInputChanged(item);
  }
}
