$(function () {

  var page = 1;
  var pageSize = 5;
  var imgs = [];
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        $("tbody").html(template("tpl", info));
        // 分页操作
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //设定版本
          currentPage: page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          itemText: function (type, page, current) {

            //type: 如果是具体的页码，类型是page
            //如果是首页，type：first
            //上一页：type:prev
            //下一页:type:next
            //尾页：last
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            //type: 如果是具体的页码，类型是page
            //如果是首页，type：first
            //上一页：type:prev
            //下一页:type:next
            //尾页：last
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return "跳转到第" + page + "页";
            }

          },
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }



    });
  }

  // 给添加按钮注册点击事件，显示模态框
  $(".btn_add").on("click", function () {
    $("#promodal").modal("show");
    // 发送ajax查询二级分类，渲染下拉框
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });

  $(".dropdown-menu").on("click", "a", function () {

    // 修改按钮内容
    $(".dropdown-text").text($(this).text());

    // 修改隐藏域的值
    $("[name='brandId']").val($(this).data("id"));
    // 选择了品牌手动让验证成功
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");

  });
  // 表单校验功能
  var $form = $("form");
  console.log($form);
  $form.bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择品牌"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            meaasge: "请输入一个不是0开头的库存"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码"
          },
          //正则校验
          regexp: {
            //不能是0开头，必须是数字
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入合法的尺码,例如(32-46)"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入价格"
          }
        }
      },
      productLogo: {
        validators: {
          notEmpty: {
            message: "请输入三张图片"
          }
        }
      }
    }


  });

  // 图片上传
  $("#fileupload").fileupload({
    dataType: "json",
    done: function (e, data) {
      if (imgs.length >= 3) {
        return false;
      }
      // 上传一张图片，就在inmg_box中动态生成一个img来显示这张图片
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">')
      // 把图片上传成功的结果存到imgs中
      imgs.push(data.result);
      // 如果imgs的长度等于3手动让brandLogo校验成功
      if (imgs.length === 3) {
        $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
      } else {
        $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
      }
      // 如果不是3就让它失败
      console.log(imgs);
    }
  });










  $form.on("success.form.bv", function (e) {
    e.preventDefault();

    var param=$form.serialize();

    param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:param,
      success:function(info){
        if(info.success){
          //1. 关闭模态框
          $("#promodal").modal("hide");
          //2. 渲染第一页
          currentPage = 1;
          render();

          //3. 重置表单的内容和样式
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //下拉菜单重置
          $(".dropdown-text").text("请选择二级分类");
          $("[name='brandId']").val('');

          //重置图片
          $(".img_box img").remove();
          imgs = [];
        }
      }
    });

  });



});