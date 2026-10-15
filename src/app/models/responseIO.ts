export class ResponseIO {
  data: any;
  metadata: any;
  lookups: any;
  validationerrors: any;
  isMetadataHelpReqd: boolean;
  lookupkeyFOptionList: any;
  // callOnChange: boolean;

  clone() {
    let responseIO = new ResponseIO();
    responseIO.data = this.data;
    responseIO.metadata = this.metadata;
    responseIO.lookups = this.lookups;
    responseIO.validationerrors = this.validationerrors;
    responseIO.isMetadataHelpReqd = this.isMetadataHelpReqd;
    responseIO.lookupkeyFOptionList = this.lookupkeyFOptionList;
    return responseIO;

    // var cloneObj = new (this.constructor() as any)();
    // for (var attribut in this) {
    //   if (typeof this[attribut] === 'object') {
    //     cloneObj[attribut] = this[attribut].clone();
    //   } else {
    //     cloneObj[attribut] = this[attribut];
    //   }
    // }
    // return cloneObj;
  }

  copyFrom(objIO: any) {
    let responseIO = new ResponseIO();
    responseIO.data = objIO.data;
    responseIO.metadata = objIO.metadata;
    responseIO.lookups = objIO.lookups;
    responseIO.validationerrors = objIO.validationerrors;
    responseIO.isMetadataHelpReqd = objIO.isMetadataHelpReqd;
    responseIO.lookupkeyFOptionList = objIO.lookupkeyFOptionList;
    return responseIO;
  }
}
