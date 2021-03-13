mWidget = params => {
    if (!(params.dataURL || params.data) || !(params.tplURL || params.tpl))
        throw 'mWidget parameters object requires a tpl/tplURL and a data/dataURL %o', params
    if (!params.data)
        httpGetAsync(params.dataURL, response=>{
            params.data = response
            mWidget(params)
        })
    else if (!params.tpl)
        httpGetAsync(params.tplURL, response=>{
            params.tpl = response
            mWidget(params)
        })
    else {
        var res = '', parts = [{ start: 0, recursive: false }], count = 0
        params.tpl.split('').forEach((char, i)=>{
            if(char == '[' && ++count == 1)
                parts.push({ start: i, recursive: true })
            if(char == ']' && --count == 0)
                parts.push({ start: i + 1, recursive: false })
        })
        var handledData = (params.customHandler || (data => data))(params.data) // apply the customHandler, default customHandler is 'data => data'
        handledData.forEach(dataPiece => {
            parts.forEach((part, i) => {
                var tplPart = params.tpl.substring(part.start, i==parts.length-1? params.tpl.length-1: parts[i+1].start)
                res += part.recursive?
                    mWidget({
                        tpl: tplPart.slice(/\s/igm.exec(tplPart).index, -1),
                        data: dataPiece[tplPart.substring(tplPart.indexOf('[') + 1, /\s/igm.exec(tplPart).index)] || {}
                    }) :
                    tplPart.replace(/{[_a-zA-Z][_a-zA-Z0-9]*}/g, attribute => {
                        var res = dataPiece[attribute.slice(1, -1)]
                        if(typeof res == 'object')
                            return JSON.stringify(res, null, 2)
                        else
                            return res
                    })
            })
        })
        if(params.target)
            document.querySelector(params.target).innerHTML += res
        if(params.success)
            params.success(res)
        return res
    }
}

httpGetAsync = (URL, callback) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) // 4 means Done
            callback(xmlHttp.responseText);
    }
    xmlHttp.open('GET', URL, true) // true for asynchronous 
    xmlHttp.send()
}
