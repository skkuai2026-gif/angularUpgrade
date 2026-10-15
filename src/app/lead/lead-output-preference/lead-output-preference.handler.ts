import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadOutputPreferenceHandler extends BaseComponent<LeadService> implements OnChanges {
  constructor(leadService: LeadService) {
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
}
