import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageHeader } from 'src/app/models/common/page-header';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { PolicyService } from '../services/policy.service';
import { BreadCrumb } from './../../models/common/bread-crumb';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicySearchHandlerComponent extends BaseSearchComponent<PolicyService> implements OnInit {
  constructor(
    public service: PolicyService,
    public headerService: HeaderService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(service, router, headerService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'SearchProposal';
    header.additionalInfo =
      this.service.getSessionStorageValue('insuranceTypeCd') != undefined
        ? '(' + this.service.getSessionStorageValue('insuranceTypeCd') + ')'
        : undefined;
    return header;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'E-Application',
        link: '/policy-insurance-type',
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
    // console.log(optionDetails.ref_id, ' edit');l
    const param = this.route.snapshot.paramMap.get('api');

    let link: string;
    if (param != 'api') {
      link = optionDetails.link.toString().replace(
        ':id',

        optionDetails.ref_id
      );
    } else {
      link = 'policyAPI/' + optionDetails.ref_id;
    }

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
