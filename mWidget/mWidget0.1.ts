(function($, window, undefined){
	$.mWidget = params => {
		if(!params.tplURL || !params.target){
			throw "mWidget requires a 'tpl' and a 'target' html element";
		}
		if(params.data){
			$.get(params.tplURL, tpl => {  // get the tpl, and for each data element, apply the customHandler, if no customHandler is provided, default function is 'data => data'. 
				jQuery.each( (params.customHandler || (data => data))(params.data), (i, entry) => { //replace anything that needs ot be replaced in the tpl, and append it to the provided target.
					$(params.target).append(tpl.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, request => entry[request.slice(2, -2)]));
				});
			});
		}
		else if(params.dataURL)
		{ // if no data was provided but we have a dataURl, then get the data and call this function again, now with it.
			$[(params.method || 'get')](params.dataURL, data => {
				params.data = JSON.parse(data);
				$.mWidget(params);	
			}); 
		}
		else {
			throw "mWidget requires either the data or a URL to get it from";
		}
	}
})(jQuery, window);