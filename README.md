# mWidget
This project is a very simple templating system. ***[DEMO ONLINE](http://miguelp.com/mWidget)***.

## Input
- Input is provided as a JavaScript Object.
- Required members:
	- _tplURL_
	- _target_
	- either _data_ or _dataURL_
- Optional members:
	- _method_
	- _customHandler_

- Example:
```javascript
{
	dataURL: 'data/my_data.json.txt',
	method: 'get',
	tplURL: 'tpl/my_tpl.tpl.html',
	target: '#res',
	customHandler: function(data) {
		jQuery.each(data, function(i, entry) {
			entry.img = (entry.gender == 'Male'? 'img/man.png': 'img/women.png');
		});
		return data;
	}
}
```


## Philosophy
- Model, view and controller are kept as separate as possible.
	- The is no way to of introducing logic to your TPL.
	- Logic can be executed on the model by passing a handler named _customHandler_ inside your configuration object.
	- The model can be passed directly as an object called _data_, or you can pass in a URL, _dataURL_, for mWidget to get the data.
- mWidget extends jQuery to keep the global namespace clean.
- Flexibility and simplicity es preserved by using the _customHandler_.
- TypeScript is being used to ensure cross browser compatibility while allowing for new development techniques. 