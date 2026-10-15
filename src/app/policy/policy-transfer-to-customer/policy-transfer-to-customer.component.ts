import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyTransferToCustomerHandlerComponent } from './policy-transfer-to-customer.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-transfer-to-customer',
  templateUrl: './policy-transfer-to-customer.component.html',
  styleUrls: ['./policy-transfer-to-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyTransferToCustomerComponent extends PolicyTransferToCustomerHandlerComponent {
  @Input() isViewMode: boolean = false;
  private originalPartyNames: any[] = [];
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  onRevokeClick() {
    this.flowType = 'REVOKE';
    this.service.load(this.service.responseIO.data.Entity.id, null).subscribe((successResponseIO) => {
      this.service.responseIO = JSON.parse(JSON.stringify(successResponseIO));
      if (this.service.responseIO.data.Entity.allocatedToRole != 'AGENT') {
        this.changeAllocation();
      } else {
        this.messageDisplayed.isMessageDisplayed = true;
        this.messageDisplayed.success = true;
        this.messageDisplayed.successMessage = this.service.getMultilingualLabel('transferredToAgent');
        this.refreshMessageAndCloseModal();
      }
    });
  }

  onCancelClick() {
    this.closeModal('policytransferToCustomer');
    this.closeModal('policytransferToCustomerView');
  }
  onTransferClick() {
    const entity = this.service.responseIO.data.Entity;
    if (
      entity.allocationPartyGuidList != '' &&
      entity.allocationPartyGuidList != undefined &&
      entity.allocationPartyGuidList != null
    ) {
      const selectedGuids = entity.allocationPartyGuidList.split(',');
      const proposerGuid = this.service.responseIO.data.Proposer?.guid;
      if (selectedGuids.length > 1) {
        const orderedGuids = [];
        if (selectedGuids.includes(proposerGuid)) {
          orderedGuids.push(proposerGuid);
        }
        selectedGuids.forEach((guid) => {
          if (guid !== proposerGuid) {
            orderedGuids.push(guid);
          }
        });
        entity.allocationPartyGuidList = orderedGuids.join(',');
      }
      console.log('final guid list', entity.allocationPartyGuidList);
      this.flowType = 'TRANSFER';
      this.changeAllocation();
    } else {
      this.warn(this.service.getMultilingualMessage('ERR_PLZSELECT', ['roleCd']));
      this.setFieldFocus(entity, 'allocationPartyGuidList');
    }
  }
  public allocationPartyGuidList_focus(item: FieldItem) {
    if (!this.originalPartyNames.length) {
      this.originalPartyNames = [...item.foptions];
    }

    const isParent =
      this.service.responseIO?.data?.Proposer?.relationCd === 'MOTH' ||
      this.service.responseIO?.data?.Proposer?.relationCd === 'FATH';
    const age = Number(this.service.responseIO?.data?.PrimaryInsured?.age);
    const field11 = this.service.responseIO?.data?.PolicyAdditionalFields?.field11?.trim();
    const insuredSameAsProposer = this.service.responseIO?.data?.Entity?.insuredSameAsProposer;
    const minor = age < 15;
    item.foptions = [...this.originalPartyNames];

    if ((isParent && minor) || (minor && field11 == 'N')) {
      item.foptions = this.originalPartyNames.filter(
        (x) => x.label?.startsWith('Owner:') || x.desc?.startsWith('Owner:')
      );
    }
  }
}
