/**
 * utils
 * User: xlzhou2@iflytek.com
 * Date: 14-2-21
 * Time: 下午3:43
 */


/**
 * 利用占位符格式化字符串
 * 例如："你好，{0}, {1}".format('aa', 'Nice to meet you!') = "你好，aa Nice to meet you!";
 */
String.prototype.format = function () {
    var s = this, i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


/**
 * 截获URL参数
 * @type {{QueryString: Function}}
 */
var Request = {
    //获取URL参数
    QueryString: function (item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    },

    /**
     * url 目标url
     * arg 需要替换的参数名称
     * arg_val 替换后的参数的值
     * return url 参数替换后的url
     */
    changeURLArg: function (url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {//如果没有此参数，添加
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {//如果有此参数，修改
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    },

    /**
     *
     * @param url 目标url
     * @param params 参数对象，可是是多个
     *                 格式如：[{arg:01,arg_val:11},{arg:00,arg_val:12}]
     */
    changeURLArgs:function(url,params){
        var lastPattern ="";
        for(var item in params){
            var pattern = params[item].arg + '=([^&]*)';
            var replaceText = params[item].arg + '=' + params[item].arg_val;
            if (url.match(pattern)) {//如果没有此参数，添加
                var tmp = '/(' + params[item].arg + '=)([^&]*)/gi';
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {//如果有此参数，修改
                if (url.match('[\?]')) {
                    return url + '&' + replaceText;
                } else {
                    return url + '?' + replaceText;
                }
            }
        }
    },

    /**
     * 去除指定的url参数
     * @param url
     * @param param
     * @returns {*}
     */
    cutURLParam: function (url, param) {
        var url1 = url;
        if (url.indexOf(param) > 0) {
            if (url.indexOf("&", url.indexOf(param) + param.length) > 0) {
                url1 = url.substring(0, url.indexOf(param)) + url.substring(url.indexOf("&", url.indexOf(param) + param.length) + 1);
            }
            else {
                url1 = url.substring(0, url.indexOf(param) - 1);
            }
            return url1;
        }
        else {
            return url1;
        }
    }


}

/**
 * 截取含有汉字的字符串
 *
 * @param str
 *            ：字符串 len ：截取长度 hasDot：是否需要添加省略号（true或false）
 * @author hlwang3
 */
function interceptString(str, len, hasDot) {
    if (str == "" || str == undefined) {
        return "";
    }
    var newLength = 0, newStr = "",
        chineseRegex = /[^\x00-\xff]/g, singleChar = "",
        strLength = str.replace(chineseRegex, "**").length;

    if (strLength <= len) {
        return str;
    }
    if (hasDot) {
        len = len - 2;
    }
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }
    if (hasDot) {
        newStr += "...";
    }
    return newStr;
}
var CommonDialog = {
    /**
     * 异步加载页面
     * @param title
     * @param url
     * @param callback
     * @param options
     */
    load:function(title,url,callback,options){
        options = options || {};
        var d = art.dialog({
            title: title,
            content: "",
            backdropBackground: "gray",
            backdropOpacity: 0.3,
            width: options.width || 990,
            height: options.height || 577,
            lock: true,
            resize: false,
            drag:true
        });
        $(d.DOM.content[0]).load(url,callback);
    },
    /**
     * artDialog 锁屏
     */
    lock: function () {
        var content = '数据获取中，请稍后...';
        if (arguments[0] == "commit") {
            content = '数据提交中，请稍后...';
        } else if (arguments[0] == "check") {
            content = '数据检测中，请稍后...';
        }
        var d = art.dialog({
            lock: true,
            background: 'black', // 背景色
            opacity: 0.3,	// 透明度
            content: content,
            fixed:true,
            cancel: false
        });
        return d;
        //d.showModal();
    },

    /**
     * artDialog 关闭（全部关闭）
     */
    close: function () {
        var list = art.dialog.list;
        for (var i in list) {
            list[i].close();
        }
    },

    /**
     * 暂停练习
     * @param title
     * @param content
     * @param okCallback
     */
    stop: function (title, content, okCallback) {
        var d = art.dialog({
            title: title,
            content: "<p style='font-size: 16px;'>"+content+"</p>",
            backdropBackground: "white",
            backdropOpacity: 1,
            ok: function () {
                if (typeof  okCallback === "function") {
                    var res = okCallback();
                    if (res == false) {
                        return false;
                    }
                }
            },
            cancel:false,
            okValue: '确定',
            width: 300,
            height:150,
            drag:true,
            esc:false,
            resize: false,
            fixed:true,
            lock: true
        });
        //d.showModal();
    },



    /**
     * 页面提示消息
     * @param content
     * @param time
     */
    tips:function(content,time){
//        var d = art.dialog({
//            background: 'black', // 背景色
//            content: content,
//            cancel: false,
//            title:false,
//            fixed:true
//        });
//        d.time(time || 1);
        var tips = $("<div style='position: fixed;padding-left: 10px;padding-right: 10px;left: 50%;top: 50%;height: 50px;background: white;border: 1px solid rgb(148, 148, 148);min-width: 100px;text-align: center;line-height: 50px;z-index: 9000;'></div>");
        $("body").append(tips);
        tips.text(content);
        tips.css({"margin-left":"-"+tips.width()/2+"px"});
        //console.log(tips.width());
        setTimeout(function(){
            tips.remove();
        },time*1000 || 1000);
    }
};

/**
 * 弹框一直居中显示，能响应滚动和窗口大小变化
 * @param obj
 */
function commShowAtCenter(obj) {
    // obj为jQuery对象
    var divWidth = obj.width() / 2;
    var divHeight = obj.height() / 2;
    obj.css({
        'position' : 'fixed',
        'top' : '50%',left:'50%',
        'margin-top' : '-' + divHeight + 'px',
        'margin-left': '-' + divWidth + 'px'
    });
}

function removeItem(data){
    var _data = [];
    for(var i = 1;i<data.length;i++){
        _data.push(data[i]);
    }
    return _data;
}
/**
 * 统计用户行为
 * @param options
 */
function setUserAction(options){
    try{
        $.ajax({
            url:basePath+"/stat/useraction",
            type:"POST",
            data:options,
            dataType:"text",
            cache:false,
            success:function(){},
            error:function(){}
        });
    }catch(e){
    }
};
/**
 * 首页tab点击行为日志收集
 * @param obj
 */
function collectBtnInfo(obj){
    var data = $(obj).attr("data");
    var options ={
        "app": "tlsysapp",
        "action": "indexTabBtn",
        "data": data+"?from=indexPage"
    };
    if(data != null && data != "") {
        setUserAction(options);
    }
}