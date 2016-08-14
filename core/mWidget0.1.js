(function ($, window, undefined) {
    $.mWidget = function (params) {
        if (!(params.dataAjax || params.data) || !(params.tplAjax || params.tpl) || !params.target) {
            throw "mWidget parameters object requires a 'tpl'/'tplAjax', a 'data'/'dataAjax' and a 'target' member";
        }
        if (!params.data) {
            params.dataAjax.success = function (data) {
                params.data = JSON.parse(data);
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
            // for each data element, apply the customHandler, default customHandler is 'data => data'. 
            $.each((params.customHandler || (function (data) { return data; }))(params.data), function (i, entry) {
                $(params.target).append(params.tpl.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, function (request) { return entry[request.slice(2, -2)]; }));
            });
        }
    };
})(jQuery, window);
