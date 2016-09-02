(function ($, window, undefined) {
    $.mWidget = function (params) {
        if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl) || !params.target) {
            throw "mWidget parameters object requires a 'tpl'/'tplAjax', a 'data'/'dataAjax' and a 'target' member";
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
			// for each data element, apply the customHandler, default customHandler is 'data => data'. 
			$.each( (params.customHandler || (data => data))(params.data), (i, entry) => { //replace anything that needs ot be replaced in the tpl, and append it to the 'target'.
				$(params.target).append(params.tpl.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, request => entry[request.slice(2, -2)]));
			});
		}
	}
})(jQuery, window);