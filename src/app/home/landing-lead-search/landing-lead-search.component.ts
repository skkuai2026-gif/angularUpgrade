import { LeadService } from './../../lead/services/lead.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { SearchResponseIO } from 'src/app/models/search-responseIO';

@Component({
  selector: 'sym-landing-lead-search',
  templateUrl: './landing-lead-search.component.html',
  styleUrls: ['./landing-lead-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingLeadSearchComponent extends BaseSearchComponent<LeadService> {
  constructor(public service: LeadService, public router: Router) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
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

    this.service.deleteLead(optionDetails.ref_id).subscribe(
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
    this.service.deleteLeads(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['message'] == 'Successful' && deleteResponse['success']) {
          this.reloadCurrentRoute();
        } else {
          this.error(deleteResponse['message'] + ' Something went wrong.Kindly try again!', undefined, true);
        }
      },
      (error) => {
        console.log('Delete Lead load failed.');
        console.log('Error:', error);
      }
    );
  }
  Close_click(optionDetails: { button_id; link; ref_id }) {
    this.service.closeLead(null, optionDetails.ref_id).subscribe(
      (closeResponse) => {
        if (closeResponse['message'] == 'Successful' && closeResponse['success']) {
          this.reloadCurrentRoute();
        } else {
          this.error(closeResponse['message'] + ' Something went wrong.Kindly try again!', undefined, true);
        }
      },
      (error) => {
        console.log('Close Lead load failed.');
        console.log('Error:', error);
      }
    );
  }
}
