$(function () {
  var currentPage = 1;
  var pageSize = 5;


  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // 渲染页面
        $("tbody").html(template("tpl", info));
        // 渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, s, d, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }


  // 添加二级分类
  $(".btn_add").on("click",function(){
    $("#addlogoModal").modal("show");

    // 发送ajax请求获取一级分类数据，渲染下拉框
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data: {
          page: 1,
          pageSize: 100//希望获取所有
        },
        success:function(info){
          $(".dropdown-menu").html(template("tpl2",info));
        }


    })


  });




  // 给下拉框中所有的a注册事件

  $(".dropdown-menu").on("click","a",function(){

    // 设置按钮内容
    $(".dropdown-text").text($(this).text());

    //获取到当前a的id值，设置给categoryId
    $("[name='categoryId']").val($(this).data("id"));
    //3. 让categoryId校验变成成功
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  // 
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){

      //设置给img_box中img的src属性
      $(".img_box img").attr("src", data.result.picAddr);
      //把图片的地址赋值给brandLogo
      $("[name='brandLogo']").val(data.result.picAddr);
      //把brandLogo改成成功
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });


  //表单校验功能
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [],//不校验的内容
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传品牌图片"
          }
        }
      }
    }
  });

  //给表单注册校验成功事件
  $form.on("success.form.bv",function(e){
    e.preventDefault();
    

    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      success:function(info){
        if(info.success){
          $("#addlogoModal").modal("hide");

          currentPage=1;
          render();

          // 重置内容和样式

          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //4. 重置下拉框组件和图片
          $(".dropdown-text").text("请选择一级分类");
          $("[name='categoryId']").val('');
          $(".img_box img").attr("src", "images/none.png");
          $("[name='brandLogo']").val('');
          
        }
      }
    });
  });





























});