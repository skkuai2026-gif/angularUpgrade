import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { LeadService } from '../services/lead.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadBasicHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  constructor(leadService: LeadService) {
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
