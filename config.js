var visoConfig = {
    visoTemplate: {}
  }
  
  visoConfig.visoTemplate.playAudioNode = '<div class="pa" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><a class="btn btn-success" href="#" role="button">放音</a></div>'
  
  visoConfig.startUi = '<div class="create-item" id="{{id}}" data-type="start" style="top:{{top}}px;left:{{left}}px"><div class="create-content create-btn-content">开始</div></div>';
  visoConfig.flowUi = '<div class="create-item" id="{{id}}" data-type="flow" style="top:{{top}}px;left:{{left}}px"><div class="create-content create-flow-content">流程</div></div>';
  visoConfig.judgeUi = '<div class="create-item create-judge-item" data-type="judge" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><div class="create-judge-content"><div class="rotateZ-text">判断</div></div></div>';
  visoConfig.endUi = '<div class="create-item" id="{{id}}" data-type="end" style="top:{{top}}px;left:{{left}}px"><div class="create-content create-btn-content">结束</div></div>';
  visoConfig.tagUi = '<div class="create-tag-item" id="{{id}}" data-type="end" style="top:{{top}}px;left:{{left}}px"><div class="create-content create-tag-content"><span>标签</span></div></div>';
  // 基本连接线样式
  visoConfig.connectorPaintStyle = {
    lineWidth: 2,
    strokeStyle: '#61B7CF',
    joinstyle: 'round',
    stroke: '#61B7CF',
    outlineColor: '',
    outlineWidth: ''
  }
  
  // 鼠标悬浮在连接线上的样式
  visoConfig.connectorHoverStyle = {
    lineWidth: 2,
    strokeStyle: 'red',
    stroke: '#d9544f',
    outlineWidth: 10,
    outlineColor: ''
  }
  
  visoConfig.baseStyle = {
    endpoint: ['Dot', {
      radius: 8,
      fill: 'pink'
    }], // 端点的形状
    connectorStyle: visoConfig.connectorPaintStyle, // 连接线的颜色，大小样式
    connectorHoverStyle: visoConfig.connectorHoverStyle,
    paintStyle: {
      strokeStyle: '#61B7CF',
      stroke: '#61B7CF',
      fill: '#61B7CF',
      radius: 6,
      lineWidth: 2
    }, // 端点的颜色样式
    // hoverPaintStyle: {
    //   outlineStroke: 'pink'
    // },
    hoverPaintStyle: { stroke: '#d9544f' },
    isSource: true, // 是否可以拖动（作为连线起点）
    connector: ['Flowchart', { gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true, // 是否可以放置（连线终点）
    maxConnections: -1, // 设置连接点最多可以连接几条线
    // 设置线上面的箭头
    connectorOverlays: [
      ['Arrow', {
        width: 10,
        length: 10,
        location: 1
      }],
      ['Arrow', {
        width: 10,
        length: 10,
        location: 0.2
      }],
      ['Arrow', {
        width: 10,
        length: 10,
        location: 0.7
      }],
      ['Label', {
        label: '',
        cssClass: '',
        labelStyle: {
          color: 'red'
        },
        events: {
          click: function (labelOverlay, originalEvent) {
            console.log('click on label overlay for :' + labelOverlay.component)
            console.log(labelOverlay)
            console.log(originalEvent)
          }
        }
      }]
    ]
  }
  
  visoConfig.baseArchors = ['RightMiddle', 'LeftMiddle']
  