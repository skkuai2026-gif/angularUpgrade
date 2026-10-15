import {
  Component,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { sectionContents, planOptionContents } from './product-selection';
declare const initSlickSlider: any;
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProductSelectionHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  /**
   * Below inputs are to display the product in card format and how many cards per row.
   */
  @Input() familyCardPerRow: number;
  @Input() productCardPerRow: number;
  @Input() planOptionCardPerRow: number;

  respApplicableProducts: any;
  public displayPlan: boolean;
  public isCustomerPortal: boolean;
  //respApplicableProductsStr: string = null; //temporary just for rendering json

  // selectedProductSeq: number;
  // selectedProductId: string;
  // selectedProductFamily: string;
  // selectedProductPlanOption: string;
  //new
  displayPlanSelected: boolean;
  selectedProductDesc: string;
  selectedProductPlanOptionDesc: string;
  selectedProductPlanOptionCd: string;
  displayPlanOptionList: boolean;
  app_environment: string;
  @Output() notifyPrdSelection = new EventEmitter<boolean>();

  public searchFilterText: string;

  public isAllApplicableProductsReq: boolean;

  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService);
    this.displayPlanSelected = false;
    this.displayPlanOptionList = false;

    this.app_environment = SettingService.getApplicationPropertiesValue('APP_ENVIRONMENT');
    this.displayPlan = false;
    this.isCustomerPortal = this.settingService.isCustomerPortal();
    this.searchFilterText = null;
    this.isAllApplicableProductsReq = false;
    // console.log(this.settingService.commonLabels);
    // console.log(this.service.responseIO);
  }

  ngOnInit() {
    //alert(this.selectedStep.buttonList);
    // this.selectedProductSeq = this.service.responseIO.data.BasePlan.productSeq;
    // this.selectedProductId = this.service.responseIO.data.BasePlan.productId;
    // this.selectedProductPlanOption = this.service.responseIO.data.BasePlan.productPlanOptionCd;
    // this.selectedProductFamily = this.service.responseIO.data.BasePlan.productFamilyCd;
    this.selectedProductPlanOptionCd = this.service.responseIO.data.BasePlan.productPlanOptionCd;
    this.service.getApplicableProducts().subscribe(
      (successResponse) => {
        this.respApplicableProducts = JSON.parse(JSON.stringify(successResponse));
        this.respApplicableProducts = this.respApplicableProducts.data;

        if (
          this.respApplicableProducts.productFamilyList &&
          this.respApplicableProducts.productFamilyList.length == 0
        ) {
          if (this.selectedStep != undefined) this.selectedStep.hideFowardButtons();
        } else {
          if (this.selectedStep != undefined) this.selectedStep.resetForwardButtons();
        }
        if (
          this.service.responseIO.data.BasePlan != undefined &&
          this.service.responseIO.data.BasePlan.productFamilyCd != undefined &&
          this.service.responseIO.data.BasePlan.productFamilyCd != ''
        ) {
          this.displayPlanSelected = true;
        }
        if (
          this.service.responseIO.data.BasePlan != undefined &&
          this.respApplicableProducts.planOptionList[this.service.responseIO.data.BasePlan.productSeq] != undefined
        ) {
          // console.log(this.respApplicableProducts);
          // console.log(
          //     this.respApplicableProducts.planOptionList[
          //         this.service.responseIO.data.BasePlan.productSeq
          //     ]
          // );
          this.respApplicableProducts.planOptionList[this.service.responseIO.data.BasePlan.productSeq].filter(
            (option) => {
              if (option.cd == this.service.responseIO.data.BasePlan.productPlanOptionCd) {
                this.selectedProductPlanOptionDesc = option.desc;
              }
            }
          );
        }
        if (
          this.service?.responseIO?.data?.Entity?.productId != null &&
          this.respApplicableProducts.productList[this.service?.responseIO?.data?.Entity?.productFamilyCd]
            .length == 1
        )
          this.isAllApplicableProductsReq = true;

        // console.log(this.respApplicableProducts.length);
        //this.respApplicableProductsStr = JSON.stringify(this.respApplicableProducts, null, 2);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  onPlanOptionSelect(productPlanOptionCd: string, desc: string) {
    this.service.setFormDirty(true);
    if (this.selectedProductPlanOptionDesc == undefined || this.selectedProductPlanOptionDesc != desc) {
      this.service.responseIO.data.BasePlan.productPlanOptionCd = productPlanOptionCd;
      this.selectedProductPlanOptionDesc = desc;
      this.selectedProductPlanOptionCd = productPlanOptionCd;
      setTimeout(() => {
        this.displayPlanOptionList = false;
        this.displayPlan = true;
      }, 100);
    } else {
      this.service.responseIO.data.BasePlan.productPlanOptionCd = undefined;
      this.selectedProductPlanOptionDesc = undefined;
      this.selectedProductPlanOptionCd = undefined;
    }
    this.setTimeoutPromise(() => {
      this.initializeSectionSlider();
    }, 250);
    this.searchFilterText = null;
    this.scrollToTop();

    // console.log(this.settingService.getLabelValue(productPlanOptionCd));
  }

  onProductSelection(productSeq: any, productId: string, desc: string, productVersion: number, event: Event) {
    this.service.setFormDirty(true);
    if (productSeq != this.service.responseIO.data.BasePlan.productSeq) {
      //Clear the product UI facets from service as well if the product changes.
      this.service.productFacets = undefined;
    }
    if (
      this.service.responseIO.data.BasePlan.productId != productId ||
      this.service.responseIO.data.BasePlan.productSeq != productSeq ||
      this.service.responseIO.data.BasePlan.productVersion != productVersion
    ) {
      this.service.responseIO.data.BasePlan.productPlanOptionCd = undefined;
      this.selectedProductPlanOptionDesc = undefined;
    }
    this.service.responseIO.data.BasePlan.productId = productId;
    this.service.responseIO.data.BasePlan.productSeq = productSeq;
    this.service.responseIO.data.BasePlan.productVersion = productVersion;

    // this.service.responseIO.data.BasePlan.productPlanOptionCd = undefined;
    // this.selectedProductPlanOptionDesc = undefined;
    // this.selectedProductSeq = productSeq;
    // this.selectedProductId = productId;
    this.selectedProductDesc = desc;

    let userType =
      this.service.getUserLoginData() != undefined ? this.service.getUserLoginData()['userType'] : undefined;
    if (userType == 'CUSTOMER') this.displayPlanOptionList = false;
    else if (
      this.service.responseIO.data.BasePlan.productSeq != undefined &&
      this.respApplicableProducts.planOptionList[this.service.responseIO.data.BasePlan.productSeq] &&
      this.respApplicableProducts.planOptionList[this.service.responseIO.data.BasePlan.productSeq] != undefined &&
      this.respApplicableProducts.planOptionList[this.service.responseIO.data.BasePlan.productSeq].length > 0
    ) {
      this.displayPlanOptionList = true;
    }

    this.notifyPrdSelection.emit(true);
    this.searchFilterText = null;
    // this.scrollToTop();
  }
  onProductFamilySelection(productFamily: string) {
    this.service.setFormDirty(true);
    if (this.service.responseIO.data.BasePlan.productFamilyCd != productFamily) {
      this.service.responseIO.data.BasePlan.productFamilyCd = productFamily;
      this.service.responseIO.data.BasePlan.productId = undefined;
      this.service.responseIO.data.BasePlan.productSeq = undefined;
      this.service.responseIO.data.BasePlan.productPlanOptionCd = undefined;
      //Clear the product UI facets from service as well.
      this.service.productFacets = undefined;
    }
    this.displayPlanSelected = true;

    if (this.settingService.isBankPortal()) {
      this.displayPlanSelected = false;
      this.notifyPrdSelection.emit(true);
    }
    this.searchFilterText = null;
    this.scrollToTop();
  }

  onDeselectProductFamily() {
    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid) return;
    $('.sectionCategory').fadeIn();
    this.displayPlanSelected = false;
    if (this.displayPlanOptionList) this.displayPlanOptionList = false;
    this.searchFilterText = null;
    if (this.isAllApplicableProductsReq) this.viewAllApplicableProducts();
  }
  onDeselectPlanOption() {
    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid) return;
    $('.sectionCategory').fadeIn();
    this.displayPlanOptionList = false;
    this.searchFilterText = null;
  }

  initializePlanOptionSlider() {
    planOptionContents(4);
    this.setTimeoutPromise(() => {
      planOptionContents(4);
      this.scrollToTop();
    }, 15);
  }

  initializeSectionSlider() {
    sectionContents(3);
    this.setTimeoutPromise(() => {
      sectionContents(3);
    }, 15);
  }

  initializeProductFamilySlider() {
    var sliderElement = $('.productCategorySlider');
    initSlickSlider(sliderElement);
    this.setTimeoutPromise(() => {
      var sliderElement = $('.productCategorySlider');
      initSlickSlider(sliderElement);
    }, 15);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.displayPlanSelected = false;
    this.searchFilterText = null;
  }

  protected viewProducts(event: any) {
    if (event.target.checked) {
      this.viewAllApplicableProducts();
    }
  }

  private viewAllApplicableProducts() {
    let selProductId = this.service.responseIO.data.BasePlan.productId;
    let selProductSeq = this.service.responseIO.data.BasePlan.productSeq;
    this.service.setModelFieldValue(this.service?.responseIO?.data?.BasePlan, 'productSeq', undefined);
    this.service.setModelFieldValue(this.service?.responseIO?.data?.BasePlan, 'productId', undefined);
    this.service.getApplicableProducts().subscribe(
      (successResponse) => {
        this.respApplicableProducts = JSON.parse(JSON.stringify(successResponse));
        this.respApplicableProducts = this.respApplicableProducts.data;
        this.service.setModelFieldValue(this.service?.responseIO?.data?.BasePlan, 'productId', selProductId);
        this.service.setModelFieldValue(this.service?.responseIO?.data?.BasePlan, 'productSeq', selProductSeq);
        this.isAllApplicableProductsReq = false;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
