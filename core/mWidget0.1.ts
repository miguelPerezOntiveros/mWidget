(function ($, window, undefined) {
    $.mWidget = function (params) {
    	console.log('call to mWidget');
    	console.log('data?' + ((params.dataAjax || params.data) != undefined));
    	console.log('tpl?' + ((params.tplAjax || params.tpl) != undefined));
        if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl) ) {
            throw "mWidget parameters object requires a 'tpl'/'tplAjax' and a 'data'/'dataAjax' %o", params;
        }
		if (!params.data) {
			// use the dataAjax object to get the data and then call $.mWidget again.
			params.dataAjax.success = data => {
				params.data = JSON.parse(data);
				$.mWidget(params);
			};
			$.ajax(params.dataAjax);
		}
		else if (!params.tpl) {
			// use the tplAjax object to get the tpl and then call $.mWidget again.
			params.tplAjax.success = data => {
				params.tpl = data;
				$.mWidget(params);
			};
			$.ajax(params.tplAjax);
		}
		else {
			var res = '';
			$.each( (params.customHandler || (data => data))(params.data), (i, entry) => { // for each data element, apply the customHandler, default customHandler is 'data => data'. 				
				var part = params.tpl.replace(/\[\[[^\]\]]*\]\]/g, arrayRequest =>
					(entry[arrayRequest.substring(2, arrayRequest.indexOf('\n'))]?	
						$.mWidget({ // use mWidget to compute inner tpl
							tpl: arrayRequest.slice(arrayRequest.indexOf('\n'), -2),
							data: entry[arrayRequest.substring(2, arrayRequest.indexOf('\n'))]
						}) : 
						''
					)
				);
				res += part.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, request => entry[request.slice(2, -2)] );
			});
			if(params.target)
				$(params.target).append(res);
			return res;
		}
	}
})(jQuery, window);