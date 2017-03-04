# mWidget
Simple templating system. ***[ONLINE DEMO](http://miguelp.com/mWidget)***.

## Input
- Input is provided as a JavaScript Object.
- Required members:
	- either _data_ or _dataAjax_
	- either _tpl_ or _tplAjax_
- Optional members:
	- _customHandler_
	- _target_

- Example of usage:
```javascript
$.mWidget({
	dataAjax: {
		url: 'data/my_data.json.txt'
	},
	tplAjax: {
		url: 'tpl/my_tpl.tpl.html'
	},
	target: '#res',
	customHandler: function(data) {
		data = JSON.parse(data);
		$.each(data, function(i, entry) { // this $.each is not included inside the $.mWidget implementation, if needed, it can be added like shown here. We know it will not allways be necessary.
			entry.img = (entry.gender == 'Male'? 'img/man.png': 'img/women.png'); // this is a very simple example of how the data can be modified using a custom handler.
		});
		return data;
	}
});
```

## Mission
- To provide Base22 developers a mechanism for rendering data that can be integrated on different environments (IBM WebSphere Portal included), and with other tools in a simplistic and transparent manner. Such mechanism should very loosely couple the model, view and controller. Ultimately, to reuse code in order to save resources.

## Philosophy
- Model, view and controller are kept as separate as possible.
	- The is no way to of introducing logic to your TPL.
	- Logic can be executed on the model by passing a handler named _customHandler_ inside your configuration object.
	- The model can be passed directly as an object called _data_, or you can pass in a URL, _dataURL_, for mWidget to get the data.
- mWidget extends jQuery to keep the global namespace clean.
- Flexibility and simplicity es preserved by using the _customHandler_.
- TypeScript is being used to ensure cross browser compatibility while allowing for new development techniques. 