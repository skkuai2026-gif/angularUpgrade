import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PolicyMainstepFormHandlerComponent } from './policy-main-step-form.handler';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-policy-main-step-form',
  templateUrl: './policy-main-step-form.component.html',
  styleUrls: ['./policy-main-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyMainStepFormComponent extends PolicyMainstepFormHandlerComponent implements OnInit {
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }
}
