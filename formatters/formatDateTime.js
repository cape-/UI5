        formatDateTime: function(sDate, sLocale = 'es-cl', sDefault) {
        	var oDate = new Date(sDate);
        	return !isNaN(oDate.getTime()) ? oDate.toLocaleDateString(sLocale) + ' ' + oDate.toLocaleTimeString(sLocale) : sDefault || '';
        },

