import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadService } from '../services/lead.service';
import { LeadPartyAddressTabsHandlerComponent } from './lead-party-address-tabs.handler';

@Component({
  selector: 'sym-lead-party-address-tabs',
  templateUrl: './lead-party-address-tabs.component.html',
  styleUrls: ['./lead-party-address-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyAddressTabsComponent extends LeadPartyAddressTabsHandlerComponent {
  @Input() responseUpdated: boolean;
  @Input() partyModel: any;
  @Input() model: any;

  constructor(leadService: LeadService, public settingService: SettingService) {
    super(leadService, settingService);
  }
}
