sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (D) {
	"use strict";

	return {

		formatDateAndTime: function (_date, _time) {
			var auxDate = new Date(_date.valueOf() + (_time ? _time.ms : 0));
			return auxDate.toLocaleString('es-cl', {
				timeZone: 'UTC'
			});
		},

		formatDate: function (_date) {
			return _date.toLocaleDateString('es-cl', {
				timeZone: 'UTC'
			});
		},

		formatTimeStampToLocale: function (datetime) {
			let _date = new Date(datetime);
			return _date.toLocaleString('es-cl');
		},

		formatEDMTimeToTime: function (edmtime) {
			if (edmtime !== null && edmtime !== "") {
				var d = D.getTimeInstance({
					pattern: "HH:mm", //"KK:mm:ss a"
					UTC: true
				});
				return d.format(new Date(edmtime.ms));
			} else {
				return "";
			}
		},

		handlePrintAndDownload: function (exportAsBase64, printData, portafolioData, statusLogData, extensionsData, approvalLog, workLogData,
			callback) {

			var that = this;

			const s = (t, s, c, a, b) => ({
				text: t,
				style: s,
				colSpan: c,
				alignment: a,
				bold: b || false
			})
			var habilitar_extensiones = false;

			var formattedPrintData = {...printData
			};
			var formatDateAndTime = this.formatDateAndTime;
			var formatDate = this.formatDate;
			var formatTimeStampToLocale = this.formatTimeStampToLocale;
			var formatEDMTimeToTime = this.formatEDMTimeToTime;

			console.log(extensionsData, workLogData);

			// Format Dates
			formattedPrintData.FmtFechaInicio = formatDateAndTime(printData.BEGINDATE, printData.BEGINTIME);
			formattedPrintData.FmtFechaFin = formatDateAndTime(printData.ENDDATE, printData.ENDTIME);
			formattedPrintData.FmtCreatedTime = formatDateAndTime(printData.CREATEDTIME);
			formattedPrintData.FmtApprovedTime = formatTimeStampToLocale(approvalLog.CREATEDTIME);

			// Null values
			formattedPrintData.APR_T_WING_FREE = printData.APR_T_WING_FREE ? printData.APR_T_WING_FREE : '';

			//--- MASTER PRINT FUNCTION
			var printRow = (element, ...args) => {
				return element === '4x1' ? // 4 CELLS SPAN 1
					[{
						style: "FieldLabel",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[1],
						colSpan: 1
					}, {
						style: "FieldLabel",
						text: args[2],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[3],
						colSpan: 1
					}] :

					element === '1vx1-1-1' ? // 4 CELLS SPAN 1 (1 value - 3 label)
					[{
						style: "FieldLabel",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[1],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[2],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[3],
						colSpan: 1
					}] :

					element === '8x1-measure' ? // 2 CELLS SPAN 1 + 1 CELL SPAN 2
					[{
						style: "FieldValue",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[1],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[2],
						colSpan: 1
					}, {
						style: "FieldLabel",
						text: args[3],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[4],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[5],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[6],
						colSpan: 1
					}, {
						style: "FieldLabel",
						text: args[7],
						colSpan: 1
					}] :

					element === '1-1-2' ? // 2 CELLS SPAN 1 + 1 CELL SPAN 2
					[{
						style: "FieldLabel",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[1],
						colSpan: 1
					}, {
						style: "Group",
						ul: [args[2] || ""],
						colSpan: 2
					}, {}] :

					element === '1-3' ? // 1 CELLS SPAN 1 + 1 CELL SPAN 3
					[{
						style: "FieldLabel",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[1],
						colSpan: 3
					}, {}, {}] :

					element === 'desc-status' ? // 1 CELLS SPAN 2 + 1 CELL SPAN 2
					[{
						style: "DescLabel",
						text: args[0],
						colSpan: 2
					}, {}, {
						style: "DescValue",
						text: args[1].toUpperCase(),
						colSpan: 2
					}, {}] :

					element === 'statusLog' ? // 1 CELLS SPAN 1 + 1 CELL SPAN 2 + 1 CELL STATUS
					[{
						style: "FieldLabel",
						text: args[0],
						colSpan: 1
					}, {
						style: "FieldLabel",
						text: args[1],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[2],
						colSpan: 1
					}, {
						style: "FieldValue",
						text: args[3],
						colSpan: 1
					}] :

					element === 'statusEnd' ? // 1 CELLS SPAN 1 + 1 CELL SPAN 2 + 1 CELL STATUS
					[{
						style: "SubgroupSelection",
						text: args[0],
						colSpan: 1
					}, {
						style: "SubgroupSelection",
						text: args[1],
						colSpan: 1
					}, {
						style: "SubgroupSelection",
						text: args[2],
						colSpan: 1
					}, {
						style: "SubgroupSelection",
						text: args[3],
						colSpan: 1
					}] :

					element === 'Subtitle' ? // SUBTITLE
					[{
						style: "Subtitle",
						text: args[0],
						colSpan: 4
					}, {}, {}, {}] :

					element === 'Subtitle-8x1' ? // SUBTITLE
					[{
						style: "Subtitle",
						text: args[0],
						colSpan: 8
					}, {}, {}, {}, {}, {}, {}, {}] :

					element === 'Group' ? // PORTAFOLIO: GROUP
					[{
						style: "Group",
						ul: [args[0].text],
						colSpan: 4
					}, {}, {}, {}] :

					element === 'Subgroup' ? // PORTAFOLIO: GROUP
					[{
						style: "Subgroup",
						ul: [args[0].text],
						colSpan: 3
					}, {}, {}, {
						style: "SubgroupSelection",
						text: args[0].switchValue === "Y" ? 'SÍ' : args[0].switchValue === "N" ? 'NO' : args[0].switchValue === "-" ? 'N/A' : 'N/A',
						colSpan: 1
					}] :

					element === 'Question' ? // PORTAFOLIO: QUESTION
					( // SWITCH
						args[0].switchEnabled ? [{
							style: "QuestionLabel",
							text: args[0].text,
							colSpan: 3
						}, {}, {}, {
							style: "QuestionValueCenter",
							text: formatSwitch(args[0].switchValue),
							colSpan: 1
						}] :
						// INPUT
						args[0].inputEnabled ? [{
							style: "QuestionLabel",
							text: args[0].text,
							colSpan: 1
						}, {
							style: "QuestionValueLeft",
							text: args[0].inputValue,
							colSpan: 3
						}, {}, {}] :
						// default
						[{}, {}, {}, {}]) :

					element === 'QuestionX2' ? // PORTAFOLIO: 2 SWITCH QUESTION BY ROW
					[{
						style: "QuestionLabel",
						text: args[0].text,
						colSpan: 1
					}, {
						style: "QuestionValueCenter",
						text: args[0].switchValue === "Y" ? 'SÍ' : args[0].switchValue === "N" ? 'NO' : args[0].switchValue === "-" ? 'N/A' : 'N/A',
						colSpan: 1
					}, {
						style: "QuestionLabel",
						text: args[1].text,
						colSpan: 1
					}, {
						style: "QuestionValueCenter",
						text: args[1].switchValue === "Y" ? 'SÍ' : args[1].switchValue === "N" ? 'NO' : args[1].switchValue === "-" ? 'N/A' : 'N/A',
						colSpan: 1
					}] :
					args.map(t => ({
						style: element,
						text: t
					}));

			};
			//--- FACTORY FN
			var factorRowFn = (element) => printRow.bind(this, element);

			//--- FORMAT FUNCTIONS
			var formatSwitch = (switchValue) => switchValue === "Y" ? 'SÍ' : switchValue === "N" ? 'NO' : switchValue === "-" ? 'N/A' : 'N/A';
			var Subtitle = factorRowFn('Subtitle');
			var Subtitle8x1 = factorRowFn('Subtitle-8x1');
			var Group = factorRowFn('Group');
			var Subgroup = factorRowFn('Subgroup');
			var Question = factorRowFn('Question');
			var QuestionX2 = factorRowFn('QuestionX2');
			var Line13 = factorRowFn('1-3');
			var LineDescStatus = factorRowFn('desc-status');
			var Line112 = factorRowFn('1-1-2');
			var Line1111 = factorRowFn('4x1');
			var Line1v111 = factorRowFn('1vx1-1-1');
			var LineMeasure = factorRowFn('8x1-measure');
			var LineStatusLog = factorRowFn('statusLog');
			var LineStatusEnd = factorRowFn('statusEnd');

			//--- TITULO
			function buildBodyTitle(_d) {
				return [
					[{
						image: "data:image/png;base64,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",
						fit: [150, 150],
						// arriba derecha abajo izquierda
						margin: [0, -25, 0, 5],
					}, {}, {
						alignment: "right",
						margin: [0, -18, 0, 0],
						table: {
							widths: ["auto", "auto"],
							body: [
								[{
									text: `Documento`,
									style: "MainTitle"
								}, {
									text: `N°${_d.ID}`,
									style: "PermitNumber"
								}]
							]
						}
					}]
				];
			};

			// --- ANTECEDENTES
			function buildBodyAntecedentes(_d) {

				return [
					Subtitle("ANTECEDENTES"),
					LineDescStatus("TIPO Y DESCRIPCIÓN DE LA ACTIVIDAD", _d.WORKTYPE_TEXT + ': ' + _d.DESCRIPTION, ''),
					Line112("DEPARTAMENTO DE TRABAJO", _d.DEPARTMENT_TEXT, "SOLICITUD"),
					Line1111("DIVISIÓN DEL TRABAJO", _d.DIVISION_TEXT, "NOMBRE SOLICITANTE", _d.ISSUER_NAME),
					Line1111("ÁREA O PLANTA DEL TRABAJO", _d.PLANTSTAND_TEXT, "CORREO SOLICITANTE", _d.ISSUER),
					Line1111("FECHA Y HORA DE INICIO", _d.FmtFechaInicio, "FECHA SOLICITUD", _d.FmtCreatedTime),
					Line112("FECHA Y HORA DE CIERRE", _d.FmtFechaFin, "EMISION"),
					Line1111("TAG DEL EQUIPO", _d.EQUIPMENT ? ((_d.EQUIPMENT || '') + ' - ' + (_d.EQUIPMENT_TEXT || '')) : _d.EQUIPMENT_FREEVAL,
						"NOMBRE EMISOR", _d.APPROVER_NAME),
					Line1111("DEPARTAMENTO SOLICITANTE", _d.DEPARTMENTREQUEST_TEXT, "CORREO EMISOR", _d.APPROVER),
					Line1111("DIVISIÓN SOLICITANTE", _d.DIVISIONREQUEST_TEXT, "AUTORIZADO FECHA", _d.FmtApprovedTime),
					Line112("ESPECIALIDAD EJECUTANTE", _d.SPECIALTY, "EJECUCION"),
					Line1111("EMPRESA EJECUTANTE", `${_d.COMPANYEXEC_TEXT || ''} (${_d.COMPANYEXEC || ''})`, "NOMBRE EJECUTANTE", _d.EXECUTOR_CONTACTNAME),
					Line1111("NUMERO DE PERSONAS", _d.PERSONQTY, "", ""),
					Line1111("NOTAS", _d.NOTES, "", ""),
				];
			};

			// --- MEDICIONES
			function buildBodyMediciones(_d) {
				return [
					Subtitle8x1("MEDICIONES"),
					LineMeasure("HORA", "VARIABLE", "UNIDAD", "MEDICION", "HORA", "VARIABLE", "UNIDAD", "MEDICION"),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
					LineMeasure(" ___ : ___ : ___ ", "", "", "", " ___ : ___ : ___ ", "", "", ""),
				];
			};

			// --- EXTENSIONES
			function buildBodyExtensiones(_d) {
				let _body = [];
				_body.push(Subtitle("EXTENSIONES"));
				extensionsData.forEach((extension) => {
					_body.push(Line1v111("Fecha: " + formatDate(extension.DOCUMENT_BEGINDATE),
						"Ingreso: " + formatEDMTimeToTime(extension.REAL_BEGINTIME),
						"Egreso: " + formatEDMTimeToTime(extension.REAL_ENDTIME),
						"N° Personas: " + extension.REAL_PERSONQTY));
				});
				return _body;
			};

			// --- HISTORIAL (por ahora queda comentado)
			function buildBodyStatusLog(_sl) {
				if (!_sl || !_sl.results || !_sl.results[0])
					return null;

				var zeroDate = _sl.results[0].CREATEDTIME;

				return [
					Subtitle("HISTORIAL"),
					..._sl.results.map(stLog => LineStatusLog(
						formatDateAndTime(stLog.CREATEDTIME),
						`(${Math.round((stLog.CREATEDTIME - zeroDate)/1000/60/60) || '<1'} hora(s))`,
						stLog.CREATEDBY || '',
						stLog.STATUS === '00' ? 'ha creado un documento en blanco' :
						stLog.STATUS === '01' ? 'ha guardado un borrador' :
						stLog.STATUS === '20' ? 'Ha enviado la Solicitud para su validación' :
						stLog.STATUS === '21' ? 'Ha rechazado el Documento' :
						stLog.STATUS === '22' ? 'Ha solicitado una Extensión del Documento' :
						stLog.STATUS === '30' ? 'Ha aprobado la Solicitud' :
						stLog.STATUS === '40' ? 'Ha notificado "Trabajo en Curso"' :
						stLog.STATUS === '50' ? 'Ha solicitado el Cierre Total del Documento' :
						stLog.STATUS === '60' ? 'Ha aprobado el Cierre Total del Documento' :
						stLog.STATUS === '99' ? 'Ha descartado el Documento' :
						'(ESTADO DESCONOCIDO)'
					)),
					// _sl.results.filter(stLog => stLog.STATUS === '60').map(stLog => LineStatusEnd(
					// 	stLog.CREATEDTIME, 
					// 	((Math.round((stLog.CREATEDTIME - zeroDate)/1000/60/60) || '<1') + ' hora(s)'), 
					// 	'DOCUMENTO FINALIZADO.'))
				];
			};

			// --- SOLICITANTE
			function buildBodySolicitante(_d) {
				return [
					Subtitle("SOLICITANTE"),

					Line1111("¿Analizó los riesgos y las medidas de control?",
						formatSwitch(_d.REQ_RMC),
						"", ""),

					Line13(
						"¿Usted y el personal conoce los puntos de reunión, vías y puntos de evacuación señalados en los Planes de Emergencia? (Detalle)",
						formatSwitch(_d.REQ_ACK) + '. ' + (_d.REQ_ACK_EXPLAIN || '')),

					Line13("¿Necesita EPP específicos? (Detalle)", formatSwitch(_d.REQ_SPECIFIC_EPP) + '. ' + (_d.REQ_SPECIFIC_EPP_EXPLAIN || '')),

					Line1111("¿Se requiere confinar el área de trabajo?", formatSwitch(_d.REQ_ISOLATION),
						"¿Dispone de procedimiento o instructivo de trabajo escrito?", formatSwitch(_d.REQ_WINST)),

					Line1111("¿La Actividad corresponde a un trabajo en caliente?", formatSwitch(_d.REQ_WWT),
						"Indicar N° radio frecuencia en la cual se encontrarán solicitante y ejecutante.", _d.REQ_RAD_REQ_EXEC),

					Line1111("¿Requiere delimitar y señalizar el lugar de trabajo?", formatSwitch(_d.REQ_SIGNING),
						"¿Cuenta con todos los EPP básicos definidos en la normativa interna?", formatSwitch(_d.REQ_EPP)),

					Line1111("¿Requiere aislar, bloquear, etiquetado y verificación de energía “0”?", formatSwitch(_d.REQ_NO_ENERGY),
						"¿Requiere fijar partes móviles?", formatSwitch(_d.REQ_FIX_MOV_PARTS)),

					Line1111("¿Tomó conocimiento del diagrama de aislamiento y bloqueo?", formatSwitch(_d.REQ_KNOW_ISO_BLOCK),
						"¿Es necesario ocupar equipo eléctrico o electrónico no apto para áreas?", formatSwitch(_d.REQ_ELECT_EQUIPO)),

					Line1111("Si va a utilizar equipos o herramientas eléctricas: ¿Cuentan con su autorización vigente para su uso?", formatSwitch(_d.REQ_AUTH),
						"", ""),

				];
			};

			// --- EMISOR
			function buildBodyEmisor(_d) {
				return [
					Subtitle("EMISOR"),
					Line1111("¿Existen otros trabajos en el área que interfieran con esta actividad?", formatSwitch(_d.APR_B_OTHER_WORK),
						"¿Requiere iluminación adicional?", formatSwitch(_d.APR_B_LIGHT)),

					Line1111("¿Informó o coordinó con operador de terreno?", formatSwitch(_d.APR_B_OP_TERR),
						"¿El trabajo se realizará con flujo pasante de algún hidrocarburo, gas inerte, condensado o vapor?", formatSwitch(_d.APR_B_FLUX)),

					Line1111("¿El trabajo requiere medición de gases por posibles atmósferas peligrosas?", formatSwitch(_d.APR_B_WORK_LOG),
						"Producto/Sustancia", _d.APR_T_FLUX_PROD),

					Line1111("Si su respuesta es SI, indicar si es potencial atmosfera toxica.", _d.APR_T_ATM_TOX,
						"Temperatura (°C)", _d.APR_T_FLUX_TEMP),

					Line1111("Si su respuesta es SI, indicar si es potencial atmosfera explosiva.", _d.APR_T_ATM_EXP,
						"Presión (psi)", _d.APR_T_FLUX_PRES),

					Line1111("Si su respuesta es SI, indicar frecuencia de medicion", _d.APR_T_ATM_MEASURE,
						"¿El equipo o sistema a intervenir se encuentra depresionado, vaporizado, vacío y/o drenado?", formatSwitch(_d.APR_B_DEPRES)),

					Line1111('¿El trabajo compromete otras áreas/plantas? (Detalle)', formatSwitch(_d.APR_B_OTH_AREAS) + '. ' + (_d.APR_T_OTH_AREAS ||
							''),
						"¿El sistema o equipo se encuentra aislado, bloqueado, etiquetado y verificación de energía \"0\"?", formatSwitch(_d.APR_B_ISOLATE)
					),

					Line1111("¿Existen válvulas \"relief\" o \"PSV\" con descarga a la atmósfera en el área de trabajo?", formatSwitch(_d.APR_B_VALV_REL_PSV),
						"¿Esta Libre de productos (líquidos, gases/vapores, sólidos)? (Detalle)", formatSwitch(_d.APR_B_PROD_FREE) + '. ' + (_d.APR_T_PROD_FREE ||
							'')),

					Line1111("Producto", _d.APR_T_VALV_PROD,
						"¿El trabajo cuenta con Análisis Sistemático de Riesgos (ASR) escrito?", formatSwitch(_d.APR_B_ASR)),

					Line1111("Temperatura (°C)", _d.APR_T_VALV_TEMP,
						"¿Verificó que el área esté preparada y acondicionada para realizar el trabajo de manera segura?", formatSwitch(_d.APR_B_SECURE)),

					Line1111("Presión de descarga (psi)", _d.APR_T_VALV_PRES,
						"¿Se pueden utilizar las plataformas y/o escalas fijas de la planta? Complementario de Altura", formatSwitch(_d.APR_B_PLATFORM)),

					Line1111("TAG", _d.APR_T_VALV_TAG,
						"¿Requiere cierre de válvulas por parte de Operaciones para apoyo de aislamiento? ", formatSwitch(_d.APR_B_VALVE_CLOSE)),

					Line13("¿Requiere considerar velocidad y dirección del viento?", formatSwitch(_d.APR_B_WING) + '. ' + _d.APR_T_WING_FREE),

					/*Line1111("¿Existen otros trabajos en el área que interfieran con esta actividad?", formatSwitch(_d.APR_B_OTHER_WORK), 
                    	"¿Informó o coordinó con operador de terreno?", formatSwitch(_d.APR_B_OP_TERR)),
                    Line1111("¿El trabajo requiere medición de gases por posibles atmósferas peligrosas?", formatSwitch(_d.APR_B_WORK_LOG), 
                    	"Si su respuesta es SI, indicar si es potencial atmosfera toxica.", _d.APR_T_ATM_TOX),
                    Line1111("Si su respuesta es SI, indicar si es potencial atmosfera explosiva.", _d.APR_T_ATM_EXP, 
                    	"Si su respuesta es SI, indicar frecuencia de medicion", _d.APR_T_ATM_MEASURE),
                    Line1111('¿El trabajo compromete otras áreas/plantas? (Detalle)', formatSwitch(_d.APR_B_OTH_AREAS) + '. ' + (_d.APR_T_OTH_AREAS || ''), 
                    	"¿Existen válvulas \"relief\" o \"PSV\" con descarga a la atmósfera en el área de trabajo?", formatSwitch(_d.APR_B_VALV_REL_PSV)),
                    Line1111("Producto", _d.APR_T_VALV_PROD,
                    	"Temperatura (°C)", _d.APR_T_VALV_TEMP), 
                    Line1111("Presión de descarga (psi)", _d.APR_T_VALV_PRES,
                    	"TAG", _d.APR_T_VALV_TAG), 
                    Line1111("¿Requiere considerar velocidad y dirección del viento?", formatSwitch(_d.APR_B_WING),
                    	"¿Requiere iluminación adicional?", formatSwitch(_d.APR_B_LIGHT)), 
                    Line1111("¿El trabajo se realizará con flujo pasante de algún hidrocarburo, gas inerte, condensado o vapor?", formatSwitch(_d.APR_B_FLUX),
                    	"Producto/Sustancia", _d.APR_T_FLUX_PROD), 
					Line1111("Temperatura (°C)", _d.APR_T_FLUX_TEMP,
                    	"Presión (psi)", _d.APR_T_FLUX_PRES), 
                    Line1111("¿El equipo o sistema a intervenir se encuentra depresionado, vaporizado, vacío y/o drenado?", formatSwitch(_d.APR_B_DEPRES),
                    	"¿El sistema o equipo se encuentra aislado, bloqueado, etiquetado y verificación de energía \"0\"?", formatSwitch(_d.APR_B_ISOLATE)), 
                    Line13("¿Esta Libre de productos (líquidos, gases/vapores, sólidos)? (Detalle)", formatSwitch(_d.APR_B_PROD_FREE) + '. ' + (_d.APR_T_PROD_FREE || '')),
                    Line1111("¿El trabajo cuenta con Análisis Sistemático de Riesgos (ASR) escrito?", formatSwitch(_d.APR_B_ASR),
                    	"¿Verificó que el área esté preparada y acondicionada para realizar el trabajo de manera segura?", formatSwitch(_d.APR_B_SECURE)), 
                    Line1111("¿Se pueden utilizar las plataformas y/o escalas fijas de la planta? Complementario de Altura", formatSwitch(_d.APR_B_PLATFORM),
                    	"¿Requiere cierre de válvulas por parte de Operaciones para apoyo de aislamiento? ", formatSwitch(_d.APR_B_VALVE_CLOSE)),                    	*/
				]
			}

			// --- PORTAFOLIO
			function buildBodyPortafolio(_pfd) {
				var _body_portafolio = [
					Subtitle("PORTAFOLIO")
				];

				// V2 - 2 questions by row
				_pfd.groups.forEach((currGroup) => {
					// PRINT GRUPO
					_body_portafolio.push(Group(currGroup));

					// LOOP SUBGRUPOS
					currGroup.subGroups.forEach((subGroup) => {

						// SI EL SUBGRUPO TIENE SUBSUBGRUPOS: PRINT SUBGRUPO
						if (subGroup.subGroups.length)
							_body_portafolio.push(Subgroup(subGroup));

						// SI EL SUBGRUPO NO TIENE SUBSUBGRUPOS: PRINT QUESTION
						else
							_body_portafolio.push(Question(subGroup));

						// SI EL SUBGRUPO TIENE SUBSUBGRUPOS Y ESTÁ MARCADO COMO SÍ
						if (subGroup.subGroups.length && subGroup.switchValue === 'Y') {

							// LOOP SUBSUBGRUPOS *DE A PARES*
							subGroup.subGroups.forEach((subSubGroup, idx, arr) => {
								if (idx % 2 !== 0) // SALTEAR PARES
									return;
								if ((idx + 1) < arr.length) // ITERAR DE A 2 (subSubGroup, nextSubSubGroup)
									var nextSubSubGroup = arr[idx + 1];

								// SI EXISTE UNA SIGUIENTE PREGUNTA
								if (nextSubSubGroup) {
									// SI AMBAS PREGUNTAS SON CON SWITCH: PRINT QUESTIONX2
									if (subSubGroup.switchEnabled && nextSubSubGroup.switchEnabled) {
										_body_portafolio.push(QuestionX2(subSubGroup, nextSubSubGroup));
									}
									// SI ALGUNA NO ES CON SWITCH: (2X) PRINT QUESTION
									else {
										_body_portafolio.push(Question(subSubGroup));
										_body_portafolio.push(Question(nextSubSubGroup));
									}
								}
								// SI NO EXISTE UNA SIGUIENTE PREGUNTA (ÚLTIMA PREGUNTA DEL ELEMENTO PADRE)
								else {
									// PRINT QUESTION
									_body_portafolio.push(Question(subSubGroup));
								}
							});
						}
					});
				})
				return _body_portafolio;
			}

			let body_extensiones = [];

			if (habilitar_extensiones) {
				body_extensiones.push(
					[{
						text: "EXTENSION 1",
						fillColor: _colorPalette.darkBg,
						color: _colorPalette.lightFont,
						style: "smallText",
						bold: true,
						colSpan: 4,
						alignment: "center",
					}, {
						text: "",
						style: "smallText",
						alignment: "center"
					}, {}, {}, ], [
						s("EXTENSION SOLICITADA POR (SOLICITANTE)", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[0].text, "smallText", 2, "center"), {},
					], [
						s("EXTENSION SOLICITADA POR (CORREO SOLICITANTE)", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[1].text, "smallText", 2, "center"), {},
					], [
						s("EXTENSION SOLICITADA FECHA&HORA", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[2].text, "smallText", 2, "center"), {},
					], [
						s("EJECUTANTE", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[3].text, "smallText", 2, "center"), {},
					], [
						s("EJECUTANTE CORREO", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[4].text, "smallText", 2, "center"), {},
					], [
						s("EXTENSION AUTORIZADA POR (EMISOR)", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[5].text, "smallText", 2, "center"), {},
					], [
						s("EXTENSION AUTORIZADA POR (CORREO EMISOR)", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[6].text, "smallText", 2, "center"), {},
					], [
						s("EXTENSION AUTORIZADA FECHA&HORA", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[6].text, "smallText", 2, "center"), {},
					], [
						s("MEDICION", "smallText", 2, "center", true), {},
						s(oExtensiones.textoSubPregunta[1].text, "smallText", 2, "center"), {},
					], [
						s("Operador", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[2].text, "smallText", 2, "center"), {},
					], [
						s("MODELO:", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[3].text, "smallText", 2, "center"), {},
					], [
						s("SERIE:", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[4].text, "smallText", 2, "center"), {},
					], [
						s("FECHA CAL.:", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[5].text, "smallText", 2, "center"), {},
					], [
						s("HORA:", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[6].text, "smallText", 2, "center"), {},
					], [
						s("Limite Permisible:", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[6].text, "smallText", 2, "center"), {},
					], [
						s("O2 (20,5 - 22%):", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[1].text, "smallText", 2, "center"), {},
					], [
						s("LEL (0% del LEL):", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[2].text, "smallText", 2, "center"), {},
					], [
						s("SO2(1,6 ppm):", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[3].text, "smallText", 2, "center"), {},
					], [
						s("CO (40  ppm):", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[4].text, "smallText", 2, "center"), {},
					], [
						s("H2S (8  ppm):", "smallText", 2, "left", true), {},
						s(oExtensiones.textoSubPregunta[5].text, "smallText", 2, "center"), {},
					], [{
						text: "EXTENSION 2",
						fillColor: _colorPalette.darkBg,
						color: _colorPalette.lightFont,
						style: "smallText",
						bold: true,
						colSpan: 4,
						alignment: "center",
					}, {}, {}, {}, ], [
						s("EXTENSION SOLICITADA POR (SOLICITANTE)", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EXTENSION SOLICITADA POR (CORREO SOLICITANTE)", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EXTENSION SOLICITADA FECHA&HORA", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EJECUTANTE", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EJECUTANTE CORREO", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EXTENSION AUTORIZADA POR (EMISOR)", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EXTENSION AUTORIZADA POR (CORREO EMISOR)", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("EXTENSION AUTORIZADA FECHA&HORA", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("MEDICION", "smallText", 2, "center", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("Operador", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("MODELO:", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("SERIE:", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("FECHA CAL.:", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("HORA:", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("Limite Permisible:", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("O2 (20,5 - 22%):", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("LEL (0% del LEL):", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("SO2(1,6 ppm):", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("CO (40  ppm):", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					], [
						s("H2S (8  ppm):", "smallText", 2, "left", true), {},
						s("", "smallText", 1, "center"), {},
					]
				);
			}

			// --- CONTENT
			let _content = [{
				table: {
					widths: ["auto", "*", "auto"],
					body: buildBodyTitle(formattedPrintData)
				},
				layout: "noBorders",
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				table: {
					widths: [110, 130, "*", 120],
					body: buildBodyAntecedentes(formattedPrintData),
				},
				layout: "antecedentesLayout"
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				table: {
					widths: ["*", 22, "*", 22],
					body: buildBodySolicitante(formattedPrintData),
				},
				layout: "solicitanteLayout"
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				table: {
					widths: ["*", "auto", "*", "auto"],
					body: buildBodyEmisor(formattedPrintData),
				},
				layout: "emisorLayout"
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				pageBreak: 'before',
				table: {
					widths: [55, 65, "*", 60, 55, 65, "*", 60],
					body: buildBodyMediciones(formattedPrintData),
				},
				layout: "medicionesLayout"
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				table: {
					widths: ['*', '*', '*', '*'],
					body: buildBodyExtensiones(portafolioData),
				},
				layout: "extensionesLayout"
			}, {
				width: "100%",
				margin: [0, 0, 0, 15],
				table: {
					widths: ['*', 22, '*', 22],
					body: buildBodyPortafolio(portafolioData),
				},
				layout: "portafolioLayout"
			}];

			if (habilitar_extensiones) {
				_content.push({
					width: "100%",
					table: {
						widths: [255, "auto", 255, "auto"],
						// widths: ['auto', 'auto', 'auto', 'auto'],
						heights: ["auto", "auto", "auto", "auto"],
						alignment: "center",
						body: body_extensiones,
					},
				});
			}

			// // Original Palette
			// let _colorPalette = {
			// 	darkBg: "#242c34",
			// 	midBg: "#838c95",
			// 	lightBg: "#c3ccd5",
			// 	ultraLightBg: "#e9ecef",
			// 	lightFont: "#fff",
			// 	darkFont: "#222"
			// }

			// // Alternative Palette 1
			// let _colorPalette = {
			// 	darkBg: "#304D63",
			// 	midBg: "#8FB9AA",
			// 	lightBg: "#B2E7E8",
			// 	ultraLightBg: "#FDF2E1",
			// 	lightFont: "#fff",
			// 	darkFont: "#222"
			// }

			// Alternative Palette 2
			let _colorPalette = {
				darkBg: "#33546D",
				midBg: "#7FA7B8",
				lightBg: "#B9D1DB",
				ultraLightBg: "#F7EFED",
				lightFont: "#fff",
				darkFont: "#222"
			}

			let _styles = {
				MainTitle: {
					fontSize: 16,
					bold: true,
					alignment: "right",
				},
				PermitNumber: {
					fontSize: 16,
					bold: true,
					fillColor: _colorPalette.darkBg,
					color: _colorPalette.lightFont,
					alignment: "left",
				},
				smallText: {
					fontSize: 7.5,
				},
				Subtitle: {
					fontSize: 9,
					fillColor: _colorPalette.darkBg,
					color: _colorPalette.lightFont,
					bold: true,
					alignment: "center",
					characterSpacing: 3
				},
				Group: {
					fontSize: 7.5,
					fillColor: _colorPalette.midBg,
					bold: true,
					alignment: "left",
					margin: [0, 0, 0, 0]
				},
				Subgroup: {
					fontSize: 7.5,
					fillColor: _colorPalette.lightBg,
					bold: true,
					alignment: "left",
					color: _colorPalette.darkFont,
					markerColor: _colorPalette.darkFont,
					margin: [7.5, 0, 0, 0]
				},
				SubgroupSelection: {
					fontSize: 7.5,
					fillColor: _colorPalette.lightBg,
					bold: true,
					alignment: "center",
					color: _colorPalette.darkFont
				},
				QuestionLabel: {
					fontSize: 7.5,
					bold: true,
					alignment: "left",
					//margin: [15, 0, 0, 0]
					fillColor: _colorPalette.ultraLightBg
				},
				QuestionValueCenter: {
					fontSize: 7.5,
					bold: false,
					italics: true,
					alignment: "center",
				},
				QuestionValueLeft: {
					fontSize: 7.5,
					bold: false,
					italics: true,
					alignment: "left",
				},
				PageHeader: {
					fontSize: 9,
					bold: true,
					alignment: "center",
					margin: [0, 15, 0, 0]
				},
				PageFooter: {
					fontSize: 9,
					bold: false,
					alignment: "center",
					margin: [0, 15, 0, 0]
				},
				FieldLabel: {
					fontSize: 7.5,
					bold: true,
					alignment: "left",
					//margin: [15, 0, 0, 0]
					fillColor: _colorPalette.ultraLightBg
				},
				FieldValue: {
					fontSize: 7.5,
					bold: false,
					italics: true,
				},
				DescLabel: {
					fillColor: _colorPalette.midBg,
					fontSize: 9,
					bold: true,
					alignment: "left",
				},
				DescValue: {
					fillColor: _colorPalette.lightBg,
					fontSize: 9,
					bold: true,
					italics: true,
					alignment: "left",
				},
				Status: {
					fillColor: _colorPalette.lightBg,
					fontSize: 9,
					bold: true,
					alignment: "center",
				}
			};

			// Estructura del Formulario
			let docDefinition = {
				// DOC INFO
				info: {
					title: `Documento N°${formattedPrintData.ID}`,
					author: "" // TODO: Fill in author
				},

				// PAGE CONFIG
				pageSize: "A4",
				//pageOrientation: "landscape",
				pageOrientation: "portrait",

				// STYLES
				styles: _styles,

				// HEADER & FOOTER
				header: (i) => (i !== 1 ? {
					text: `${formattedPrintData.ID}`, // TODO: Set header
					style: 'PageHeader'
				} : ''),
				footer: (curr, tot) => ({
					text: `Hoja ${curr} de ${tot}`,
					style: 'PageFooter'
				}),

				// CONTENT
				content: _content
			};

			// Table Layouts
			pdfMake.tableLayouts = {
				// modelLayout: {
				// hLineWidth: function (i, node) {
				// 	if (i === 0 || i === node.table.body.length) {
				// 		return 0;
				// 	}
				// 	return (i === node.table.headerRows) ? 2 : 1;
				// },
				// vLineWidth: function (i) {
				// 	if (i === 0 || i === 4)
				// 		return 1;
				// 	return 0;
				// },
				// hLineColor: function (i) {
				// 	return i === 1 ? 'black' : "#aaa";
				// },
				// paddingLeft: function (i) {
				// 	return i === 0 ? 0 : 8;
				// },
				// paddingRight: function (i, node) {
				// 	return (i === node.table.widths.length - 1) ? 0 : 8;
				// }
				// },
				antecedentesLayout: {
					vLineWidth: function (i) {
						return (i === 0 || i === 2 || i === 4) ? 1 : 0;
					},
					hLineColor: _colorPalette.darkBg,
					vLineColor: _colorPalette.darkBg
				},
				medicionesLayout: {
					vLineWidth: function (i) {
						return (i === 0 || i === 4 || i === 8) ? 1 : 0;
					},
					hLineColor: _colorPalette.darkBg,
					vLineColor: _colorPalette.darkBg
				},
				solicitanteLayout: {
					vLineWidth: function (i) {
						return (i === 0 || i === 2 || i === 4) ? 1 : 0;
					},
					hLineColor: _colorPalette.darkBg,
					vLineColor: _colorPalette.darkBg
				},
				emisorLayout: {
					vLineWidth: function (i) {
						return (i === 0 || i === 2 || i === 4) ? 1 : 0;
					},
					hLineColor: _colorPalette.darkBg,
					vLineColor: _colorPalette.darkBg
				},
				extensionesLayout: {
					vLineWidth: function (i) {
						return (i === 0 || i === 4) ? 1 : 0;
					},
					hLineColor: _colorPalette.darkBg,
					vLineColor: _colorPalette.darkBg
				}
			};

			const pdfDocGenerator = pdfMake.createPdf(docDefinition);

			if (exportAsBase64)
				pdfDocGenerator.getBase64(callback);
			else
				pdfDocGenerator.open();
		},
	};
});
