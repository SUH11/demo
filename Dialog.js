/**
	注意：被拖拽的对象使用margin值会出现问题
	
	options: 
		title 标题
		content 内容
		answer : {   两个按钮
			yes : '返回true'，
			no : '返回false'
		}
		sure : '单个按钮，返回false'，
		drag 是否可拖拽

	method :
		close() 关闭
		drag()  拖拽
	问题：
		1.鼠标样式未设置成功
		2.点击和拖拽事件冲突

*/
function Dialog() {
	this.num = 0;
	this.oDialog = null;
	this.oWrap = null;
	this.oClose = null;
	this.aAnswer = null;
	this.flag = false;
	this.disX = 0;
	this.disY = 0;

	this.mark = 'drag';

	this.settings = {
		width : '500',
		title : '',
		content : '',
		drag : false,
		answer : {
			no : '取消',
			yes : '确定'
		},
		sure : 'OK'
	};

}

Dialog.prototype = {
	// 原型链
	constructor : Dialog,
	init : function( opts ) {
		extend( this.settings, opts );
		// 设置包裹层，好设置动画
		this.oWrap = document.createElement('div');
		this.oWrap.className = 'dialog_wrap';
		document.body.appendChild(this.oWrap);

		this.oDialog = document.createElement('div');
		this.oWrap.appendChild(this.oDialog);

		this.oDialog.className = 'dialog';
		this.oDialog.innerHTML = '<span class="dialog_title">'+ this.settings.title +'<button>&#215;</button></span><p>'+ this.settings.content+'</p>';
		this.oClose = this.oDialog.getElementsByTagName('button')[0];

		// 查看是否有选项

		if ( opts.answer || opts.sure ) {
			var hr = document.createElement('hr');
			var oAnswer = document.createElement('div');
			oAnswer.className = 'answer';

			var oButton = document.createElement('button');
			
			if ( opts.answer ) {

				oButton.innerHTML = this.settings.answer.no;
				oAnswer.appendChild(oButton);
				var oButton = document.createElement('button');
				oButton.innerHTML = this.settings.answer.yes;
				oAnswer.appendChild( oButton );

			} else if ( opts.sure ) {
				oButton.innerHTML = this.settings.sure;
				oAnswer.appendChild(oButton);
			}
			
			this.oDialog.appendChild(hr);
			this.oDialog.appendChild(oAnswer);
			this.aAnswer = oAnswer.getElementsByTagName('button');

			this.return();

		} 
		// 设置初始样式
		this.oDialog.style.width = this.settings.width + 'px';
		this.oWrap.style.left = (document.documentElement.clientWidth - parseInt(getStyle(this.oDialog, 'width')) )/2 + 'px';
		this.oWrap.style.top = '20px';
		this.oWrap.style.height = parseInt( getStyle( this.oDialog, 'height')) + 'px';

		// 是否设置拖拽
		if ( this.settings.drag ) {
			this.drag();
		}			

		this.oCloseClick();

	},
	// 拖拽
	drag : function() {
		var _this = this;
		this.oWrap.onmousedown = function( ev ) {
			// document.style.cursor = 'move';
			this.style.cursor = 'cursor';
			var ev = ev || event;
			_this.dragDown(ev);

			document.onmousemove = function(ev) {
				// _this.oWrap.style.cursor = 'move';
				_this.dragMove(ev);
			}
			document.onmouseup = function() {
				_this.dragUp();

			}
			return false;
		}
	},
	dragDown : function(ev) {
		// this.oWrap.style.cursor = 'move';
		var pos = getValue(this.oWrap);
		this.disX = ev.clientX - pos.l;
		this.disY = ev.clientY - pos.t;
	},
	dragMove : function(ev) {
		var ev = ev || event;
		var L = ev.clientX - this.disX;
		var T = ev.clientY - this.disY;
		var maxL = document.documentElement.clientWidth - this.oWrap.offsetWidth;
		var maxT = document.documentElement.clientHeight - this.oWrap.offsetHeight;
		// 限制范围的拖拽
		if ( L < 0 ) {
			L = 0;
		} else if ( L > maxL ) {
			L = maxL;
		}
		if ( T < 0 ) {
			T = 0; 
		} else if ( T > maxT ) {
			T = maxT;
		}
		this.oWrap.style.left = L + 'px';
		this.oWrap.style.top = T + 'px';
	},
	dragUp : function() {
		this.oWrap.style.cursor = 'default';
		document.onmouseup = document.onmousemove = null;
	},
	// 点击x关闭
	oCloseClick : function(){
		var _this = this;
		this.oClose.onclick = function() {
			_this.close();
		}
	},
	// 直接关闭
	close : function() {
		var _this = this;
		var timer = setInterval(function(){
			var iH = parseInt(getStyle(_this.oWrap, 'height'));
			var iSpeed = -iH/20;
			iSpeed = Math.floor(iSpeed);

			if ( iH <= Math.abs(iSpeed) ) {
				_this.oWrap.style.height = '0px';
				clearInterval( timer );
			} else {
				_this.oWrap.style.height = iH + iSpeed + 'px';
			}

		}, 10);
	},
	// 设置对话框的返回值
	return : function() {
		var _this = this;			

		this.aAnswer[0].onclick = function() {
			_this.flag = false;
			_this.close();
		}
		if ( this.aAnswer.length > 1 ) {
			this.aAnswer[1].onclick = function() {
				_this.flag = true;
				_this.close();
			}
		}
	}
};

function getValue( obj ) {
	var pos = {
		l : 0,
		t : 0
	};
	while( obj ) {
		pos.l += obj.offsetLeft;
		pos.t += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return pos;
}

function extend( obj1, obj2 ) {
	for ( var attr in obj2 ) {
		obj1[attr] = obj2[attr];
	}
}

function getStyle( obj, attr ) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle( obj, false )[attr];
}