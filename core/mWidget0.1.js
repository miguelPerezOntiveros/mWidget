(function ($, window, undefined) {
    $.mWidget = function (params) {
        if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl))
            throw "mWidget parameters object requires a 'tpl'/'tplAjax' and a 'data'/'dataAjax' %o", params;
        if (!params.data) {
            params.dataAjax.success = function (data) {
                params.data = data;
                $.mWidget(params);
            };
            $.ajax(params.dataAjax);
        }
        else if (!params.tpl) {
            params.tplAjax.success = function (data) {
                params.tpl = data;
                $.mWidget(params);
            };
            $.ajax(params.tplAjax);
        }
        else {
            var res = '';
            $.each((params.customHandler || (function (data) { return data; }))(params.data), function (i, entry) {
                var count = 0, tempStart, tempTpl = params.tpl;
                $.each(params.tpl.split(''), function (i, c) {
                    if (c == '[' && ++count == 1)
                        tempStart = i;
                    if (c == ']' && --count == 0)
                        tempTpl = params.tpl.replace(params.tpl.substring(tempStart, i + 1), function (arrayRequest) { return $.mWidget({
                            tpl: arrayRequest.slice(arrayRequest.indexOf('\n'), -1),
                            data: entry[arrayRequest.substring(1, arrayRequest.indexOf('\n'))] || {}
                        }); });
                });
                res += tempTpl.replace(/{[_a-zA-Z][_a-zA-Z0-9]*}/g, function (request) { return entry[request.slice(1, -1)]; });
            });
            if (params.target)
                $(params.target).append(res);
            return res;
        }
    };
})(jQuery, window);
