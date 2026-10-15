import { FnaService } from './../../fna/service/fna-service.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-landing-fna-search',
  templateUrl: './landing-fna-search.component.html',
  styleUrls: ['./landing-fna-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingFnaSearchComponent extends BaseSearchComponent<FnaService> {
  constructor(public service: FnaService, public router: Router) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected getMoreOptionList(): any[] {
    let optionList: any[];
    optionList = [];
    if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
      optionList.push({
        id: 'Edit',
        link: '/csa-slgfi/:id',
      });
      optionList.push({
        id: 'Delete',
        link: '/csa-slgfi-search',
      });
      optionList.push({
        id: 'Copy',
        link: '/csa-slgfi/:id',
      });
    } else {
      optionList.push({
        id: 'Edit',
        link: '/csa/:id',
      });
      optionList.push({
        id: 'Delete',
        link: '/csa-search',
      });
      optionList.push({
        id: 'Copy',
        link: '/csa/:id',
      });
    }
    return optionList;
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
}
