import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { LeadActivityHandlerComponent } from './lead-activity.handler';

@Component({
  selector: 'sym-lead-activity',
  templateUrl: './lead-activity.component.html',
  styleUrls: ['./lead-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadActivityComponent extends LeadActivityHandlerComponent {
  constructor(leadService: LeadService) {
    super(leadService);
  }
}
