import { PageHeader } from './../../models/common/page-header';
import { StepItem } from './../../models/common/step-item';
import { FnaService } from './../service/fna-service.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FnaStepFormHandlerComponent } from './fna-step-form.handler';

@Component({
  selector: 'sym-fna-step-form',
  templateUrl: './fna-step-form.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaStepFormComponent extends FnaStepFormHandlerComponent {
  constructor(
    service: FnaService,
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

    // setTimeout(() => {
    //   if (document.getElementById('next_btn_1') != undefined) document.getElementById('next_btn_1').click();
    // }, 5);

    // this.settingService.loadScroll();
  }

  // protected getStepList(): StepItem[] {
  //   let stepList: StepItem[] = [
  //     new StepItem(
  //       0,
  //       'step_FNADataEntry',
  //       [
  //         {
  //           id: 'tab_basic',
  //           isSelected: true,
  //           modelList: ['FNAParty'],
  //         },
  //       ],
  //       ['but_Next', 'but_Previous']
  //     ),
  //   ];
  //   return stepList;
  // }
}
