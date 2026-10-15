import { FieldItem } from 'src/app/models/common/field-item';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseService } from 'src/app/system-common/services/base.service';
import {
  GenericXMLPanelFormat,
  GenericXMLRow,
  GenericXMLRowColumn,
} from '../../models/common/generic-panel-format';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { ResponseIO } from 'src/app/models/responseIO';
@Component({
  selector: 'xml-generic-config-ui',
  templateUrl: './xml-generic-config-ui.component.html',
  styleUrls: ['./xml-generic-config-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class XmlGenericConfigUIComponent extends BaseComponent<BaseService> implements OnChanges {
  /**
   * This is a required Object. It expects XML format Object
   * e.g: '<productUIConfig><panel label="basePlan"><row colwidths="#equal">
   * <col field="paymentTypeCd" model="BasePlan"></col></row></panel>	</productUIConfig>'
   */
  @Input() xml: any;

  /**
   * This is provided so that the current service is accesible to the component to reload or re-fresh the
   * search-list if list is updated.
   * e.g : QuotationService
   */
  @Input() service: BaseService;

  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed in the UI.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It is an optional input.
   *
   * It contains the model object to be used as the reference for the fields
   * @modelObj contains Model object that is to be used to render the fields
   * Eg. PrimaryInsured/ Proposer etc.
   */
  @Input() modelObj: any;

  /**
   * It is triggered when there is a event to emitt on field value is changed.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyChange = new EventEmitter<FieldItem>();

  /**
   * It is triggered when there is a event to emitt on field value is focused.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyFocus = new EventEmitter<FieldItem>();
  /**
   * It is triggered when there is a event to emitt on row added.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onRowAdded = new EventEmitter<any>();

  /**
   * It is triggered when there is a event to emitt on more selection.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onMoreSelected = new EventEmitter<number>();

  /**
   * It is triggered when it is clicked on search Icon next to the field displayed.
   *  @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   */
  @Output() searchIconClicked = new EventEmitter<FieldItem>();

  genericXMLPanelList: GenericXMLPanelFormat[];

  errorList: any[];
  constructor(public baseService: BaseService, private ref: ChangeDetectorRef) {
    super(baseService);
  }

  ngOnInit() {
    if (this.xml != undefined) this.loadXML();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Model needs to be updated in panleList when there is responseIO changes since we pass model to field-item.
    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['modelObj'] && changes['modelObj'].currentValue)
    ) {
      this.updateModel();
    }
  }

  /**
   * @ignore
   */
  private loadXML(): void {
    // console.log(this.xml);
    this.xml = this.xml.toString().replaceAll('&&', '&amp;&amp;');
    // .replaceAll( '<', '&lt;' ).replaceAll( '>', '&gt;' );
    let parser = new DOMParser();
    let xml = parser.parseFromString(this.xml, 'text/xml');

    let root = <Element>xml.documentElement;
    const errorNode = root.querySelector('parsererror');
    if (errorNode) {
      // parsing failed
      console.error(errorNode);
      console.error(this.xml);
      this.error('XML configuration error: ' + errorNode['outerText']);
      return;
    }

    let panels = root.getElementsByTagName('panel');
    this.genericXMLPanelList = [];
    for (let i = 0; i < panels.length; i++) {
      let newPanel = new GenericXMLPanelFormat();
      let panel = panels[i];
      newPanel.panelID = panel.getAttribute('label');
      // Added Logic to evaluate symIf condition for panel
      newPanel.symIfVal = panel?.getAttribute('symIf')
        ? this.service.isApplicable(panel?.getAttribute('symIf'), this.responseIO)
        : true;
      if (panel.getElementsByTagName('component').length > 0) {
        newPanel['component'] = panel.children;
      } else if (panel.getElementsByTagName('xmlcomponent').length > 0) {
        newPanel['xmlcomponent'] = panel;
      } else {
        if (newPanel.symIfVal) {
          newPanel.panelRows = [];
          let rows = panel.getElementsByTagName('row');

          if (
            rows.length == 0 &&
            panel.getElementsByTagName('component').length == 0 &&
            panel.getElementsByTagName('xmlcomponent').length == 0 &&
            panel.getElementsByTagName('field').length == 0 &&
            panel.getElementsByTagName('grid').length == 0
          ) {
            this.error('"row" element is missing!');
          }

          for (let j = 0; j < rows.length; j++) {
            let row = rows[j];
            let panelRow = new GenericXMLRow();
            panelRow.columns = [];
            let cols = row.getElementsByTagName('col');
            let className = this.getColClass(cols.length);
            //col len
            // Added Logic to evaluate symIf condition for row
            panelRow.symIfVal = row.getAttribute('symIf')
              ? this.service.isApplicable(row.getAttribute('symIf'), this.responseIO)
              : true;
            if (panelRow.symIfVal) {
              for (let k = 0; k < cols.length; k++) {
                let col = cols[k];
                let column = new GenericXMLRowColumn();
                // Added Logic to evaluate symIf condition for column
                column.symIfVal = col.getAttribute('symIf')
                  ? this.service.isApplicable(col.getAttribute('symIf'), this.responseIO)
                  : true;
                if (column.symIfVal) {
                  if (col.getAttribute('field') != undefined || col.getAttribute('grid') != undefined) {
                    if (col.getAttribute('grid') != undefined) {
                      column.grid = col.getAttribute('grid');
                    } else if (col.getAttribute('field') != undefined) {
                      column.field = col.getAttribute('field');
                    }

                    column.modelname = col.getAttribute('model');
                    // console.log(modelName);
                    if (
                      this.service.getModel(column.modelname) != undefined &&
                      this.service.getModel(column.modelname) != null
                    ) {
                      if (col.getAttribute('grid') != undefined) {
                        // column.model.push(this.service.getModel(modelName));
                        let widthList = col.getAttribute('width');

                        if (widthList.includes(':')) {
                          column.className = widthList;
                        } else {
                          let width = [];
                          widthList.split(',').forEach((property) => {
                            width.push(property);
                          });
                          column.className = width;
                        }
                      } else {
                        column.model = this.service.getModel(column.modelname);
                      }
                    } else if (
                      column.modelname == '#none' ||
                      column.modelname == null ||
                      column.modelname == undefined
                    ) {
                      column.model = this.modelObj;
                    } else {
                      this.error('Invalid model ' + column.modelname);
                    }

                    if (col.getAttribute('gridOption') != undefined) {
                      let optionList = col.getAttribute('gridOption');
                      column.gridOptions = [];

                      optionList.split(',').forEach((property) => {
                        if (property.substring(0, property.indexOf(':')) === 'isMoreRequired') {
                          column.gridOptions['isMoreRequired'] =
                            property.substring(property.indexOf(':') + 1, property.length).trim() === 'true'
                              ? true
                              : false;
                        }
                        if (property.substring(0, property.indexOf(':')) === 'isDeleteRequired') {
                          column.gridOptions['isDeleteRequired'] =
                            property.substring(property.indexOf(':') + 1, property.length).trim() === 'true'
                              ? true
                              : false;
                        }
                        if (property.substring(0, property.indexOf(':')) === 'isAddRequired') {
                          column.gridOptions['isAddRequired'] =
                            property.substring(property.indexOf(':') + 1, property.length).trim() === 'true'
                              ? true
                              : false;
                        }
                        if (property.substring(0, property.indexOf(':')) === 'isFormFormatRequired') {
                          column.gridOptions['isFormFormatRequired'] =
                            property.substring(property.indexOf(':') + 1, property.length).trim() === 'true'
                              ? true
                              : false;
                        }
                      });
                    }

                    // console.log(column.gridOptions);

                    column.className = className;
                    column.isVisible = true;
                    if (
                      (column.model == undefined ||
                        column.field == '#none' ||
                        this.service.getLabelValue(column.model, column.field) == undefined ||
                        this.service.responseIO.metadata[column.model.guid] == undefined) &&
                      col.getAttribute('grid') == undefined
                    ) {
                      column.isVisible = false;
                      // console.log(column.model);
                      if (
                        column.model != undefined &&
                        this.service.responseIO.metadata[column.model.guid] == undefined
                      ) {
                        // console.log(column.model);
                        // console.log(this.service.responseIO.metadata[column.model.guid]);
                        this.error('Metadata not available for field ' + column.field);
                      }
                      if (
                        column.model != undefined &&
                        this.service.responseIO.metadata[column.model.guid][column.field] == undefined &&
                        col.getAttribute('grid') == undefined
                      ) {
                        this.error('Invalid field ' + column.field);
                      }
                    }
                  } else if (col.getAttribute('text') != undefined) {
                    column.text = col.getAttribute('text');
                  }
                  let width = col.getAttribute('width');
                  if (width !== undefined && width !== null) {
                    column.className = 'col-sm-' + width + ' col-md-' + width + ' col-xl-' + width;
                  }

                  panelRow.columns.push(column);
                }
              }
            }

            newPanel.panelRows.push(panelRow);

            // let component = panel.getElementsByTagName( 'component' );
          }
        }
      }
      if (
        newPanel.panelRows != undefined &&
        newPanel.panelRows.length == 0 &&
        (newPanel['component'] == undefined || newPanel['xmlcomponent'] == undefined)
      )
        continue;
      this.genericXMLPanelList.push(newPanel);
    }

    // console.log(this.xml);
    // console.log(json);
    // console.log(panelList);
    // console.log(this.genericXMLPanelList);
    // // console.log(this.service.responseIO);
  }

  /**
   * on input field change this method is trigger
   * @param fieldItem item whose value is been changed
   */
  onInputChanged(fieldItem: FieldItem) {
    this.notifyChange.emit(fieldItem);
  }
  /**
   * on input field focused this method is trigger
   * @param fieldItem item whose value is been focused
   */
  onInputFocused(fieldItem: FieldItem) {
    this.notifyFocus.emit(fieldItem);
  }

  /**
   * @ignore
   */
  private getColClass(totalLength: number): string {
    let maxCols: number;
    let width: number;
    if (totalLength > 4) {
      maxCols = 4;
    } else {
      maxCols = totalLength;
    }
    width = 12 / maxCols;
    return 'col-sm-' + width + ' col-md-' + width + ' col-xl-' + width;
  }

  onRowAddedClicked(modelName: string) {
    this.onRowAdded.emit(modelName);
  }

  onNotifyChanges(fieldItem: FieldItem) {
    this.notifyChange.emit(fieldItem);
  }
  onNotifyFocus(fieldItem: FieldItem) {
    this.notifyFocus.emit(fieldItem);
  }
  onMoreSelectedClicked(index) {
    this.onMoreSelected.emit(index);
  }

  onSearchIconClick(field: FieldItem) {
    this.searchIconClicked.emit(field);
  }

  updateModel() {
    if (this.genericXMLPanelList != undefined) {
      this.genericXMLPanelList.filter((panel) => {
        panel.panelRows?.filter((row) => {
          row.columns?.filter((col) => {
            col.model = this.service.getModel(col.modelname);
          });
        });
      });
    }
  }
}
