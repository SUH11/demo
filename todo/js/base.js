;(function(){
    'use strict';
    // alert(1)
    // console.log(111)
    // console.log('jQuery',jQuery);

    var $form_add_task = $('.add-task')
      , $body = $('body')
      , $window = $(window)
      , task_list = {}
      , $task_delete_trigger 
      , $task_detail_trigger
      , $task_complete_trigger
      , $task_detail_mask = $('.task-detail-mask')
      , $task_detail = $('.task-detail')
      , $task_detail_form
      , $task_detail_content
      , $task_item
      , $task_detail_content_input
      , $msg = $('.msg')
      , $msg_content = $('.msg-content')
      , $comfirmed = $('.comfirmed')
      , $alerter = $('.alerter')
      ;

    init();


    // 提交task 
    $form_add_task.find('input[type=submit]').on('click',on_add_task_form_submit);
    $task_detail_mask.on('click',hide_task_detail);

    $comfirmed.on('click', hide_msg);

    function on_add_task_form_submit(ev) {
        ev.preventDefault();

        var new_task = {};
        var $input = $form_add_task.find('input[name=content]');

        new_task.content = $input.val();

        if ( !new_task.content ) 
            return;
        if ( add_task(new_task) ) {
            render_add_task();
            $input.val(null);
        }
    }

    // 监听删除事件
    function listen_task_delete() {
        $task_delete_trigger.on('click', function(){
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');

            pop('确定删除？')
                .then(function(r){
                    r ? task_delete_list(index) : null;
                });
            
        });
    }

    // 监听细节事件
    function listen_task_detail() {
        $task_detail_trigger.on('click', function(){
            var $item = $(this).parent().parent();
            temp($item);
        });
        $task_item.on('dblclick',function(){
            temp($(this));
        });
        function temp($item) {
            var index = $item.data('index');
            show_task_detail(index);
        }
    }

    // 监听task的完成事件
    function listen_task_complete() {
        $task_complete_trigger.on('click', function(){
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            var item = get(index);
            if ( item.complete === true ) {
                updata_task(index, { complete : false });
            } else {
                updata_task(index, { complete : true });
            }

            

        });
    }

    function get(index) {
        return store.get('task_list')[index];
    }

    // 显示任务详情
    function show_task_detail(index) {
        render_task_detail(index);
        $task_detail.show();
        $task_detail_mask.show();
    }

    // 隐藏任务详情
    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    // 显示任务详情
    function render_task_detail(index) {
        if ( index === undefined || !task_list[index] )
            return;
        var item = task_list[index];
        /*if ( !item.decs ) {
            item.decs = '';
        }*/
        var tpl = '\
            <form>\
                <div class="content">'+ item.content +'</div>\
                <input name="content" type="text" value="'+ (item.content || '') +'">\
                <div class="decs">\
                    <textarea name="decs" value="" autofocus>'+ (item.decs || '')  +'</textarea>\
                </div>\
                <div class="remind">\
                    <div><label>提醒时间：</label></div>\
                    <input type="text" class="datetime" name="remind-date" value="'+ (item.remind_date || '') +'">\
                    <button type="submit" class="submit">更新</button>\
                </div>\
            </form>\
        ';
        $task_detail.html(null);
        $task_detail.html(tpl);

        $('.datetime').datetimepicker();

        $task_detail_form = $task_detail.find('form');
        $task_detail_content = $task_detail_form.find('.content');
        $task_detail_content_input = $task_detail_form.find('[name=content]');

        $task_detail_content.on('dblclick', function(){
            $(this).hide();
            $task_detail_content_input.show();
        });

        $task_detail_form.on('submit', function(ev){
            ev.preventDefault();

            var $this = $(this);
            var data = {};
            data.content = $this.find('[name=content]').val();
            data.decs = $this.find('[name=decs]').val();
            data.remind_date = $this.find('[name=remind-date]').val();

            updata_task(index, data);

            hide_task_detail();

        });
    }

    // 更新任务详情
    function updata_task(index, data) {
        if ( !index || !data ) return;
        task_list[index] = $.extend({}, task_list[index], data);
        refresh_tash_list();
    }

    // 添加task
    function add_task(new_task) {
        task_list.push(new_task);
        refresh_tash_list();
        return true;
    }

    function render_add_task() {
        console.log('1',1);
    }

    // 渲染task_list
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        var complete_item = [];
        for ( var i = 0; i < task_list.length; i ++ ) {
            var item = task_list[i];
            if ( item && item.complete ) {
                item.index = i;
                complete_item.push(item);
            } else {
                var $task = render_task_item(task_list[i], i);
            }
            $task_list.prepend($task);
        }

        for ( var i = 0; i < complete_item.length; i ++ ) {
            var $task = render_task_item(complete_item[i], complete_item[i].index);
            if ( !$task ) continue;
            $task.addClass('completed');
            $task_list.append($task);
        }

        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        $task_complete_trigger = $('input[type=checkbox].complete');
        $task_item = $('.task-item');

        listen_task_delete();
        listen_task_detail();
        listen_task_complete();
    }

    // 删除task
    function task_delete_list(index) {
        if ( index === undefined || !task_list[index] ) return;
        delete task_list[index];

        refresh_tash_list();
    }

    // 更新localStorage数据 并监听删除事件
    function refresh_tash_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    // 渲染单条tash
    function render_task_item(data, index) {
        if ( !data || !index )  return;

        var list_item_tpl = '\
            <div class="task-item" data-index="'+ index +'">\
                <span><input type="checkbox" '+ (data.complete ? 'checked' : '') +' class="complete"></span>\
                <span class="task-content">'+ (data.content || '') +'</span>\
                <span class="fr">\
                    <span class="delete action"> 删除</span>\
                    <span class="detail action"> 详细</span>\
                </span>\
            </div>';
        return $(list_item_tpl);
    }

    // 定时提醒
    function task_remind_check() {
        var current_timestamp;

        var timer = setInterval(function(){
            for ( var i = 0; i < task_list.length; i ++ ) {
                var item = get(i);
                var task_timestamp;
                if ( !item || !item.remind_date  || item.comfired )
                    continue;
                current_timestamp = (new Date()).getTime();
                task_timestamp = (new Date(item.remind_date)).getTime();

                // 只提醒一次
                if ( current_timestamp - task_timestamp >= 1 ) {
                    updata_task(i, { comfired : true });
                    show_msg(item.content);
                }
            }
        }, 300);
    }

    // 显示提醒信息
    function show_msg(msg) {
        if ( !msg ) 
            return;
        $msg.show();
        $msg_content.html(msg);
        $alerter.get(0).play();
    }


    // 隐藏提醒信息
    function hide_msg() {
        $msg.hide();
    }

    // 弹出层
    function pop(arg) {
        if ( !arg )
            console.error('pop title is required.');

        

        var conf = {}
          , $box
          , $mask
          , $pop_title
          , $pop_content
          , $confirm 
          , $cancel
          , $pop_button
          , dfd
          , confirmed
          , timer
          ;

        if ( typeof arg == 'string') {
            conf.title = arg;
        } else {
            conf = $.extend(conf, arg);
        }

        dfd = $.Deferred();

        // 弹出层
        $box = $('\
            <div>\
                <div class="pop-title">'+ conf.title+'</div>\
                <div class="pop-content">'+ (conf.content || '') +'</div>\
                <div class="pop-button">\
                    <button class="primary confirm">确定</button>\
                    <button class="cancel">取消</button>\
                </div>\
            </div>')
            .css({
                // width : 300,
                'min-width' : 300,
                height : 'auto',
                background : '#fff',
                position : 'fixed',
                padding : '15px',
                left : 0,
                top : 0,
                'border-radius' : 3,
                'box-shadow' : '0 1px 2px rgba(0,0,0,.5)'
            });


        // 遮罩
        $mask = $('<div></div>')
            .css({
                background : 'rgba(0,0,0,.5)',
                position : 'fixed',
                top : 0,
                left : 0,
                right : 0,
                bottom : 0
            });

        $mask.appendTo($body);
        $box.appendTo($body);

        $pop_title = $('.pop-title');
        $pop_content = $('.pop-content');
        $confirm = $('.confirm');
        $cancel = $('.cancel');
        $pop_button = $('.pop-button');
        
        $confirm.css({
            'margin-right' : 16
        });

        $pop_title.css({
            'text-align' : 'center',
            'font-size' : 20,
            'color' : '#444',
            'font-weigth' : 'bold',
            'padding' : '15px 0'
        });

        $pop_content.css({
            'text-align' : 'center',
            'color' : '#444',
            'padding' : '5px 0',
        });

        $pop_button.css({
            'text-align' : 'center',
        });

        timer = setInterval(function(){
            if ( confirmed !== undefined ) {
                dfd.resolve(confirmed);
                dismiss_pop();
                clearInterval(timer);
            }
        },50);

        $confirm.on('click', on_confirm);
        $cancel.on('click', on_cancle);
        $mask.on('click', on_cancle);

        function on_confirm() {
            confirmed = true;
        } 

        function on_cancle() {
            confirmed = false;
        }

        function dismiss_pop() {
            $mask.remove();
            $box.remove();
        }

        function adjust_box_position() {
            var $window_width = $window.width()
              // , $window_height = $window.height()
              , $move_x
              , $move_y
              ;

            $move_x = ($window_width - $box.width())/2;
            // $move_y = ($window_height - $box.height())/2 - 40;

            $box.css({
                left: $move_x,
                top : '25%'
            });

        }

        $window.on('resize', function(){
            adjust_box_position();
        });

        $window.resize();
        return dfd.promise();

    }

    function init() {
        task_list = store.get('task_list') || [];

        if( task_list.length ) {
            render_task_list();
            task_remind_check();         
        }
    }

})();

/*var a = 10;
console.log('window.a',window.a)*/