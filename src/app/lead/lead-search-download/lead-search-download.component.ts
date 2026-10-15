import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { LeadSearchDownloadHandlerComponent } from './lead-search-download.handler';
import { LeadService } from '../services/lead.service';
import { HeaderService } from '../../system-common/services/header.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { AlertService } from 'src/app/system-common/services/alert.service';
import { PageHeader } from '../../models/common/page-header';
// import { el } from '@fullcalendar/core/internal-common';
import { SunphSearchComponent } from 'src/app/system-common/sunph-search/sunph-search.component';
@Component({
  selector: 'sym-lead-search-download',
  templateUrl: './lead-search-download.component.html',
  styleUrls: ['./lead-search-download.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadSearchDownloadComponent extends LeadSearchDownloadHandlerComponent {
  leadSIList: boolean = false;
  leadSiId: any;
  leadLastName1: any;
  leadEntityId: any;
  leadFirstName1: any;
  leadFNAId: any;
  IsExecuteSearchName: boolean;
  leadData: any;

  @ViewChild(SunphSearchComponent) searchComp!: SunphSearchComponent;

  constructor(
    public service: LeadService,
    public headerService: HeaderService,
    public router: Router,
    public alertService: AlertService,
    public settingService: SettingService
  ) {
    super(service, headerService, router);
    if (
      router.getCurrentNavigation() != undefined &&
      router.getCurrentNavigation().extras != undefined &&
      router.getCurrentNavigation().extras.state != undefined &&
      router.getCurrentNavigation().extras.state.IsExecuteSearchName != undefined
    ) {
      this.IsExecuteSearchName = router.getCurrentNavigation().extras.state.IsExecuteSearchName;
    } else {
      this.IsExecuteSearchName = false;
    }
  }
  async ngOnInit() {
    await this.getCompanyFacet();
    super.ngOnInit();
  }
  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    // header.title = 'Search - Lead';
    if (this.settingService.getApplicationMode() === 'online') {
      header.title = this.service.getMultilingualLabel('Search_Myclient');
    } else {
      header.title = this.service.getMultilingualLabel('Search_downloadClient');
    }
    return header;
  }
  Delete_click(optionDetails: { button_id; link; ref_id }) {
    this.leadData = this.service.searchResponseIO.data.searchCriteriaData;
    this.service.deleteLead(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['success'] == true) {
          this.success(
            deleteResponse['message'],
            () => {
              console.log(this.leadData);
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['lead-search'], {
                  state: {
                    IsExecuteSearchName: true,
                  },
                });
              });
            },
            false
          );
        } else {
          this.error(deleteResponse['message'], undefined, false);
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
        if (deleteResponse['success'] == true) {
          this.success(
            deleteResponse['message'],
            () => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['lead-search'], {
                  state: {
                    IsExecuteSearchName: true,
                  },
                });
              });
            },
            false
          );
        } else if (deleteResponse['data'] != undefined) {
          if (deleteResponse['data']['flag'])
            this.error(
              deleteResponse['message'],
              () => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['lead-search'], {
                    state: {
                      IsExecuteSearchName: true,
                    },
                  });
                });
              },
              false
            );
          else this.error(deleteResponse['message'], undefined, false);
        } else {
          this.error(deleteResponse['message'], undefined, false);
        }
      },
      (error) => {
        console.log('Delete Lead load failed.');
        console.log('Error:', error);
      }
    );
  }

  async getCompanyFacet() {
    if (this.service.companyFacets == undefined) {
      await this.loadCompanyFacets();
    }
  }
  protected loadCompanyFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    let productSeq = null;
    if (this.service.companyFacets == undefined) {
      this.service.getProductUIFacets(productSeq).subscribe(
        (facets) => {
          this.service.companyFacets = [];
          this.service.companyFacets = JSON.parse(JSON.stringify(facets));
          // console.log(facets);
          console.log('Company facets loaded successful.');
        },
        (error) => {
          console.log('Company facets load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  searchListResult: any;
  onDownloadButtonClick() {
    if (this.clientIdList == undefined || this.clientIdList.length == 0) {
      this.info('Please select client to import');
    } else {
      if (this.settingService.getApplicationMode() === 'online') {
        this.confirm(
          this.service.getMultilingualLabel('importClientConfirmation'),
          () => {
            this.service.downloadClientAction(this.clientIdList).subscribe((success) => {
              if (success['data'].error === true) {
                this.error(this.settingService.getLabelValue('C360FailNotification'));
              } else if (success['success'] === true) {
                this.confirm(
                  this.settingService.getLabelValue('insertedRecordCount'),
                  () => {
                    this.router.navigate(['/lead-search']);
                  },
                  () => {
                    this.reloadCurrentRoute();
                  },
                  'Proceed to Client Module',
                  'Add More Clients'
                );
              } else {
                this.error(success['message']);
              }
            });
          },
          (error) => {
            this.clientIdList = [];
            this.searchComp.clearSelection();
            console.log('Error:', error);
            console.log('Operation cancelled');
          }
        );
      } else if (this.settingService.getApplicationMode() === 'offline') {
        this.confirm(
          this.service.getMultilingualLabel('CONFIRM_MESSAGE_POPUP_OFFLINE'),
          () => {
            this.service.downloadClientAction(this.clientIdList).subscribe((success) => {
              if (success['success'] === true) {
                this.confirm(
                  this.settingService.getLabelValue('insertedRecordCount'),
                  () => {
                    this.router.navigate(['/lead-search']);
                  },
                  () => {
                    this.reloadCurrentRoute();
                  },
                  'Proceed to Client Module',
                  'Add More Clients'
                );
              } else {
                this.error(success['message']);
              }
            });
          },
          (error) => {
            this.clientIdList = [];
            this.searchComp.clearSelection();
            console.log('Error:', error);
            console.log('Operation cancelled');
          }
        );
      }
    }
  }

  confirm(
    message: string,
    okCallbackMethod?,
    cancelCallBackMethod?,
    okButtonLabel?: string,
    cancelButtonLabel?: string
  ) {
    let options = {
      okCallBack: okCallbackMethod,
      cancelCallBack: cancelCallBackMethod,
      isConfirmationAlert: true,
      okButLabel: okButtonLabel ? okButtonLabel : this.settingService.getLabelValue('CONFIRM_C360'),
      cancelButLabel: cancelButtonLabel ? cancelButtonLabel : this.settingService.getLabelValue('CANCEL'),
    };
    this.settingService.alertService.confirm(message, options);
  }

  receivedDownloadList: any;
  updateSearchResponseClick(e: any) {
    // if(this.clientIdList!=undefined)
    // prompt
    this.service
      .searchClient(e.callApi, this.service.searchResponseIO?.data?.searchCriteriaData)
      .subscribe((success) => {
        this.searchListResult = success;
      });
  }
  clientIdList: any[];
  onDownloadListUpdated(e: any) {
    if (e != undefined) {
      this.clientIdList = e;
      // this.onDownloadButtonClick();
    }
  }
  pageContainerErrorList: any;
  showModal(e: any) {
    let errors = e.split(',');
    this.pageContainerErrorList = errors;
    this.openErrorModal();
  }

  openErrorModal() {
    this.openModal('errorModal');
  }
  /**
   * This close the Error modal
   */
  closeErrorModal() {
    this.closeModal('errorModal');
  }
}
