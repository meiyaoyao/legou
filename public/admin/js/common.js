//进度条功能
//禁用进度环
NProgress.configure({ showSpinner: false });

//注册一个全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
});

$(document).ajaxStop(function () {
    //完成进度条
    setTimeout(function () {
        NProgress.done();
    }, 500);
});


// 二级菜单隐藏显示功能
$(".child").prev().on("click",function(){
$(this).next().slideToggle();
});
// 侧边栏显示隐藏功能
$(".icon_menu").on("click",function(){
    $(".lt-aside").toggleClass("now");
    $(".lt-main").toggleClass("now");
    $(".topbar").toggleClass("now");
});
//退出功能
$(".icon_logout").on("click",function(){
    $("#logoutmodal").modal("show");
    $(".btn_logout").off().on("click",function(){
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            success:function(data){
                if (data.success) {
                    //退出成功
                    location.href = "login.html";
                }
            }
        });
    });
});