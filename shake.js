<html>
<head>
  <title></title>
  <meta charset="utf-8">
  <script>
    window.onload = function() {
      var posArr = [];
      for ( var i = 20; i > 0; i -= 2 ) {
        posArr.push( i, -i );
      }
      posArr.push( 0 );

      var oDiv = document.getElementsByTagName('div')[0];

      oDiv.onclick = function() {
        var pos = getStyle( this, 'left' );
        var _this = this;
        var i = 0;
        var timer = setInterval(function(){
          if ( i === posArr.length ) {
            clearInterval(timer);
            _this.style.left = pos;
            console.log(pos);
          }
          _this.style.left = parseInt(getStyle( _this, 'left' )) + posArr[i] + 'px';
          i ++;
        }, 80);
      };

      function getStyle( obj, attr ) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle( obj )[attr];
      }


    };
  </script>
  <style>
    div { width: 100px; height: 100px; background: green; position: absolute; left: 200px; top: 200px; }
  </style>
</head>
<body>
    <div></div>
</body>
</html>


