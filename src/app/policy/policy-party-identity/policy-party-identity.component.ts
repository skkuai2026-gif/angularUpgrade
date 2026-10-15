import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from './../services/policy.service';
import { PolicyPartyIdentityHandlerComponent } from './policy-party-identity.handler';

@Component({
  selector: 'sym-policy-party-identity',
  templateUrl: './policy-party-identity.component.html',
  styleUrls: ['./policy-party-identity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyIdentityComponent extends PolicyPartyIdentityHandlerComponent {
  @Input() partyModel: any;
  @Input() model: any;
  constructor(policyService: PolicyService, private settingService: SettingService) {
    super(policyService);
  }

  public onAddPartyIdentity(_event) {
    this.service.addPartyIdentity(this.partyModel);
  }
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.service.responseIO.data.Proposer.IdentityList.forEach((identity: any) => {
      identity['objName'] = this.service.responseIO.data.Proposer.IdentityList[0].objName;
    });
    this.service.responseIO.data.PrimaryInsured.IdentityList.forEach((identity: any) => {
      identity['objName'] = this.service.responseIO.data.PrimaryInsured.IdentityList[0].objName;
    });
  }

  ngOnInit(): void {
    this.service.responseIO.data.Proposer.IdentityList.forEach((identity: any) => {
      identity['objName'] = this.service.responseIO.data.Proposer.IdentityList[0].objName;
    });
    this.service.responseIO.data.PrimaryInsured.IdentityList.forEach((identity: any) => {
      identity['objName'] = this.service.responseIO.data.PrimaryInsured.IdentityList[0].objName;
    });
  }
  ngAfterViewInit() {
    const self = this;

    setTimeout(() => {
      $('#panel_IdentityList_Body').on('click', '.tooltip-label-info', (event) => {
        this.identityDetailsPopup();
      });
    }, 0);

    if (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED') {
      $(document).ready(function () {
        $('#panel_IdentityList_Body .btnAddTab').prop('disabled', true);
        $('#panel_IdentityList_Body .datadeletebtn').prop('disabled', true);
      });
    }
  }

  identityDetailsPopup() {
    this.openModal('identityDetailsPopup');
  }

  ngOnDestroy() {
    this.closeModal('identityDetailsPopup');
  }
  protected identityTypeCd_change(item: FieldItem) {
    if (this.settingService.getApplicationMode() === 'online') {
      this.service.setModelFieldValue(item.model, 'identityNum', undefined);
      this.service.setModelFieldValue(item.model, 'issueDt', null);
      this.service.setModelFieldValue(item.model, 'expiryDt', null);
    } else if (this.settingService.getApplicationMode() === 'offline') {
      this.service.setModelFieldValue(item.model, 'identityNum', '');
      this.service.setModelFieldValue(item.model, 'issueDt', '');
      this.service.setModelFieldValue(item.model, 'expiryDt', '');
    }
  }
}
