import { BaseComponent } from 'src/app/system-common/base/base.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseService } from '../services/base.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { SettingService } from '../services/setting.service';
import { StepItem } from 'src/app/models/common/step-item';
import { PageHeader } from 'src/app/models/common/page-header';
import { HeaderService } from '../services/header.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { TabItem } from 'src/app/models/common/tab-items';
import { Location } from '@angular/common';
declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-base-step-form',
  template: ` <p>base-step form works!</p> `,
  providers: [Location, SettingService, HeaderService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export abstract class BaseStepFormComponent<S extends BaseService>
  extends BaseComponent<BaseService>
  implements OnInit
{
  protected id: number;
  public stepList: StepItem[];
  // public selectedStep: StepItem;
  public breadCrumbList: BreadCrumb[];
  public responseUpdated: boolean;
  public isDataSaved: boolean;
  protected queryParams: Params;

  constructor(
    @Inject('service') public service: S,
    public route: ActivatedRoute,
    public router: Router,
    private location: Location,
    public settingService: SettingService,
    public headerService: HeaderService
  ) {
    super(service);
    this.isDataSaved = false;
  }

  ngOnInit() {
    this.service.setFormDirty(false);
    this.loadQueryParameters();
    this.stepList = [];
    this.stepList = this.getStepList();
    this.setComponentListToDisplay(this.getComponentListToDisplay());
    this.breadCrumbList = [];
    let brdcl = this.getBreadCrumbList();
    if (brdcl != undefined) this.breadCrumbList = brdcl;
    this.loadInitData();
    this.headerService.optionsObservable.subscribe((Options) => {
      if (!this.headerService.isOptionCalled && Options) {
        this.selectedOptions(Options);
      }
    });
  }

  private loadQueryParameters() {
    this.queryParams = this.route.snapshot.queryParams;
  }

  /**
   * This is to load data after init.
   */
  protected loadInitData(modelNameList?: string[]) {
    //first load the data only with entity to find out the step
    if (modelNameList != undefined) this.loadDetails(null, modelNameList, false);
    else this.loadDetails(null, ['Entity'], false);
  }

  ngOnDestroy() {
    this.service.clear();
    this.headerService.clear();
    if (this.altService != undefined) {
      this.altService.clear();
    }
    if (this.settingService.buttonid != undefined) {
      this.settingService.buttonid = undefined;
    }
  }

  protected abstract getStepList(): StepItem[];
  protected abstract getPageHeader(): PageHeader;
  //Adding default empty implementation
  protected getBreadCrumbList(): BreadCrumb[] {
    return [];
  }

  /**
   * This is triggered after a event is emitted from the header option selected
   * @param buttonClicked JSON Object contains  { id; link; } of the selected option.
   */
  selectedOptions(buttonClicked: { id: string; link: string }) {
    let functionName: string;
    if (buttonClicked.id != undefined) {
      functionName = buttonClicked.id.replace(' ', '_') + '_click';

      if (typeof this[functionName] === 'function') {
        eval('this.' + functionName + '(buttonClicked)');
        this.headerService.isOptionCalled = true;
      }
    }
  }

  /**
   * This is to get the JSON Object of Model names.
   * e.g: getModelNameBodyList(modelNameList)
   * @param modelNameList expects the model's name.
   * @returns JSON Object of model name list
   */
  protected getModelNameBodyList(modelNameList: string[]): any[] {
    let modelNameBodyList = [];
    if (modelNameList != undefined)
      modelNameList.filter((name) => {
        let body = {
          ModelName: name,
        };
        modelNameBodyList.push(body);
      });
    return modelNameBodyList;
  }

  /**
   * This set the selected step
   * @param nextStepObj expects the next step item
   * @param nextTabObj expects the next tab item
   */
  protected setSelectedStep(nextStepObj: StepItem, nextTabObj?: TabItem): void {
    this.preStepSelection(nextStepObj);
    nextStepObj.setVisibleTabCount();
    this.onStepLoaded(nextStepObj);
    this.selectedStep = nextStepObj;
    if (nextTabObj == undefined || nextTabObj == null) this.setSelectedActiveTab(this.selectedStep.tabList[0]);
    else this.setSelectedActiveTab(nextTabObj);
    // console.log(this.selectedStep);
    this.setStepStatus();
  }

  protected setSelectedActiveTab(nextTabObj: TabItem): void {
    if (nextTabObj != undefined) {
      this.selectedStep.selectedTab = nextTabObj;
      //this.service.currentActiveTab = null;
    }
  }

  /**
   * @ignore
   */
  private setStepStatus() {
    this.stepList.forEach((stepItem: StepItem) => {
      if (this.selectedStep.index == stepItem.index) stepItem.status = 'active';
      else {
        //if the step in db is equal to all the possible steps lenght then the
        //workflow is complete
        if (this.service.responseIO.data.Entity.step >= this.stepList.length) {
          stepItem.status = 'completed';
        } else {
          this.setCustomStepStatus(stepItem);
        }
      }
    });
  }

  /**
   * Override this function if set step status on the basis of some condition.
   * @param stepItem - current step
   */
  protected setCustomStepStatus(stepItem: StepItem): void {
    if (stepItem.index < this.selectedStep.index) stepItem.status = 'completed';
    else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
  }

  /**
   * Override this function if any checks needs to be done on the step object.
   * @param nextStepObj - next step to be selected
   */
  protected preStepSelection(nextStepObj: StepItem): void {}

  /**
   * @ignore
   */
  private loadDetails(
    nextStepObj: StepItem,
    modelNameList?: string[],
    isMetadataReqd?: boolean,
    nextTabObj?: TabItem
  ) {
    let service = this.altService != undefined ? this.altService : this.service;
    if (
      modelNameList == null ||
      (modelNameList == undefined &&
        nextStepObj != null &&
        nextStepObj != undefined &&
        nextStepObj.tabList != undefined &&
        nextStepObj.tabList[0] &&
        nextStepObj.tabList.length > 1)
    ) {
      modelNameList =
        nextStepObj.tabList != undefined && nextStepObj.tabList[0] != undefined
          ? nextStepObj.tabList[0].modelList
          : undefined;
    }

    //if this.id is already set no need to fetch from parammap.
    if (this.id == undefined || this.id == 0) {
      const uid = this.route.snapshot.paramMap.get('id');
      //alert('uid:' + uid);
      this.id = +uid;
    }
    if (this.altService == undefined) service.id = this.id;
    //if the currentactivetab is null implies it is either called from new or search
    //then consider the active steps first tab
    if (nextTabObj != null) service.currentActiveTab = nextTabObj.id;
    else if (nextStepObj == null) {
      if (this.stepList.length > 0) service.currentActiveTab = this.stepList[0].tabList[0].id;
    } else {
      if (nextStepObj.selectedTab != null) service.currentActiveTab = nextStepObj.selectedTab.id;
      else service.currentActiveTab = nextStepObj.tabList[0].id;
    }

    //set currentActiveStep on load
    if (nextStepObj == null) {
      service.currentActiveStep = this.stepList[0].id;
      service.currentActiveStepObj = this.stepList[0];
    } else {
      service.currentActiveStep = nextStepObj.id;
      service.currentActiveStepObj = nextStepObj;
    }

    if (this.selectedStep != null) this.selectedStep.selectedTab = undefined;
    //this.route.paramMap.subscribe((map) => {
    if (this.id != 0) {
      let modelNameBodyList = this.getModelNameBodyList(modelNameList);
      this.preLoad();
      service.load(service.id, modelNameBodyList, isMetadataReqd).subscribe(
        async (body) => {
          service.responseIO = new ResponseIO();
          service.responseIO = JSON.parse(JSON.stringify(body));
          //console.log('loaded details:' + service.responseIO);
          if (service.responseIO.lookupkeyFOptionList == undefined) service.responseIO.lookupkeyFOptionList = {};
          let currPageHeader = this.getPageHeader();
          if (currPageHeader != undefined) this.headerService.pageHeader = currPageHeader;
          await this.postLoad(nextStepObj);

          if (nextStepObj == null) {
            if (service.responseIO.data.Entity.step == null || service.responseIO.data.Entity.step == undefined) {
              service.responseIO.data.Entity.step = 0;
            }
            let dbStep: number = service.responseIO.data.Entity.step;
            this.stepList = this.getStepList();
            if (dbStep >= this.stepList.length) dbStep = 0;
            nextStepObj = this.setNextStep(dbStep);
            this.loadDetails(nextStepObj);
          } else {
            this.stepList = this.getStepList();
            nextStepObj = this.setNextStep(nextStepObj.index);
            this.setSelectedStep(nextStepObj, nextTabObj);
            this.setValidationErrors();
          }
          //  console.log(service.responseIO);
          console.log('Data loaded successful.');
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    } else if (this.id == 0) {
      // this.id = 0;
      //if new quotation then set the step to the first 1.
      if (nextStepObj == null) {
        nextStepObj = this.stepList[0];
        this.loadDetails(nextStepObj);
        return;
      }
      let modelNameBodyList = this.getModelNameBodyList(modelNameList);
      service.init(modelNameBodyList).subscribe(
        (body) => {
          service.responseIO = JSON.parse(JSON.stringify(body));
          this.headerService.pageHeader = this.getPageHeader();
          this.setSelectedStep(nextStepObj);
          this.mergeStepList();
          this.postInit();
          //this logic is required for offline since on init itself the id gets generated
          let objectId = service.responseIO.data.Entity.object;
          if (objectId != undefined) {
            // this.location.go(
            //     this.route.snapshot.url[0].path + '/' + objectId
            // );
            // this.router.navigate([this.route.snapshot.url[0].path + '/' + objectId]);
            //    this.router.navigate([this.route.snapshot.url[0].path , objectId],
            //     {queryParams: {id: objectId}});
            //this.router.navigate(['/' + this.route.snapshot.url[0].path , {id: objectId}]);
            //this.router.navigate([this.route.snapshot.url[0].path , objectId]);
            service.id = objectId;
            this.id = objectId;
            this.location.go(this.router.createUrlTree([this.router.url, objectId]).toString());
          }
          // console.log(service.responseIO);
          console.log('Data Init successful.');
        },
        (error) => {
          console.log('Data Init failed.');
          console.log('Error:', error);
        }
      );
    }
    //  });
  }

  private setNextStep(stepIndex: number): StepItem {
    let nextStepObj;
    //set the instance of nextStepObj based on the new objects returned
    this.stepList.filter((stepItem: StepItem) => {
      if (stepItem.index == stepIndex) nextStepObj = stepItem;
    });
    return nextStepObj;
  }

  /**
   * Override this function if custom logic for step list is required based on data. eg. steps need to be added/ removed
   * if this function is overridden then call this function itself from getStepList function and dont implement steps logic at multiple places
   * @returns list of StepItem to be rendered
   */
  protected getCustomStepList(): StepItem[] {
    return undefined;
  }
  /**
   * This function should be overridden in case certain settings are required to be done prior to
   * saving the current tab.
   * @param currTabIdToBeProcessed - the current tab id being saved
   * @returns true if you want to continue with saving else return false
   */
  protected preProcess(): boolean {
    return true;
  }

  /**
   *
   * @param modelNameList is used to fetch the data of the next tab while caling the save API
   * Used to call save api with updated values.
   */
  protected saveUpdatedModels(
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string
  ) {
    let service = this.altService != undefined ? this.altService : this.service;
    if (!this.preProcess()) {
      //if data is not to be saved.. then just called load for the nex tab
      //alert('loading data after' + currTabIdToBeProcessed);
      if (nextStepObj != undefined && nextStepObj != null) this.loadDetails(nextStepObj);
      else if (nextTabObj != undefined && nextTabObj != null)
        this.loadDetails(currentStepObj, nextTabObj.modelList, true, nextTabObj);
      return;
    }
    //save with the current step model list itself.
    let modelNameList;
    if (nextTabObj != undefined && nextTabObj != null) {
      modelNameList = nextTabObj.modelList;
    } else {
      modelNameList =
        currentStepObj.selectedTab == undefined
          ? currentStepObj.tabList[0].modelList
          : currentStepObj.selectedTab.modelList;
    }

    let modelNameBodyList = this.getModelNameBodyList(modelNameList);
    service.responseIO.data.Entity.step = currentStepObj.index;
    this.setVisitedTabs();
    //set the action as continue with the current step tab list
    if (
      nextStepObj != null &&
      (nextStepObj.index != currentStepObj.index || nextStepObj.index == this.stepList.length - 1)
    ) {
      this.setStepActionTab(currentStepObj);
    }
    //responseUpdated
    this.responseUpdated = false;
    this.isDataSaved = false;

    if (nextTabObj != null) service.currentActiveTab = nextTabObj.id;
    else if (currentStepObj != null && currentStepObj.selectedTab != null)
      service.currentActiveTab = currentStepObj.selectedTab.id;
    // else if(nextStepObj!=null)
    //     service.currentActiveTab = nextStepObj.tabList[0].id;
    //set currentActiveField as undefined..no need of that currentActiveField on save...because of this dual case issue occurs.
    service.currentActiveField = undefined;
    service.process(service.id, modelNameBodyList).subscribe(
      (body) => {
        this.isDataSaved = true;
        this.onSaveUpdatedModels(body, currentStepObj, nextStepObj, nextTabObj, buttonId);
      },
      (error) => {
        console.log('Data updated failed.');
        console.log('Error:', error);
      }
    );
  }

  protected setStepActionTab(currentStepObj: StepItem) {
    let service = this.altService != undefined ? this.altService : this.service;
    let stepActionTabs: string = '';
    for (var tabCount = 0; tabCount < currentStepObj.tabList.length; tabCount++) {
      stepActionTabs = stepActionTabs + currentStepObj.tabList[tabCount].id + ',';
    }
    service.responseIO.data.Entity.stepActionTabs = stepActionTabs;
  }

  /**
   * Implement this function if any logic is required after saving data.
   */
  protected postProcess(): void {}

  /**
   * Implement this function if any logic is required upon loading data
   */
  protected postLoad(nextStepObj?: StepItem): void {}

  /**
   * Implement this function if any logic is required before loading data
   */
  protected preLoad(): void {}

  /**
   * Implement this function if any logic is required upon init data
   */
  protected postInit(): void {}

  /**
   * Implement this function to load the dynamic component list
   */
  protected getComponentListToDisplay() {}

  protected onSaveUpdatedModels(
    body: any,
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string,
    shouldContinue?: boolean
  ) {
    shouldContinue = shouldContinue == undefined ? true : shouldContinue;
    let service = this.altService != undefined ? this.altService : this.service;
    service.responseIO = new ResponseIO();
    service.responseIO = JSON.parse(JSON.stringify(body));
    if (service.responseIO.lookupkeyFOptionList == undefined) service.responseIO.lookupkeyFOptionList = {};
    // console.log(service.responseIO);
    this.headerService.pageHeader = this.getPageHeader();
    let isContinueClicked: boolean =
      nextStepObj != null && nextStepObj.index != currentStepObj.index ? true : false;
    //assuming continue is clicked even if last step since beyond this there is no step
    if (nextStepObj != null && nextStepObj.index == this.stepList.length - 1) isContinueClicked = true;

    this.setValidationErrors(isContinueClicked);
    //check if continue is clicked and there are errors on the current step then also set responseupdated = true
    // console.log(isContinueClicked, this.selectedStep.errorCount);
    if (isContinueClicked && this.selectedStep.errorCount > 0) {
      this.responseUpdated = true;
    }
    if (nextTabObj != null && nextTabObj != undefined) {
      //if same tab id then we want to mark that the response is updated
      //this acts as a trigger to do any initializing on the active component
      //as responseUpdated is an input to components.
      if (this.selectedStep.selectedTab.id == nextTabObj.id) this.responseUpdated = true;
      this.setSelectedActiveTab(nextTabObj);
    } else {
      if (!isContinueClicked) this.responseUpdated = true;
    }

    this.mergeStepList();
    //  console.log(this.responseIO);
    let objectId = service.responseIO.data.Entity.id;
    if (objectId != undefined) {
      if (this.id == 0) {
        // this.location.go(
        //     this.route.snapshot.url[0].path + '/' + objectId
        // );
        //this.router.navigate(['/' + this.route.snapshot.url[0].path , {id: objectId}]);
        //this.router.navigate(['/' + this.route.snapshot.url[0].path + '/' + objectId]);
        //this.router.navigate([this.route.snapshot.url[0].path , objectId],
        //            {queryParams: {id: objectId}});
        //this.router.navigate([this.route.snapshot.url[0].path , objectId]);
        service.id = objectId;
        this.id = objectId;
        // This is used when the InsuranceTypeCd is present in the URL for any Quotation to be loaded
        if (this.route.snapshot.url.length > 1) {
          let urlSegments = this.route.snapshot.url;
          let updatedSegments = urlSegments.map((segment) => (segment.path === '0' ? objectId : segment.path));
          // let urlTree = this.router.createUrlTree(updatedSegments);
          this.location.go(this.router.createUrlTree(updatedSegments).toString());
          // this.router.navigateByUrl(urlTree);
        } else {
          this.location.go(this.router.createUrlTree([this.router.url, objectId]).toString());
        }
        //alert('after location.go');
      }
    }
    this.service.setFormDirty(false);
    console.log('Data updated successful.');
    this.postProcess();

    //once data is saved check if there are any exceptions to be cleared for the current step tab
    //if so user has to remain on this step itself
    if (nextStepObj != null && nextStepObj.index != currentStepObj.index) {
      if (currentStepObj.errorCount == 0 || currentStepObj.errorCount == undefined || this.continueWithWarning()) {
        //load the next step..
        //saving is not required since step has got incremented in save itself in API
        if (shouldContinue) {
          currentStepObj.selectedTab = undefined;
          // this.loadDetails(nextStepObj);
          // setScrollAndScreenHeight();
          this.onStepChanged(nextStepObj);
        }
      } else {
        this.showErrorToast();
      }
    }
  }

  protected showErrorToast(): void {
    this.checkPreviousStepError();
    this.selectedStep.displayErrorToast = true;
    setTimeout(() => {
      this.selectedStep.displayErrorToast = false;
    }, 6000);
  }

  /**
   * @ignore
   */
  protected setValidationErrors(moveNextStep?: boolean) {
    // console.log(validationerrors);
    let service = this.altService != undefined ? this.altService : this.service;
    let stepErrorCount: number = 0;
    let stepValidationErrors = [];
    let errorList = [];
    let validationerrors = service.responseIO.validationerrors;

    let visitedTabs: string = '';
    let visitedTabsArr = null;
    //if we need to move to the next step then consider even the errors for non visited tabs
    // if (!moveNextStep) {
    if (
      service.responseIO.data.Entity.visitedTabs != undefined &&
      service.responseIO.data.Entity.visitedTabs != null
    )
      visitedTabs = service.responseIO.data.Entity.visitedTabs;
    visitedTabsArr = visitedTabs.split(',');
    // }

    if (validationerrors == undefined && this.selectedStep != undefined) {
      this.selectedStep.errorCount = 0;
      this.selectedStep.validationErrors = undefined;
      if (this.selectedStep.selectedTab != undefined) {
        this.selectedStep.selectedTab.errorCount = 0;
        //if no errors but is visited then set successfully completed
        // if (visitedTabsArr != null && visitedTabsArr.includes(this.selectedStep.selectedTab.id)) {
        //   this.selectedStep.selectedTab.isSuccessfullyCompleted = true;
        // }

        this.selectedStep.tabList.forEach((tabItem: TabItem) => {
          if (visitedTabsArr != null && visitedTabsArr.includes(tabItem.id)) {
            tabItem.isSuccessfullyCompleted = true;
          }
        });
      }
      //splice is required  to remove step item and replace current step
      this.stepList.splice(this.selectedStep.index, 1, this.selectedStep);

      /**
       * Confirm with maam if we can check against statuscd
       */
      // if (
      //   this.service.responseIO.data.Entity.quoteStatusCd == 'ACCEPTED' ||
      //   this.service.responseIO.data.Entity.quoteStatusCd == 'COMPLETED' ||
      //   this.service.responseIO.data.Entity.statusCd == 'SUBMITTED'
      // ) {
      //   this.selectedStep.tabList.filter((tab) => {
      //     tab.isSuccessfullyCompleted = true;
      //     /**
      //      * check with maam if once they are complete all tab displayed should have check mark or again visited check needs to be done
      //      */
      //     if (visitedTabsArr != null && visitedTabsArr.includes(tab.id)) {
      //       // console.log(tab);
      //       tab.isSuccessfullyCompleted = true;
      //     }
      //   });
      // }
      return;
    }
    //loop through all the tabs within this step
    for (var e = 0; e < this.selectedStep.tabList.length; e++) {
      let tabErrorCount = 0;
      let tabItem: TabItem = this.selectedStep.tabList[e];
      tabItem.isSuccessfullyCompleted = false;

      if (validationerrors[tabItem.id] == undefined) {
        tabItem.errorCount = 0;
        //if no errors but is visited then set successfully completed
        if (visitedTabsArr != null && visitedTabsArr.includes(tabItem.id)) {
          tabItem.isSuccessfullyCompleted = true;
        }
        continue;
      }

      if (!moveNextStep && visitedTabsArr != null && !visitedTabsArr.includes(tabItem.id)) {
        tabItem.errorCount = 0;
        continue;
      }
      for (let modelGuid in validationerrors[tabItem.id]) {
        for (let fieldCd in validationerrors[tabItem.id][modelGuid]) {
          errorList.push(validationerrors[tabItem.id][modelGuid][fieldCd]);
          stepErrorCount++;
          tabErrorCount++;
        }
      }

      tabItem.errorCount = tabErrorCount;
      //if no tab errors found and the tab has been visited implies it is successfully completed.
      if (tabErrorCount == 0) {
        tabItem.isSuccessfullyCompleted = true;
      }
      let errorName: string =
        tabItem.text != undefined
          ? this.settingService.getLabelValue(tabItem.text)
          : this.settingService.getLabelValue(tabItem.id);
      stepValidationErrors.push({
        name: errorName,
        errors: errorList,
      });
      errorList = [];
    } //end tab loop
    this.selectedStep.errorCount = stepErrorCount;
    this.selectedStep.validationErrors = stepValidationErrors;
    //splice is required  to remove step item and replace current step
    this.stepList.splice(this.selectedStep.index, 1, this.selectedStep);
    // console.log(this.selectedStep);
    // console.log(this.stepList);
  }

  /**
   *
   * @param nextStepObj - the step that is selected
   * triggered when step is changed.
   * step can be changed only when moving backward so we wont be saving data but loading data
   */
  public onStepChanged(nextStepObj: StepItem) {
    //alert(this.selectedTab.id + param.id)
    if (this.selectedStep.id != nextStepObj.id) {
      this.loadDetails(nextStepObj);

      setScrollAndScreenHeight();
      // console.log(param);
    } else {
      // alert("Already selected")
    }
  }

  /**
   *
   * @param param expects the tab item selected
   * triggered when tab is changed.
   * Calls the save method to save the changes done in the current selected tab.
   */
  public onTabChanged(nextTabObj: TabItem) {
    //alert(this.selectedTab.id + param.id)
    if (this.selectedStep.selectedTab.id != nextTabObj.id) {
      // console.log(this.service.responseIO.data)
      // console.log(nextTabObj);
      this.saveUpdatedModels(this.selectedStep, null, nextTabObj);
      // console.log(param);
    } else {
      // alert("Already selected")
    }
  }

  private onStepLoaded(nextStepObj: StepItem) {
    //check if back/continue/save button is clicked accordingly write logic
    let functionName: string;
    functionName = nextStepObj.id + '_load';

    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(nextStepObj)');
    }
  }

  public onActionClicked(buttonId: string) {
    //check if back/continue/save button is clicked accordingly write logic
    this.service.setFormDirty(false);
    let functionName: string;
    functionName = buttonId + '_click';
    this.mergeStepList();
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '()');
    }
  }

  protected mergeStepList(): void {
    let newStepList: StepItem[] = this.getStepList();
    newStepList.forEach((newStepItem: StepItem) => {
      this.stepList.filter((thisStepItem: StepItem) => {
        if (thisStepItem.id == newStepItem.id) {
          Object.assign(newStepItem, {
            status: thisStepItem.status,
            validationErrors: thisStepItem.validationErrors,
            errorCount: thisStepItem.errorCount,
            selectedTab: thisStepItem.selectedTab,
            displayErrorToast: thisStepItem.displayErrorToast,
          });
          //This needs to be done because the green tick on the tab is not being copied.
          newStepItem.tabList.forEach((getTabItem: TabItem) => {
            thisStepItem.tabList.filter((thisTabItem: TabItem) => {
              if (thisTabItem.id == getTabItem.id) {
                Object.assign(getTabItem, {
                  isSuccessfullyCompleted: thisTabItem.isSuccessfullyCompleted,
                });
              }
            });
          });
        }
      });
    });
    this.stepList = newStepList;
    //While saving the record, merge the step list and evaluate all XML expressions.
    //Then, merge the results with the current step list, and copy the 'visible' and 'index' properties from the updated step list to the selected step.
    //This ensures that the reference of the selected step remains unchanged, preventing unnecessary calls to destroy, init, or component lifecycle changes
    this.stepList.forEach((newStep) => {
      if (this.selectedStep.id === newStep.id) {
        // this.selectedStep = newStep;
        Object.assign(this.selectedStep, {
          index: newStep.index,
          //tabList: newStep.tabList,
        });
        this.selectedStep.tabList.forEach((thisTabItem: TabItem) => {
          let newTabItem = newStep.getTabItem(thisTabItem.id);
          if (newTabItem != undefined) {
            Object.assign(thisTabItem, {
              visible: newTabItem.visible,
            });
          }
        });
        this.selectedStep.isTriggerTabChange = new String('YES');
        this.preStepSelection(this.selectedStep);
        this.selectedStep.setVisibleTabCount();

        //this.reloadStep(true, newStep);
        return;
      }
    });
  }

  protected but_DraftSave_click() {
    this.saveUpdatedModels(this.selectedStep);
  }

  protected but_Continue_click() {
    let nextStepObj = this.stepList[this.selectedStep.index + 1];
    this.saveUpdatedModels(this.selectedStep, nextStepObj);
  }

  protected but_Back_click() {
    let prevStepObj = this.stepList[this.selectedStep.index - 1];
    //call override onStepChanged function while back button click
    this.onStepChanged(prevStepObj);
    //this.loadDetails(prevStepObj);
  }

  //This button will discard the changes made and reload the step
  protected but_Cancel_click() {
    let currentActiveTab = this.selectedStep.selectedTab;
    this.loadDetails(this.selectedStep, currentActiveTab.modelList, null, currentActiveTab);
  }

  //This button will save the changes made and load the previous page(Step)
  protected but_BackSave_click() {
    this.saveUpdatedModels(this.selectedStep);
    let prevStepObj = this.stepList[this.selectedStep.index - 1];
    this.onStepChanged(prevStepObj);
  }
  /**
   *
   *  This function is used when continue next step even if the warning occurs.
   *  override this function and return value as true even warning occur.
   *
   */
  protected continueWithWarning(): boolean {
    return false;
  }

  protected setAltService(baseService: BaseService) {
    this.altService = baseService;
  }

  public reloadStep(preStepSelectionReq?: boolean) {
    if (preStepSelectionReq != undefined ? preStepSelectionReq : true) this.preStepSelection(this.selectedStep);

    //tabItemXmlDomRef required since xmldom nullify while doing stringify
    // xmlDom made undefined,since it heavy in stringify function
    let tabItemXmlDomRef = new Map();
    this.selectedStep.tabList.forEach((tabItem) => {
      if (tabItem.xmlDom != undefined) {
        tabItemXmlDomRef.set(tabItem.id, tabItem.xmlDom);
        tabItem.xmlDom = undefined;
      }
    });

    //clone step item
    let step = new StepItem();
    step = JSON.parse(JSON.stringify(this.selectedStep));
    this.selectedStep = new StepItem();
    this.selectedStep = step;

    if (tabItemXmlDomRef != null && tabItemXmlDomRef.size > 0) {
      this.selectedStep.tabList.forEach((tabItem) => {
        tabItem.xmlDom = tabItemXmlDomRef.get(tabItem.id);
      });
    }
  }

  protected checkPreviousStepError() {
    //check any previous step has validation error or not
    let validationerrors = this.service.responseIO.validationerrors;
    let currentStepIndex = this.selectedStep.index;

    for (let e = 0; e < currentStepIndex; e++) {
      let stepItem: StepItem = this.getStepList()[e];
      let stepErrorCount: number = 0;
      let stepValidationErrors = [];
      let errorList = [];
      for (let tabItem of stepItem.tabList) {
        let tabErrorCount = 0;
        if (validationerrors[tabItem.id] != undefined) {
          for (let modelGuid in validationerrors[tabItem.id]) {
            for (let fieldCd in validationerrors[tabItem.id][modelGuid]) {
              errorList.push(validationerrors[tabItem.id][modelGuid][fieldCd]);
              stepErrorCount++;
              tabErrorCount++;
            }
          }
        }
        if (tabErrorCount > 0) tabItem.errorCount = tabErrorCount;

        let errorName: string =
          tabItem.text != undefined
            ? this.settingService.getLabelValue(tabItem.text)
            : this.settingService.getLabelValue(tabItem.id);
        if (errorList.length > 0)
          stepValidationErrors.push({
            name: errorName,
            errors: errorList,
          });
        errorList = [];
      }
      if (stepErrorCount > 0) stepItem.errorCount = stepErrorCount;
      if (stepValidationErrors.length > 0) {
        stepItem.validationErrors = stepValidationErrors;
        //console.log('index - ', stepItem.index, ' ,step -', stepItem);
        //splice is required  to remove step item and replace current step
        this.stepList.splice(stepItem.index, 1, stepItem);
      }
    }
    //console.log('stepList:-', this.stepList);
  }
}
