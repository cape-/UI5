    // in view declare an sap.m.upload.UploadSet with id="DocumentUploadSet" and uploadUrl=""
    onInit() {
			const oDocUploadSet = this.byId("DocumentUploadSet");
			const oFileUploader = oDocUploadSet.getDefaultFileUploader();
			this.configureFileUploader(oFileUploader);
		},
		configureFileUploader(oFileUploader) {
			oFileUploader.attachChange(function (oEvent) {
				const oFile = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
				if (oFile && window.FileReader) {
					const oFileReader = new FileReader();
					oFileReader.onload = this.onFileLoaded.bind(this);
					oFileReader.readAsArrayBuffer(oFile);
				}
			}.bind(this));
		},
		onFileLoaded(oEvent) {
			const aColNames =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // ["A","B","C","D"...]
			const aFileContent = oEvent.target.result; // file content as ArrayBuffer
			const oWorkbook = XLSX.read(aFileContent);
			 // aData will be an array of sheets, each one as an array of rows: [[{A:"", B:"", ...}]]
			const aData = oWorkbook.SheetNames.map(sSheetName => XLSX.utils.sheet_to_json(oWorkbook.Sheets[sSheetName], aColNames);
			debugger;
		}
