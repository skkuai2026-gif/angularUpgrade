import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LoginService } from './../services/login.service';
import { Component, OnInit, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SystemCommonService } from '../services/system-common.service';
import { JSONTreeTemplate } from './../model/common/json-tree-template';

@Component({
  selector: 'sym-rest-api-listing',
  templateUrl: './rest-api-listing.component.html',
  styleUrls: ['./rest-api-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RestApiListingComponent extends BaseComponent<SystemCommonService> implements OnInit {
  restApiData: any;
  restApiModules: any;
  treeList: JSONTreeTemplate[];
  filterText: string;

  @Output() restApiDataInfo = new EventEmitter<any>();

  constructor(systemCommonService: SystemCommonService) {
    super(systemCommonService);
  }

  ngOnInit() {
    this.service.loadRestApiData().subscribe(
      (successResponse) => {
        let response = JSON.parse(JSON.stringify(successResponse));
        this.restApiData = response.data;
        this.restApiModules = Object.keys(this.restApiData);
        this.treeList = [];
        Object.keys(this.restApiData).forEach((module) => {
          let tree = new JSONTreeTemplate();
          tree.isBlockCollapsed = false;
          tree.key = this.restApiData[module][0]['moduleDesc'];
          tree.value = [];
          Object.keys(this.restApiData[module]).forEach((item) => {
            let child = new JSONTreeTemplate();
            child.isBlockCollapsed = false;
            child.key = this.restApiData[module][item].apiDesc;
            child.value = this.restApiData[module][item];
            tree.value.push(child);
          });
          this.treeList.push(tree);
          this.setFieldFocus(undefined, undefined, 'filterAPISearch');
        });

        // console.log(this.treeList);
        // console.log(this.restApiData);
        // console.log(this.restApiModules);
        //  Object.keys(this.restApiData).forEach()
        console.log('Successfully load rest api data.');
        this.setFieldFocus(undefined, undefined, 'filterAPISearch');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFieldFocus(undefined, undefined, 'filterAPISearch');
  }
  getRestApi(restApiDataInfo) {
    this.restApiDataInfo.emit(restApiDataInfo);
    setTimeout(() => {
      this.setFieldFocus(undefined, undefined, 'filterAPISearch');
    }, 30);
  }

  isFilterApplied() {
    if (this.filterText != undefined && this.filterText.length > 0) {
      for (let i = 0; i < this.treeList.length; i++) {
        this.treeList[i].isBlockCollapsed = true;
      }
    } else {
      for (let i = 0; i < this.treeList.length; i++) {
        this.treeList[i].isBlockCollapsed = false;
      }
    }

    this.setFieldFocus(undefined, undefined, 'filterAPISearch');
    return this.filterText != undefined && this.filterText.length > 0 ? true : false;
  }

  onCloseFilter() {
    this.filterText = undefined;
    this.setFieldFocus(undefined, undefined, 'filterAPISearch');
  }

  toggleItem(item: JSONTreeTemplate) {
    item.isBlockCollapsed = !item.isBlockCollapsed;
  }
}
