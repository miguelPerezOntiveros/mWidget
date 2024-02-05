mWidget = params => {
    if (!(params.dataURL || params.data) || !(params.templateURL || params.template))
        throw 'mWidget parameters object requires a template/templateURL and a data/dataURL %o', params
    if (!params.data)
        httpGetAsync(params.dataURL, response=>{
            params.data = response
            mWidget(params)
        })
    else if (!params.template)
        httpGetAsync(params.templateURL, response=>{
            params.template = response
            mWidget(params)
        })
    else {
        let templateParts = [{ start: 0, recursive: false }]
        let pending_closing_brackets = 0
        params.template.split('').forEach((char, char_index)=>{
            if(char == '[' && ++pending_closing_brackets == 1){
                templateParts.push({ start: char_index, recursive: true })
            }
            else if(char == ']' && --pending_closing_brackets == 0){
                templateParts.push({ start: char_index+1, recursive: false })
            }
        })        
        if(pending_closing_brackets){
        	throw 'mWidget template has unbalanced square brackets'
        }
        let result = '';
        (params.customHandler || (data => data))(params.data).forEach(dataPiece => {
            templateParts.forEach((part, i) => {
                let templatePart = params.template.substring(part.start, i==templateParts.length-1? params.template.length: templateParts[i+1].start)
                result += part.recursive?
                    mWidget({
                        template: templatePart.slice(/\s/.exec(templatePart).index, -1),
                        data: (dataPiece[templatePart.substring(1, /\s/.exec(templatePart).index)] || []).map(dataPieceValue =>
							({	
								...dataPieceValue,
								'_parent': dataPiece
							})
						)
                    }) :
                    templatePart.replace(/{[_a-zA-Z][\._a-zA-Z0-9]*}/g, interpolation => {
                    	let dataPieceValue = dataPiece
                    	interpolation.slice(1, -1).split('.').forEach(attribute => {
                    		dataPieceValue = dataPieceValue[attribute] || ''
                    	})
                        if(typeof dataPieceValue == 'object'){
                            return JSON.stringify(dataPieceValue, null, 2)
                        }
                        else if(dataPieceValue){
                            return dataPieceValue
                        }
                        else{
                        	return ''
                        }
                    })
            })
        })
        if(params.target){
            document.querySelector(params.target).innerHTML += result
        }
        if(params.success){
            params.success(result)
        }
        return result
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
