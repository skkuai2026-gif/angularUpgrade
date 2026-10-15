import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { QuotationMainstepFormHandlerComponent } from './quotation-main-step-form.handler';
import { QuotationService } from '../services/quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-quotation-main-step-form',
  templateUrl: './quotation-main-step-form.component.html',
  styleUrls: ['./quotation-main-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationMainStepFormComponent extends QuotationMainstepFormHandlerComponent implements OnInit {
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }
}
