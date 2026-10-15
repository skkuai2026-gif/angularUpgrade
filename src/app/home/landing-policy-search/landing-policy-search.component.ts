import { PolicyService } from 'src/app/policy/services/policy.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-landing-policy-search',
  templateUrl: './landing-policy-search.component.html',
  styleUrls: ['./landing-policy-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingPolicySearchComponent extends BaseSearchComponent<PolicyService> {
  constructor(public service: PolicyService, public router: Router, public settingService: SettingService) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected getMoreOptionList(): any[] {
    return [
      {
        id: 'Edit',
        link: '/policy/:id',
      },
      // {
      //     id: 'Delete',
      //     link: '/quotation-search',
      // },
      // {
      //     id: 'Copy',
      //     link: '/policy/:id',
      // },
      // {
      //     id: 'Summary',
      //     link: '/policy/:id',
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
  Copy_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' Copy');
    // this.service.copyQuotation(optionDetails.ref_id).subscribe(
    //     (quotation) => {
    //         // console.log(quotation);
    //         this.service.responseIO = JSON.parse(JSON.stringify(quotation));
    //         let link: string;
    //         link = optionDetails.link.toString().replace(
    //             ':id',
    //             this.service.responseIO.data.Entity.id
    //         );
    //         this.router.navigate([link]);
    //     },
    //     (error) => {
    //         console.log('Copy Quotation load failed.');
    //         console.log('Error:', error);
    //     }
    // );
  }
  Delete_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' Delete');
    // showLoader();
    // this.service.deleteQuotation(optionDetails.ref_id).subscribe(
    //     (deleteResponse) => {
    //         if (
    //             deleteResponse['message'] == 'Successful' &&
    //             deleteResponse['success']
    //         ) {
    //             this.router.navigate([optionDetails.link]);
    //             this.ngOnInit();
    //             hideLoader();
    //         } else {
    //             alert(
    //                 deleteResponse['message'] +
    //                     ' Something went wrong.Kindly try again!'
    //             );
    //         }
    //     },
    //     (error) => {
    //         console.log('Delete Quotation load failed.');
    //         console.log('Error:', error);
    //         hideLoader();
    //     }
    // );
  }
}
