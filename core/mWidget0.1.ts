(function ($, window, undefined) {
    $.mWidget = function (params) {
    	if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl) )
            throw "mWidget parameters object requires a 'tpl'/'tplAjax' and a 'data'/'dataAjax' %o", params;
		if (!params.data) { // use the dataAjax object to get the data and then call $.mWidget again.
			params.dataAjax.success = data => {
				params.data = data;
				$.mWidget(params);
			};
			$.ajax(params.dataAjax);
		}
		else if (!params.tpl) { // use the tplAjax object to get the tpl and then call $.mWidget again.
			params.tplAjax.success = data => {
				params.tpl = data;
				$.mWidget(params);
			};
			$.ajax(params.tplAjax);
		}
		else {
			var res = '';
			$.each( (params.customHandler || (data => data))(params.data), (i, entry) => { // for each data element, apply the customHandler, default customHandler is 'data => data'. 				
				var count = 0, tempStart, tempTpl = params.tpl;
				$.each(params.tpl.split(''), (i, c) => {
				    if(c == '[' && ++count == 1) 
						tempStart = i;
				    if(c == ']' && --count == 0)
						tempTpl = params.tpl.replace( params.tpl.substring(tempStart, i+1), arrayRequest => $.mWidget({ // use mWidget to compute inner tpl
																		    tpl: arrayRequest.slice(arrayRequest.indexOf('\n'), -1),
																		    data: entry[arrayRequest.substring(1, arrayRequest.indexOf('\n'))] || {}
																		})
						);
				});
                res += tempTpl.replace(/{[_a-zA-Z][_a-zA-Z0-9]*}/g, request => entry[request.slice(1, -1)] );
            });
            if (params.target)
                $(params.target).append(res);
            return res;
		}
	}
})(jQuery, window);