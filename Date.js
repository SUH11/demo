<html>
<head>
  <title></title>
  <meta charset="utf-8">
  <script>
    window.onload = function() {
      var oDiv = document.getElementsByTagName('div')[0];
      
      setTime();

      function setTime() {

        getTime();

        setInterval(function() {

          getTime();

        }, 1000); 

        // 避免第一秒不出现时间
        function getTime() {
          var oDate = new Date();
          var iYear = oDate.getFullYear();
          var iMonth = oDate.getMonth() + 1;
          var iDate = oDate.getDate();
          var iWeek = oDate.getDay();
          var iHours = oDate.getHours();
          var iMin = oDate.getMinutes();
          var iSec = oDate.getSeconds();

          iWeek = toWeek( iWeek );
          
          var str = '';
          str = iYear + '年' + iMonth + '月' + iDate + '日 ' + iWeek + ' ' + toTwo( iHours ) + ':' + toTwo( iMin ) + ':' + toTwo( iSec );
          oDiv.innerHTML = str;
        }
        function toWeek ( iWeek ) {
          switch( iWeek ) {
            case 0 : iWeek = '星期天';
              break;
            case 1 : iWeek = '星期一'; 
              break;
            case 2 : iWeek = '星期二'; 
              break;
            case 3 : iWeek = '星期三'; 
              break;
            case 4 : iWeek = '星期四'; 
              break;
            case 5 : iWeek = '星期五'; 
              break;
            case 6 : iWeek = '星期六'; 
              break;
          }
          return iWeek;
        }
        function toTwo( n ) {
          return n >= 10 ? '' + n : '0' + n;
        }
      }

      lessTime();

      function lessTime() {
        getTime();
        setInterval( function() {
          getTime();
        }, 1000 );

        function getTime() {
          var oSpan = document.getElementsByTagName('span')[0];
          var newDate = new Date(oSpan.innerHTML);
          var nowDate = new Date();
          var t = newDate - nowDate;
          var d = Math.floor(t/1000/60/60/24);
          var h = Math.floor(t/1000/60/60%24);
          var m = Math.floor(t/1000/60%60);
          var s = Math.floor(t/1000%60);
          var oB = document.getElementsByTagName('b')[0];
          var str = d + '天' + h + '时' + m + '分' + s + '秒';
          oB.innerHTML = str;
        }
      }

    };
  </script>
</head>
<body>
    <div></div>
    <div>倒计时：距离<span>2017-09-10 10:00:00</span>还剩<b></b></div>
</body>
</html>


