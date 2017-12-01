$(function(){

// 进入页面发送ajax请求渲染用户部分表格



// 当前显示页码
  var currentPage = 1;
// 每页显示信息数量
  var pageSize = 5;

render();
  function render(){
    $.ajax({
    type:"get",
    url:"/user/queryUser",
    data:{
      page: currentPage,
      pageSize: pageSize
    },
    success:function(info){
      console.log(info);
      $("tbody").html(template("tpl", info));

      // 渲染分页
      $("#paginator").bootstrapPaginator({
        // 当前bootstrap版本
        bootstrapMajorVersion: 3,
        // 当前显示第几页
        currentPage: currentPage,
        // 一共多少页
        totalPages: Math.ceil(info.total / pageSize),
        // 页码的点击事件
        onPageClicked: function (a, b, c, page) {
          currentPage = page;
          render();
        }
      })
    }
  });
  }
  



  // 用户状态的启用禁用功能
  $("tbody").on("click",".btn",function(){
    //显示模态框
    $("#usermodal").modal("show");
    //获取到对应的id
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    // 给确定按钮注册点击事件
    $(".btn_confirm").on("click",function(){
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete: isDelete
        },
        success:function(info){
          if (info.success) {
            //关闭模态框
            $("#usermodal").modal("hide");

            //重新渲染表格
            render();
          }
        }
      })
    })
  })

});