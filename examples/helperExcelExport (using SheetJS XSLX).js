sap.ui.define([], function () {
    "use strict";

    let oResourceBundle = new sap.ui.model.resource.ResourceModel({
        bundleName: "com.tenaris.orders.TenarisOrders.i18n.i18n"
    }).getResourceBundle();

    return {

        exportReportByPTDStatus: function (oReportByPTDStatusData) {
                const oWorkBook = XLSX.utils.book_new();
                const aDataLines = oReportByPTDStatusData.results || [];
				var sLastPERMITID;

                // Process data
                const aReportLines = aDataLines.map((oDataLine, idx, arr) => {
                	const oRepLine = this.createReportLine(oDataLine);
                	
                	if(sLastPERMITID !== oRepLine.PERMITID){
                		// On new PERMITID
                		sLastPERMITID = oRepLine.PERMITID;
            			oRepLine.PREV_LOGGED_STATUS = '01';
            			oRepLine.PREV_LOGGED_STATUS_TEXT = 'Borrador';
                	
                	} else {
                		// Retrieve initial status from previous entry
                		var oPrevDataLine = arr[idx-1];
                		if(oPrevDataLine){
                			// Sets last Status
                			oRepLine.PREV_LOGGED_STATUS = oPrevDataLine.LOGGED_STATUS;
                			oRepLine.PREV_LOGGED_STATUS_TEXT = oPrevDataLine.LOGGED_STATUS_TEXT;
                		}
                	}
                	
                	for(let sKey in oRepLine){
                		// Set empty string as default for null and undef
						oRepLine[sKey] = oRepLine[sKey] || ""; 
                		
                		// Format nulls
						if(oRepLine[sKey] === null)
							oRepLine[sKey] = this.formatNull(oRepLine[sKey]);

                		// Format bools
						if(sKey.startsWith("PF_"))
							oRepLine[sKey] = this.formatBool(oRepLine[sKey]);

						switch (sKey) {
                			// Format Date fields
							case "BEGINDATE":
							case "ENDDATE":
								oRepLine[sKey] = this.formatDate(oRepLine[sKey]);
						  		break;
                			// Format Time fields
							case "BEGINTIME":
							case "ENDTIME":
								oRepLine[sKey] = this.formatTime(oRepLine[sKey]);
								break;
							case "LOGGED_STATUS_UPDATEDTIME":
								oRepLine[sKey] = this.formatDateTime(oRepLine[sKey]);
								break;
						}
                	}
                	return oRepLine;
                });

                // Build sheet Heading
                const oSheetHeading = this.getSheetHeading({ ...aReportLines[0] }); // Pass in a copy of the first element

                // Build sheet Content (HEADING + DATA)
                const aReportContent = [
                	oSheetHeading,
                	...aReportLines
            	];
                const oSheet = XLSX.utils.json_to_sheet(aReportContent, {skipHeader: true});
                
                XLSX.utils.book_append_sheet(oWorkBook, oSheet, "Reporte PTD");
                XLSX.writeFile(oWorkBook, "Reporte PTD.xlsx");
        },
        
        getSheetHeading: function(oLine) {
        	const toSentenceCase = s => s.toLowerCase().replace(/_/g,' ').split('').map((l,idx) => idx === 0 ? l.toUpperCase() : l ).join('');
        	
        	for(let sKey in oLine){
				if(sKey.startsWith("PF_"))
	        		oLine[sKey] = toSentenceCase(sKey.slice(3));
				else
					oLine[sKey] = sKey === 'PERMITID' ? 'Nº PTD' : 
						sKey === 'DESCRIPTION' ? 'Descripción de la actividad' : 
						sKey === 'CURRENT_STATUS' ? 'Status actual' : 
						sKey === 'CURRENT_STATUS_TEXT' ? 'Descripción Status actual' : 
						sKey === 'ISSUER' ? 'Solicitado por (email)' : 
						sKey === 'ISSUER_NAME' ? 'Solicitado por (nombre)' : 
						sKey === 'LOGGED_STATUS_UPDATEDBY' ? 'Status actualizado por' : 
						sKey === 'PREV_LOGGED_STATUS' ? 'Status anterior' : 
						sKey === 'PREV_LOGGED_STATUS_TEXT' ? 'Descripción status anterior' : 
						sKey === 'LOGGED_STATUS' ? 'Status nuevo' : 
						sKey === 'LOGGED_STATUS_TEXT' ? 'Descripción status nuevo' : 
						sKey === 'LOGGED_STATUS_UPDATEDTIME' ? 'Fecha y Hora de Cambio de status' : 
						sKey === 'PERSONQTY' ? 'Número de Personas' : 
						sKey === 'PLANTPTD' ? 'Unidad de Negocio' : 
						sKey === 'DEPARTMENT' ? 'Departamento del Trabajo' : 
						sKey === 'DEPARTMENT_DISPLAYNAME' ? 'Descripción Departamento del Trabajo' : 
						sKey === 'DIVISION' ? 'Division del Trabajo' : 
						sKey === 'DIVISION_DISPLAYNAME' ? 'Descripción Division del Trabajo' : 
						sKey === 'BEGINDATE' ? 'Fecha inicio de trabajo' : 
						sKey === 'BEGINTIME' ? 'Hora inicio de trabajo' : 
						sKey === 'ENDDATE' ? 'Fecha fin de trabajo' : 
						sKey === 'ENDTIME' ? 'Hora fin de trabajo' : 
						sKey === 'PLANT' ? 'Planta' : 
						sKey === 'PLANTSTAND' ? 'Area o Planta' : 
						sKey === 'EQUIPMENT' ? 'Tag del equipo (Código)' : 
						sKey === 'EQUIPMENT_TEXT' ? 'Nombre del equipo(s)' : 
						sKey === 'EQUIPMENT_FREEVAL' ? 'Equipo (campo libre)' : 
						sKey === 'COMPANYEXEC' ? 'Empresa Ejecutante' : 
						sKey === 'COMPANYEXEC_TEXT' ? 'Nombre Empresa Ejecutante' : 
						sKey === 'ORDER' ? 'Nº de Pedido' : 
						sKey === 'EXECUTOR' ? 'Ejecutante (email)' : 
						sKey === 'EXECUTOR_NAME' ? 'Ejecutante (Nombre de Contacto)' : 
						sKey === 'ADMCONTRACT' ? 'Admin. General de Contrato' : 
						sKey === 'OTNUMBER' ? 'Numero OT' : 
						sKey === 'OTNUMBER_TEXT' ? 'Descripción OT' : 
						sKey === 'DEPARTMENTREQUEST' ? 'Departamento solicitante' : 
						sKey === 'DIVISIONREQUEST' ? 'Division solicitante' : 
						sKey;
        	}
        	return oLine;
        },

        createReportLine: function(oDataLine) {
        	// Sets order of columns
        	return {
				PERMITID: oDataLine.PERMITID,
				DESCRIPTION: oDataLine.DESCRIPTION,
				CURRENT_STATUS: oDataLine.CURRENT_STATUS,
				CURRENT_STATUS_TEXT: oDataLine.CURRENT_STATUS_TEXT,
				ISSUER: oDataLine.ISSUER,
				ISSUER_NAME: oDataLine.ISSUER_NAME,
				LOGGED_STATUS_UPDATEDBY: oDataLine.LOGGED_STATUS_UPDATEDBY,
				PREV_LOGGED_STATUS: '', 		// Calculated field
				PREV_LOGGED_STATUS_TEXT: '',    // Calculated field
				LOGGED_STATUS: oDataLine.LOGGED_STATUS,
				LOGGED_STATUS_TEXT: oDataLine.LOGGED_STATUS_TEXT,
				LOGGED_STATUS_UPDATEDTIME: oDataLine.LOGGED_STATUS_UPDATEDTIME,
				PERSONQTY: oDataLine.PERSONQTY,
				PLANTPTD: oDataLine.PLANTPTD,
				DEPARTMENT: oDataLine.DEPARTMENT,
				DEPARTMENT_DISPLAYNAME: oDataLine.DEPARTMENT_DISPLAYNAME,
				DIVISION: oDataLine.DIVISION,
				DIVISION_DISPLAYNAME: oDataLine.DIVISION_DISPLAYNAME,
				BEGINDATE: oDataLine.BEGINDATE,
				BEGINTIME: oDataLine.BEGINTIME,
				ENDDATE: oDataLine.ENDDATE,
				ENDTIME: oDataLine.ENDTIME,
				PLANT: oDataLine.PLANT,
				PLANTSTAND: oDataLine.PLANTSTAND,
				EQUIPMENT: oDataLine.EQUIPMENT,
				EQUIPMENT_TEXT: oDataLine.EQUIPMENT_TEXT,
				EQUIPMENT_FREEVAL: oDataLine.EQUIPMENT_FREEVAL,
				COMPANYEXEC: oDataLine.COMPANYEXEC,
				COMPANYEXEC_TEXT: oDataLine.COMPANYEXEC_TEXT,
				ORDER: oDataLine.ORDER,
				EXECUTOR: oDataLine.EXECUTOR,
				ADMCONTRACT: oDataLine.ADMCONTRACT,
				OTNUMBER: oDataLine.OTNUMBER,
				OTNUMBER_TEXT: oDataLine.OTNUMBER_TEXT,
				DEPARTMENTREQUEST: oDataLine.DEPARTMENTREQUEST,
				DIVISIONREQUEST: oDataLine.DIVISIONREQUEST,
				PF_ASR: oDataLine.PF_ASR,
				PF_PLANILLA_YPER: oDataLine.PF_PLANILLA_YPER,
				PF_PLANIFICACION: oDataLine.PF_PLANIFICACION,
				PF_APERTURA_DE_LINEA: oDataLine.PF_APERTURA_DE_LINEA,
				PF_ATMOSFERAS_TOXICA: oDataLine.PF_ATMOSFERAS_TOXICA,
				PF_BUCEO: oDataLine.PF_BUCEO,
				PF_ELECTRI_PROVISORIOS: oDataLine.PF_ELECTRI_PROVISORIOS,
				PF_ESPACIOS_CONFINADOS: oDataLine.PF_ESPACIOS_CONFINADOS,
				PF_EXCAVACIONES: oDataLine.PF_EXCAVACIONES,
				PF_LAVADO_ALTA_PRESION: oDataLine.PF_LAVADO_ALTA_PRESION,
				PF_LAZOS_Y_CONTROL: oDataLine.PF_LAZOS_Y_CONTROL,
				PF_OPERACIO_DE_LEVANTE: oDataLine.PF_OPERACIO_DE_LEVANTE,
				PF_RADIACIO_IONIZANTES: oDataLine.PF_RADIACIO_IONIZANTES,
				PF_TRABAJO_ELECTRICO: oDataLine.PF_TRABAJO_ELECTRICO,
				PF_TRABAJO_EN_ALTURA: oDataLine.PF_TRABAJO_EN_ALTURA,
				PF_TRABAJO_OLEODUCTO: oDataLine.PF_TRABAJO_OLEODUCTO,
				PF_TRABAJO_EN_CALIENTE: oDataLine.PF_TRABAJO_EN_CALIENTE,
        	};
        },

        formatNull: function(sVal) {
        	return '';
        },

        formatBool: function(sVal) {
        	return sVal === 'X' ? 'Sí' : 'No';
        },

        formatDate: function(sDate, sLocale = 'es-cl', sDefault) {
        	var oDate = new Date(sDate);
        	return !isNaN(oDate.getTime()) ? oDate.toLocaleDateString(sLocale) : sDefault || '';
        },

        formatDateTime: function(sDate, sLocale = 'es-cl', sDefault) {
        	var oDate = new Date(sDate);
        	return !isNaN(oDate.getTime()) ? oDate.toLocaleDateString(sLocale) + ' ' + oDate.toLocaleTimeString(sLocale) : sDefault || '';
        },

        formatTime: function(oTime) {
        	var h = Math.floor(oTime.ms/1000/60/60),
				m = Math.floor((oTime.ms/1000/60/60 - h)*60),
				s = Math.floor(((oTime.ms/1000/60/60 - h)*60 - m)*60);
			
			h = h < 10 ? `0${h}`: h;
			m = m < 10 ? `0${m}`: m;
			s = s < 10 ? `0${s}`: s;

        	return !isNaN(oTime.ms) ? `${h}:${m}:${s}` : '';
        }
    };

});
