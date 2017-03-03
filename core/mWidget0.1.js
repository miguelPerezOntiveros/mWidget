(function ($, window, undefined) {
    $.mWidget = function (params) {
        console.log('call to mWidget');
        console.log('data?' + ((params.dataAjax || params.data) != undefined));
        console.log('tpl?' + ((params.tplAjax || params.tpl) != undefined));
        if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl)) {
            throw "mWidget parameters object requires a 'tpl'/'tplAjax' and a 'data'/'dataAjax' %o", params;
        }
        if (!params.data) {
            // use the dataAjax object to get the data and then call $.mWidget again.
            params.dataAjax.success = function (data) {
                params.data = JSON.parse(data);
                $.mWidget(params);
            };
            $.ajax(params.dataAjax);
        }
        else if (!params.tpl) {
            // use the tplAjax object to get the tpl and then call $.mWidget again.
            params.tplAjax.success = function (data) {
                params.tpl = data;
                $.mWidget(params);
            };
            $.ajax(params.tplAjax);
        }
        else {
            var res = '';
            $.each((params.customHandler || (function (data) { return data; }))(params.data), function (i, entry) {
                var part = params.tpl.replace(/\[\[[^\]\]]*\]\]/g, function (arrayRequest) {
                    return (entry[arrayRequest.substring(2, arrayRequest.indexOf('\n'))] ?
                        $.mWidget({
                            tpl: arrayRequest.slice(arrayRequest.indexOf('\n'), -2),
                            data: entry[arrayRequest.substring(2, arrayRequest.indexOf('\n'))]
                        }) :
                        '');
                });
                res += part.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, function (request) { return entry[request.slice(2, -2)]; });
            });
            if (params.target)
                $(params.target).append(res);
            return res;
        }
    };
})(jQuery, window);
