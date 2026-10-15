import { Component, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyTransferToCustomerHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  @Output() isChangeAllocationSuccess = new EventEmitter<boolean>();

  flowType: any;
  messageDisplayed: {
    isMessageDisplayed: boolean;
    successMessage: string;
    errorMessage: string;
    success?: boolean;
  };

  constructor(policyService: PolicyService) {
    super(policyService);
    this.messageDisplayed = {
      isMessageDisplayed: false,
      successMessage: '',
      errorMessage: '',
    };
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  refreshMessageAndCloseModal() {
    setTimeout(() => {
      this.closeModal('policytransferToCustomer');
      if (this.messageDisplayed.success) {
        // this.service.reloadCurrentRoute();
        if (this.flowType === 'TRANSFER') {
          this.isChangeAllocationSuccess.emit(true);
          this.service.reloadCurrentRoute();
        } else this.service.reloadCurrentRoute();
      }
      this.messageDisplayed = {
        isMessageDisplayed: false,
        successMessage: '',
        errorMessage: '',
        success: undefined,
      };
    }, 5000);
  }

  onCancelClick() {
    this.closeModal('policytransferToCustomer');
  }

  onTransferClick() {
    if (
      this.service.responseIO.data.Entity.allocationPartyGuidList != '' &&
      this.service.responseIO.data.Entity.allocationPartyGuidList != undefined &&
      this.service.responseIO.data.Entity.allocationPartyGuidList != null
    ) {
      this.flowType = 'TRANSFER';
      this.changeAllocation();
    } else {
      this.warn(this.service.getMultilingualMessage('ERR_PLZSELECT', ['roleCd']));
      this.setFieldFocus(this.service.responseIO.data.Entity, 'allocationPartyGuidList');
    }
  }

  // onRevokeClick() {
  //   this.flowType = 'REVOKE';
  //   this.service.load(this.service.responseIO.data.Entity.id, null).subscribe((successResponseIO) => {
  //     this.service.responseIO = JSON.parse(JSON.stringify(successResponseIO));
  //     this.changeAllocation();
  //   });
  // }c

  //solved mantis issue Revoke button does not refresh after first revoke click during NF2F journey
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

  changeAllocation() {
    this.service.changeAllocation().subscribe(
      (responseIO) => {
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
        this.messageDisplayed.isMessageDisplayed = true;

        console.log(responseIO['message']);
        if (responseIO['message'] == 'eApp has been sent to client for review and signature.') {
          this.messageDisplayed.success = true;
        } else if (responseIO['message'] == 'Proposal has been transferred to Agent successfully.') {
          this.messageDisplayed.success = true;
        }

        // this.messageDisplayed.success = responseIO['success'];
        if (responseIO['success']) {
          this.messageDisplayed.successMessage = responseIO['message'];
        } else {
          this.messageDisplayed.errorMessage = responseIO['message'];
        }
        this.refreshMessageAndCloseModal();
      },
      (error) => {
        this.messageDisplayed.isMessageDisplayed = true;
        this.messageDisplayed.errorMessage = error.error.message;
        this.refreshMessageAndCloseModal();
        console.log('Transfer/Revoke failed.');
        console.log('Error:', error);
      }
    );
  }
}
