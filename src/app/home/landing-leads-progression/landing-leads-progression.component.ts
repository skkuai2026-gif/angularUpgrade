import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';

@Component({
  selector: 'sym-landing-leads-progression',
  templateUrl: './landing-leads-progression.component.html',
  styleUrls: ['./landing-leads-progression.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingLeadsProgressionComponent extends BaseSearchComponent<PolicyService> {
  constructor(public service: PolicyService, public router: Router) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
