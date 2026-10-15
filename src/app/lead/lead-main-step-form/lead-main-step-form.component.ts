import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadService } from '../services/lead.service';
import { LeadMainStepFormComponentHandler } from './lead-main-step-form.handler';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-lead-main-step-form-component',
  templateUrl: './lead-main-step-form.component.html',
  styleUrls: ['./lead-main-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadMainStepFormComponent extends LeadMainStepFormComponentHandler implements OnInit {
  constructor(
    service: LeadService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }
}
