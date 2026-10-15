import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { PolicyService } from '../services/policy.service';
import { PolicySearchHandlerComponent } from './policy-search.handler';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';

@Component({
  selector: 'sym-policy-search',
  templateUrl: './policy-search.component.html',
  styleUrls: ['./policy-search.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicySearchComponent extends PolicySearchHandlerComponent implements OnInit {
  constructor(
    public service: PolicyService,
    public headerService: HeaderService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(service, headerService, router, route);
  }
  ngOnInit() {
    super.ngOnInit();
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'Search',
      },
    ];
  }
}
