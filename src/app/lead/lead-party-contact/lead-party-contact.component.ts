import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadService } from '../services/lead.service';
import { LeadPartyContactHandlerComponent } from './lead-party-contact.handler';

@Component({
  selector: 'sym-lead-party-contact',
  templateUrl: './lead-party-contact.component.html',
  styleUrls: ['./lead-party-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyContactComponent extends LeadPartyContactHandlerComponent implements OnChanges {
  @Input() model: any;
  constructor(leadService: LeadService, public settingService: SettingService) {
    super(leadService, settingService);
  }
}
