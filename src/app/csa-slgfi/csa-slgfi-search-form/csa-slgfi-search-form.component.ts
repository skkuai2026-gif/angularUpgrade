import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { HeaderService } from '../../system-common/services/header.service';

import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';

@Component({
  selector: 'sym-csa-slgfi-search',
  templateUrl: './csa-slgfi-search-form.component.html',
  styleUrls: ['./csa-slgfi-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFISearchComponent extends BaseSearchComponent<CSASLGFIService> {
  constructor(public service: CSASLGFIService, public router: Router, public headerService: HeaderService) {
    super(service, router, headerService);
    this.addLink = '/csa-slgfi';
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

  protected getMoreOptionList(): any[] {
    return [
      {
        id: 'Edit',
        link: '/csa-slgfi/:id',
      },
      {
        id: 'Delete',
        link: '/csa-slgfi-search',
      },
      {
        id: 'Copy',
        link: '/csa-slgfi/:id',
      },
      // {
      //   id: 'Close',
      //   link: '/csa-slgfi-search',
      // },
    ];
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'Search - CSA';
    return header;
  }

  Copy_click(optionDetails: { button_id; link; ref_id }) {
    this.service.copyFNA(optionDetails.ref_id).subscribe(
      (fnaRequest) => {
        if (fnaRequest['message'] == 'Successful') {
          this.service.responseIO = JSON.parse(JSON.stringify(fnaRequest));
          let link: string;
          let url_id: any;
          url_id = this.service.responseIO.data.Entity.id;
          link = optionDetails.link.toString().replace(':id', url_id);
          this.router.navigate([link]);
        } else {
          this.error(fnaRequest['message']);
        }
      },
      (error) => {
        console.log('Copy FNA load failed.');
        console.log('Error:', error);
      }
    );
  }

  Edit_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' edit');

    let link: string;
    link = optionDetails.link.toString().replace(
      ':id',

      optionDetails.ref_id
    );

    this.router.navigate([link]);
  }

  Delete_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' Delete');

    this.service.deleteCSA(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['success'] == true) {
          this.success(
            deleteResponse['message'],
            () => {
              this.reloadCurrentRoute();
            },
            true
          );
          // alert(deleteResponse['message']);
          this.reloadCurrentRoute();
        } else {
          this.error(deleteResponse['message'], undefined, true);
          // alert(deleteResponse['message']);
        }
      },
      (error) => {
        console.log('Delete Lead load failed.');
        console.log('Error:', error);
      }
    );
  }

  Delete_All_click(optionDetails: { button_id; link; ref_id }) {
    this.service.deleteCSA(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['success'] == true) {
          this.success(deleteResponse['message'], () => {
            this.reloadCurrentRoute();
          });
        } else {
          this.error(deleteResponse['message'], undefined, true);
        }
      },
      (error) => {
        console.log('Delete Lead load failed.');
        console.log('Error:', error);
      }
    );
  }
  Close_click(optionDetails: { button_id; link; ref_id }) {
    this.service.closeCSA(null, optionDetails.ref_id).subscribe(
      (closeResponse) => {
        if (closeResponse['message'] == 'Successful' && closeResponse['success']) {
          this.reloadCurrentRoute();
        } else {
          this.error(closeResponse['message'] + ' Something went wrong.Kindly try again!', undefined, true);
        }
      },
      (error) => {
        console.log('Close CSA load failed.');
        console.log('Error:', error);
      }
    );
  }
}
