import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { BusinessCommonService } from '../service/business-common.service';

@Component({
  selector: 'sym-agent-search',
  templateUrl: './agent-search.component.html',
  styleUrls: ['./agent-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AgentSearchComponent extends BaseSearchComponent<BusinessCommonService> implements OnInit {
  constructor(public service: BusinessCommonService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
