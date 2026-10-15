import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { LeadPartyIdentityHandlerComponent } from './lead-party-identity.handler';

@Component({
  selector: 'sym-lead-party-identity',
  templateUrl: './lead-party-identity.component.html',
  styleUrls: ['./lead-party-identity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyIdentityComponent extends LeadPartyIdentityHandlerComponent {
  @Input() partyModel: any;
  @Input() model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }
}
