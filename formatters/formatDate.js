        formatDate: function(sDate, sLocale = 'es-cl') {
        	var oDate = new Date(sDate);
        	return !isNaN(oDate.getTime()) ? oDate.toLocaleDateString(sLocale) : '';
        },
