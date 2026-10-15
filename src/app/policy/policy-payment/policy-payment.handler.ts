import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { NavigationLink } from '../../models/common/navigation-link';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  responseUpdated: boolean;
  navigationLinkList: NavigationLink[];

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    this.loadNavigationLinkList();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();
    nav.link = 'initial_payment_Body';
    nav.labelKey = 'initialPayment';
    if (this.service.responseIO.data.InitialPayment != undefined) this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'renewal_payment_Body';
    nav.labelKey = 'renewalPayment';
    if (this.service.responseIO.data.RenewalPayment != undefined) this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'refund_payment_Body';
    nav.labelKey = 'refundPayment';
    if (this.service.responseIO.data.RefundPayment != undefined) this.navigationLinkList.push(nav);
  }
}
