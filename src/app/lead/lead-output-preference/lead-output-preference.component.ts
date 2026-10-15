import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { LeadOutputPreferenceHandler } from './lead-output-preference.handler';
import { LeadService } from '../services/lead.service';

@Component({
  selector: 'sym-lead-output-preference',
  templateUrl: './lead-output-preference.component.html',
  styleUrls: ['./lead-output-preference.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadOutputPreferenceComponent extends LeadOutputPreferenceHandler implements OnInit {
  @Input() displayLeft: boolean;
  @Input() prefix: string;
  constructor(leadService: LeadService) {
    super(leadService);
    this.displayLeft = false;
    this.prefix = undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
