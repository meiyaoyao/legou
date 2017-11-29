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