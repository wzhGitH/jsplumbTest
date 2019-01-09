(function(){
    var areaId = "#diag";
    // 右键选择的流程id
    var rightItemId = "";
    /* global jsPlumb */
    jsPlumb.ready(main)
    // 拖拽生成环节块
    function renderHtml(template, position){
        position.id = uuid.v1();
        position.left = position.left - $('#side-btn').outerWidth();
        position.left = position.left < 0 ? 0 : position.left;
        position.top = position.top < 0 ? 0 : position.top;
        var html = "";
        if(template == "startUi"){
            // 根据左边块设置的padding、margin 计算left、top
            position.top += 40;
            html = render(visoConfig.startUi, position);
        }else if(template == "flowUi"){
            // 根据左边块设置的padding、margin 计算left、top
            position.top += 40;
            html = render(visoConfig.flowUi, position);
        }else if(template == "judgeUi"){
            // 根据左边块设置的padding、margin 计算left、top
            position.top -= 55;
            position.left -= 15;
            html = render(visoConfig.judgeUi, position);
        }else if(template == "endUi"){
            // 根据左边块设置的padding、margin 计算left、top
            position.top += 80;
            html = render(visoConfig.endUi, position);
        }else if(template == "tagUi"){
            // 根据左边块设置的padding、margin 计算left、top
            position.top += 40;
            html = render(visoConfig.tagUi, position);
        }
        $(areaId).append(html);
        initSetNode(template, position.id);
    }
    // 初始化
    function main(){
        // 设置宽高
        document.getElementById("diag").style.height = document.documentElement.clientHeight + "px";
        document.getElementById("side-btn").style.height = document.documentElement.clientHeight + "px";

        $('.side-item').draggable({
            helper: 'clone',
            scope: 'ss'
        })

        $(areaId).droppable({
            scope: 'ss',
            drop: function (event, ui) {
                renderHtml(ui.draggable[0].dataset.type, ui.position)
            }
        })
        // 双击线
        jsPlumb.bind("dblclick", function(e, originalEvent){
            console.log(e);
            console.log(originalEvent);
        })
        // 链接线
        jsPlumb.bind("beforeDrop", function(e){
            return connectionBeforeDropCheck(e);
        })
        // 鼠标右击
        window.oncontextmenu = function(e){
            e.preventDefault();
            dialogRightMenu(e);
        }
        // 获取假数据(可封装成方法)
        $.ajax({
            type: "GET",
            url: "./data.json",
            dataType: "json",
            success: function(data){
                initHtml(data);
            }
        });
    }
    // 数据初始化
    function initHtml(data){
        var dataList = data.dataList;
        var lineList = data.lineList;
        dataList.forEach(function(elt){
            var template = elt.type + "Ui";
            var position = {
                id: elt.id,
                top: elt.top,
                left: elt.left
            }
            var html = "";
            if(template == "startUi"){
                html = render(visoConfig.startUi, position);
            }else if(template == "flowUi"){
                html = render(visoConfig.flowUi, position);
            }else if(template == "judgeUi"){
                html = render(visoConfig.judgeUi, position);
            }else if(template == "endUi"){
                html = render(visoConfig.endUi, position);
            }else if(template == "tagUi"){
                html = render(visoConfig.tagUi, position);
            }
            $(areaId).append(html);
            initSetNode(template, position.id);
        })
        lineList.forEach(function(elt){
            createLine(elt);
        })
    }
    // 执行右键事件
    function dialogRightMenu(e){
        console.log(e)
        try{
            if(e.target.tagName == "circle" || e.target.tagName == "svg") return;
            // 获取环节块的类型
            var type = e.target.offsetParent.dataset.type || e.target.offsetParent.offsetParent.dataset.type || null;
            if(type == "start" || type == "flow" || type == "judge" || type == "end"){
                rightItemId = e.target.offsetParent.id || e.target.offsetParent.offsetParent.id;
                var clientX = e.clientX;
                var clientY = e.clientY;
                $(".dialog-right-menu").css({
                    display: "block",
                    left: clientX + "px",
                    top: clientY + "px"
                })
            }
        }catch(e){}
    }
    // 删除元素
    $(".remove-elem").on("click", function(){
        emptyNode(rightItemId);
        $(".dialog-right-menu").css({
            display: "none"
        })
    })
    // 标签双击了
    $("#diag").on("dblclick", ".create-tag-item", function(e){
        console.log(e)
        console.log("双击了")
    })
    // 缩小按钮(测试用)
    $(".minus").on("click", function(){
        $(".create-item .create-content").css({
            padding: "10px 15px",
            "min-width": "120px"
        })
        jsPlumb.repaintEverything();
    })
    // 环节元素双击了
    $("#diag").on("dblclick", ".create-item", function(e){
        console.log("双击了环节元素")
    })
    // 点击其他地方隐藏弹出菜单栏
    $(document).on('click', function (e) {
        var target = $(e.target); 
        if(target.closest('.dialog-right-menu').length == 0){ 
            $(".dialog-right-menu").css({
                display: "none"
            })
        }
    })
    
    // 正则替换html里的参数
    function render(tpl, data) {
        var re = /{{([^}]+)?}}/
        var match = ''
  
        while ((match = re.exec(tpl))) {
          tpl = tpl.replace(match[0], data[match[1]])
        }
        return tpl
    }
    // 初始化节点设置
    function initSetNode (template, id) {
        jsPlumb.repaintEverything();
        addDraggable(id);
        if(template == "startUi"){
            setExitPoint(id);
        }else if(template == "flowUi") {
            setEnterPoint(id);
            setExitPoint(id);
        }else if(template == "judgeUi") {
            setEnterPoint(id);
            setExitPoint(id);
            setExitPoint(id, "Bottom");
        }else if(template == "endUi") {
            setEnterPoint(id);
        }
    }
    // 设置入口点
    function setEnterPoint (id) {
        var config = getBaseNodeConfig()

        config.isSource = false
        config.maxConnections = -1
        jsPlumb.addEndpoint(id, {
            anchors: 'Left',
            uuid: id + 'Left' + '-in'
        }, config)
    }
    // 设置出口点
    function setExitPoint (id, position) {
        var config = getBaseNodeConfig()

        config.isTarget = false
        config.maxConnections = 1
        var anchors = position || 'Right';
        jsPlumb.addEndpoint(id, {
            anchors: position || 'Right',
            uuid: id + anchors + '-out'
        }, config)
    }
    // 初始化线
    function createLine(data){
        var config = getBaseNodeConfig()
        jsPlumb.connect({
            uuids: [data.startId + data.startPaint + "-out", data.targetId + data.targetPaint + "-in"]
          },config)
    }
    // 删除一个节点以及
    function emptyNode (id) {
        jsPlumb.remove(id)
    }

    // 让元素可拖动
    function addDraggable (id) {
        jsPlumb.draggable(id, {
            containment: 'parent'
        })
    }
    
    // 获取基本配置
    function getBaseNodeConfig () {
        return Object.assign({}, visoConfig.baseStyle)
    }
    // 链接建立后的检查
    // 当出现自连接的情况后，要将链接断开
    function connectionBeforeDropCheck (info) {
        if (!info.connection.source.dataset.pid) {
        return true
        }
        return info.connection.source.dataset.pid !== info.connection.target.dataset.id
    }
})()