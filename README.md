# mWidget
Simple templating system.

## Input
- Input is provided as a JavaScript Object.
- Required members:
	- either _data_ or _dataURL_
	- either _tpl_ or _tplURL_
- Optional members:
	- _customHandler_
	- _target_
	- _success_

- Example of usage:
```javascript
mWidget({
	dataURL: 'data/my_data.json.txt',
	tplURL: 'tpl/my_tpl.tpl.html',
	target: '#res',
	customHandler: data => {
		data = JSON.parse(data)
		data.forEach(e => { // this forEach is not included inside the $.mWidget implementation, if needed, it can be added like shown here. We know it will not allways be necessary.
			e.img = (e.gender == 'Male'? 'img/man.png': 'img/women.png') // this is a very simple example of how the data can be modified using a custom handler.
		})
		return data
	},
	success: res=>{console.log(res)}
});
```


## Philosophy
- Model, view and controller are kept as separate as possible.
	- The is no way to of introducing logic to your TPL.
	- Logic can be executed on the model by passing a handler named _customHandler_ inside your configuration object.
	- The model can be passed directly as an object called _data_, or you can pass in a URL, _dataURL_, for mWidget to get the data.
	- The view can be passed directly as an object called _tpl_, or you can pass in a URL, _tplURL_, for mWidget to get the data.
