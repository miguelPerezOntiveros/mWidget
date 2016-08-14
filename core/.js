if ("undefined" == typeof jQuery) {
    throw "mWidget requires jQuery";
}
function mWidget(params) {
    if (!params.tplURL || !params.target) {
        throw "mWidget requires a 'tpl' and a 'target' html element";
    }
    if (params.data) {
        $.get(params.tplURL, function (tpl) {
            jQuery.each((params.customHandler || (function (data) { return data; }))(params.data), function (i, entry) {
                $(params.target).append(tpl.replace(/{{[_a-zA-Z][_a-zA-Z0-9]*}}/g, function (request) { return entry[request.slice(2, -2)]; }));
            });
        });
    }
    else if (params.dataURL) {
        $[(params.method || 'get')](params.dataURL, function (data) {
            params.data = JSON.parse(data);
            mWidget(params);
        });
    }
    else {
        throw "mWidget requires either the data or a URL to get it from";
    }
}
//# sourceMappingURL=.js.map