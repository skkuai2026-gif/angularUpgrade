import { ActivatedRoute, Router } from '@angular/router';
import { StepItem } from 'src/app/models/common/step-item';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { PolicyCustomerPaymentGatewayFormHandlerComponent } from './policy-customer-payment-gateway-form.handler';

@Component({
  selector: 'sym-policy-customer-payment-gateway-form',
  templateUrl: './policy-customer-payment-gateway-form.component.html',
  styleUrls: ['./policy-customer-payment-gateway-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerPaymentGatewayFormComponent
  extends PolicyCustomerPaymentGatewayFormHandlerComponent
  implements OnInit
{
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

  ngOnInit(): void {
    super.ngOnInit();
  }
}
