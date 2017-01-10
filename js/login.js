/**
 * Created with JetBrains WebStorm.
 * User: zzwang
 * Date: 14-3-10
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */
(function(window,jQuery){
    var Transcripts = Transcripts || {};
    var elements = elements || {};
    var _loginFailTime = 0;
    var _errorMessage = decodeURI(Request.QueryString("errorMessage"));
    var _webcontainerUrl = "";
    var _loginChangyanUrl = "";


    Transcripts.bindData = function () {
        function bindBaseData() {
            $.ajax("./getLoginFailTime/", {
                type: "POST",
                data: {},
                dataType: "json",
                success: function (data) {
                    if (data.result = "success") {
                        _loginFailTime = data.message;
                    }
                    getLoginFailTimeCB();
                },
                error: function (request, textStatus, errorThrown) {
                    getLoginFailTimeCB();
                }
            });

            $.ajax("./login/getModuleUrl/", {
                type: "GET",
                data: {},
                dataType: "json",
                cache: true,
                success: function (data) {
                    if (data.result = "success") {
                        _webcontainerUrl = data.webcontainerUrl;
                        _loginChangyanUrl = data.loginChangyanUrl;
                        getModuleUrlCB();
                        loadBannerCB();
                    } else {
                        setBanner();
                    }
                },
                error: function (request, textStatus, errorThrown) {
                    setBanner();
                }
            });

            function getModuleUrlCB(){
            }

            function loadBannerCB() {
            }
        }

        function bindDomainInfo() {
            var _url = window.location.href;
        }


        function postOpenUrl(url, args) {
            var _form = $("<form></form>", {
                "id": "tempForm",
                "method": "post",
                "action": url,
                "style": "display:none"
            }).appendTo($("body"));
            for (var i in args) {
                _form.append($("<input>", {"type": "hidden", "name": i, "value": args[i]}));
            }
            _form.trigger("submit");
        }

        function setBanner(){
            var IntervalName;
            var imgList=elements.imgPlay.find(".imgList li");
            var bannerIndex=0;
            var bannerCount=imgList.length;
            for(var i=0;i<bannerCount;i++){
                if(i==0){
                    $(imgList[i]).show();
                }else{
                    $(imgList[i]).hide();
                }
            }
            if(bannerCount>1){
                var html="";
                for(var i=0;i<bannerCount;i++){
                    if(i==0){
                        html+='<dd><a tag='+i+' class="active" href="javascript:void(0);"></a></dd>';
                    }else{
                        html+='<dd><a tag='+i+' href="javascript:void(0);"></a></dd>';
                    }
                }
                elements.imgPlay.find(".btnList").html(html);
                var btnList=elements.imgPlay.find(".btnList a");
                bindBannerTime();
                btnList.click(function(){
                    var _this=$(this);
                    clearInterval(IntervalName);
                    bindBannerTime();
                    if(_this.hasClass("active")){
                        return;
                    }
                    bannerIndex=_this.attr("tag");
                    switchBanner(bannerIndex);
                });
            }
            function bindBannerTime(){
                IntervalName = setInterval(function(){
                    bannerIndex++;
                    if(bannerIndex>=bannerCount){
                        bannerIndex=0;
                    }
                    switchBanner(bannerIndex);
                },3000);
            }

            function switchBanner(index){
                imgList.fadeOut();
                $(imgList[index]).fadeIn();
                btnList.removeClass("active");
                $(btnList[index]).addClass("active");
            }
        }

        Transcripts.bindData.login = function(txtUserName, txtPassword, txtImageCode) {
            elements.signup_button.html("正在登录...").css("cursor", "default");
            var params = {
                loginName: txtUserName,
                password: txtPassword,
                code: txtImageCode
            };
            var userId;
        }

        Transcripts.bindData.nameLogin = function (txtUserName, txtPassword, txtName) {
            elements.signup_button.html("正在登录...").css("cursor", "default");
            var params = {
                loginName: txtUserName,
                password: txtPassword,
                name: txtName
            };
            var userId;

        }
        bindBaseData();
        bindDomainInfo();
    };

    Transcripts.bindBaseEvent = function () {
        elements.container_login.fullpage({
            verticalCentered: false,
            anchors: ['p1', 'p2', 'p3', 'p4', 'p5'],
            navigation: true,
            afterLoad: function(anchorLink,index){
                switch (index){
                    case 1:
                        elements.btnBackTop.slideUp();
                        break;
                    case 2:
                    case 3:
                    case 4:
                        elements.btnBackTop.slideDown();
                        break;
                    case 5:
                        elements.btnBackTop.slideDown();
                        var options ={
                            "app": "tlsysapp",
                            "action": "indexScrollScreen",
                            "data": "/index/home/#p5"
                        };
                        setUserAction(options);
                        break;
                    default :
                        break;
                }
            }
        });

        //回到顶部
        elements.btnBackTop.click(function (e) {
            $.fn.fullpage.moveTo(1);
        });

        elements.imgPlay.height(document.documentElement.clientHeight - 80);
        $(window).resize(function() {
            elements.imgPlay.height(document.documentElement.clientHeight - 80);
        });

        elements.signup_button.click(function () {
            if (elements.signup_button.html() == "正在登录...") {
                return;
            }
            var userName = $.trim(elements.txtUserName.val());
            var userPassword = elements.txtPassword.val();
            var txtImageCode = elements.txtImageCode.val();
            if (!userName) {
                elements.errorMsg.html("*用户名不能为空");
                return;
            }
            if (!userPassword) {
                elements.errorMsg.html("*密码不能为空");
                return;
            }
            if (!txtImageCode && $.cookie("loginError") == "userLogin") {
                elements.errorMsg.html("*验证码不能为空");
                return;
            }
            $.cookie("loginUserName", userName, { expires: 7, path: "/"});
            if (elements.divName.is(":hidden") === true) {
                elements.errorMsg.html("");
                Transcripts.bindData.login(userName, userPassword, txtImageCode);
            } else {
                var name = $.trim(elements.txtName.val());
                if (!name) {
                    elements.errorMsg.html("*真实姓名不能为空");
                    return;
                }
                elements.errorMsg.html("");
                Transcripts.bindData.nameLogin(userName, userPassword, name);
            }
        });


        //侧边SHOW绑定
        elements.rightBtn.find(".aEm").hover(function() {
            $(this).find(".showEm").fadeIn();
        }, function() {
            $(this).find(".showEm").hide();
        });
    };

    $(function () {
        elements.imgPlay = $("#imgPlay");
        elements.head_imgList = $("#head_imgList");
        elements.headLogo = $("#head_logo");
        elements.head_select = $("#head_select");
        elements.foot_copyright = $("#foot_copyright");
        elements.errorMsg = $("#errorMsg");
        elements.divLogin = $("#divLogin");
        elements.txtUserName = $("#txtUserName");
        elements.txtPassword = $("#txtPassword");
        elements.panelImageCode = $("#panelImageCode");
        elements.txtImageCode = $("#txtImageCode");
        elements.imageCode = $("#imageCode");
        elements.forget_password = $("#forget_password");
        elements.divName = $("#divName");
        elements.txtName = $("#txtName");
        elements.signup_button = $("#signup_button");
        elements.rightBtn = $("#rightBtn");
        elements.btnBackTop = $("#btnBackTop");
        elements.regUser = $("#regUser");
        elements.schoolList = $("#schoolList");
        elements.container_login = $("#container_login");
        elements.chanyanLogin = $("#chanyanLogin");

        Transcripts.bindData();
        Transcripts.bindBaseEvent();
    });
})(window,jQuery);