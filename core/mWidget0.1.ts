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
            var res = '', parts = [{start: 0, recursive: false}], count = 0;
            for(var i = 0; i < params.tpl.length; i++){ // split tpl in recursive and non recursive parts
                if ((params.tpl[i] == '[' || i == params.tpl.length-1) && ++count == 1)
                    parts.push({start: i, recursive: true});
                if (params.tpl[i] == ']' && --count == 0)
                    parts.push({start: i+1, recursive: false});
            };
			$.each((params.customHandler || (data => data))(params.data), (i, entry) => { // for each data element, apply the customHandler, default customHandler is 'data => data'. 				
             	var tempTpl = params.tpl;
                $.each(parts, function (i, e) { // for each part, do replacements with either recursion or a regex replace
                    if(i < parts.length-1)
                        tempTpl = tempTpl.replace(params.tpl.substring(e.start, parts[i+1].start), tplPart => 
                            e.recursive ?
                                $.mWidget({
                                    tpl: tplPart.slice(/\s/igm.exec(tplPart).index, -1),
                                    data: entry[tplPart.substring(tplPart.indexOf('[')+1, /\s/igm.exec(tplPart).index)] || {}
                                }) :
                                tplPart.replace(/{[_a-zA-Z][_a-zA-Z0-9]*}/g, request => (data => typeof data == 'object'? JSON.stringify(data, null, 2): data)(entry[request.slice(1, -1)])   
                        );
                });
                res += tempTpl;
            });
            if (params.target)
                $(params.target).append(res);
            return res;
		}
	}
})(jQuery, window);