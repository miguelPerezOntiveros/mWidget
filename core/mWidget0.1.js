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
            var res = '', parts = [{ start: 0, recursive: false }], count = 0;
            for (var i = 0; i < params.tpl.length; i++) {
                if ((params.tpl[i] == '[' || i == params.tpl.length - 1) && ++count == 1)
                    parts.push({ start: i, recursive: true });
                if (params.tpl[i] == ']' && --count == 0)
                    parts.push({ start: i + 1, recursive: false });
            }
            ;
            var handledData = (params.customHandler || (function (data) { return data; }))(params.data); // apply the customHandler, default customHandler is 'data => data'
            for (var i = 0; i < handledData.length; i++) {
                var tempTpl = params.tpl;
                for (var j = 0; j < parts.length - 1; j++) {
                    tempTpl = tempTpl.replace(params.tpl.substring(parts[j].start, parts[j + 1].start), function (tplPart) {
                        return parts[j].recursive ?
                            $.mWidget({
                                tpl: tplPart.slice(/\s/igm.exec(tplPart).index, -1),
                                data: handledData[i][tplPart.substring(tplPart.indexOf('[') + 1, /\s/igm.exec(tplPart).index)] || {}
                            }) :
                            tplPart.replace(/{[_a-zA-Z][_a-zA-Z0-9]*}/g, function (request) { return (function (data) { return typeof data == 'object' ? JSON.stringify(data, null, 2) : data; })(handledData[i][request.slice(1, -1)]); });
                    });
                }
                ;
                res += tempTpl;
            }
            if (params.target)
                $(params.target).append(res);
            return res;
        }
    };
})(jQuery, window);
