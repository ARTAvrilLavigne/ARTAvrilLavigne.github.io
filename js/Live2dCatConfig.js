    L2Dwidget.init({
        "model":{
                        "scale":1,
			"hHeadPos":0.5,
			"vHeadPos":0.618,
                        "jsonPath":"https://artavrillavigne.github.io/live2dw/assets/hijiki.model.json"  // 加载模型的json路径
        },
        "display":{
                        "superSample":2,       // 超采样等级
			"width":200,           // canvas的宽度
			"height":420,          // canvas的高度
			"position":"right",    // 界面显示位置：左或右
			"hOffset":-10,         // canvas水平偏移
			"vOffset":-90          // canvas垂直偏移
        },
        "mobile":{
                        "show":false,          // 是否在移动设备上显示
			"scale":0.5            // 移动设备上的缩放
        },
        "react":{
                        "opacityDefault":0.7,  // 默认透明度
			"opacityOnHover":0.2   // 鼠标移上透明度
        }
    });
