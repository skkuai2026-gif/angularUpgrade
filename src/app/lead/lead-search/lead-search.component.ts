import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { LeadSearchHandlerComponent } from './lead-search.handler';
import { LeadService } from './../services/lead.service';
import { HeaderService } from './../../system-common/services/header.service';
import { PageHeader } from 'src/app/models/common/page-header';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-lead-search',
  templateUrl: './lead-search.component.html',
  styleUrls: ['./lead-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadSearchComponent extends LeadSearchHandlerComponent {
  showDownloadClientButton: boolean;
  constructor(public service: LeadService, public headerService: HeaderService, public router: Router) {
    super(service, headerService, router);
    this.addLink = '/lead';
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.showDownloadClientButton =
      SettingService.getApplicationPropertiesValue('DOWNLOADCLIENTFLAG') == 'YES' ? true : false;
  }
  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'Search - CLIENT';
    return header;
  }
  protected getMoreOptionList(): any[] {
    return [
      {
        id: 'Edit',
        link: '/lead/:id',
      },
      {
        id: 'Delete',
        link: '/lead-search',
      },
      // {
      //   id: 'Close',
      //   link: '/lead-search',
      // },
    ];
  }
}
