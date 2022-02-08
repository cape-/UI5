        formatTime: function(oTime) {
        	var h = Math.floor(oTime.ms/1000/60/60),
            m = Math.floor((oTime.ms/1000/60/60 - h)*60),
            s = Math.floor(((oTime.ms/1000/60/60 - h)*60 - m)*60);

          s = s < 10 ? `0${s}`: s;
          m = m < 10 ? `0${m}`: m;
          h = h < 10 ? `0${h}`: h;

        	return `${s}:${m}:${h}`;
        },
