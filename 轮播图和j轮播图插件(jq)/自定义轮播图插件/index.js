(function ($) {
  /**
     * 存储当前轮播图的数据信息
     * @param {Object} options 
     *      1）轮播的区域：  内容应该为一个数组 数组中的每一项为每次轮播的内容（DOM元素）
                list: [dom, dom]
            2) 尺寸： width, height
            3) 轮播的方式： type:  'animation'(从左到右的轮播) 'fade' (淡入淡出的轮播)
            4）是否自动轮播： autoChange: true （自动轮播） false （不自动轮播）
            5）自动轮播时间： autoTime
            6) 是否展示小圆点: showSpotBtn : true （展示） false（不展示
            7）是否展示左右按钮：  showChangeBtn: 'always', 'hover', 'hidden'
            8) 小圆点的位置： spotPosition： 'left'， 'right', 'center'
            9) 当前图片对应小圆点的颜色： spotColor
            */
  function Swiper(options, wrap) {
    this.list = options.list || [];
    this.width = options.width || $(wrap).width();
    this.height = options.height || $(wrap).height();
    this.type = options.type || "fade";
    this.autoChange =
      typeof options.autoChange === "undefined" ? true : options.autoChange;
    this.autoTime = options.autoTime || 5000;
    this.showSpotBtn =
      typeof options.showSpotBtn === "undefined" ? true : options.showSpotBtn;
    this.showChangeBtn = options.showChangeBtn || "always";
    this.spotPosition = options.spotPosition || "left";
    this.num = this.list.length;
    this.wrap = wrap;
    this.spotColor = options.spotColor || "red";
    // 当前显示的区域的索引值
    this.nowIndex = 0;
    this.timer = null;
    // 判断当前是否有动画在执行  为true代表没有动画执行
    this.flag = true;
  }
  // 初始化结构与行为
  Swiper.prototype.init = function () {
    this.createDom();
    this.initStyle();
    this.bindEvent();
    if (this.autoChange) {
      this.autoChangeFn();
    }
  };
  // 创建html结构
  Swiper.prototype.createDom = function () {
    var swiperWrapper = $('<div class="my-swiper"></div>');
    var domList = $('<ul class="my-swiper-list"></ul>');
    var spotsBtn = $('<div class="my-swiper-spots"></div>');
    var len = this.list.length;
    for (var i = 0; i < len; i++) {
      var oLi = $('<li class="my-swiper-item"></li>');
      oLi.append(this.list[i]).appendTo(domList);
      spotsBtn.append($("<span></span>"));
    }
    if (this.type === "animation") {
      domList.append(
        $('<li class="my-swiper-item"></li>').append(
          $(this.list[0]).clone(true)
        )
      );
    }
    var leftBtn = $('<div class="my-swiper-btn my-swiper-lbtn">&lt;</div>');
    var rightBtn = $('<div class="my-swiper-btn my-swiper-rbtn">&gt;</div>');
    swiperWrapper
      .append(domList)
      .append(leftBtn)
      .append(rightBtn)
      .append(spotsBtn)
      .appendTo(this.wrap)
      .addClass("my-swiper-" + this.type);
  };
  // 动态设置样式
  Swiper.prototype.initStyle = function () {
    // $(选择器, 选择器的作用域（即哪个元素下面去找）)
    $(".my-swiper", this.wrap)
      .css({
        width: this.width,
        height: this.height,
      })
      .find(".my-swiper-list")
      .css({
        width:
          this.type === "animation" ? this.width * (this.num + 1) : this.width,
      })
      .find(".my-swiper-item")
      .css({
        width: this.width,
      })
      .end()
      .end()
      .find(".my-swiper-spots")
      .css({
        textAlign: this.spotPosition,
        display: this.showSpotBtn ? "block" : "none",
      })
      .find("span")
      .eq(this.nowIndex)
      .css({
        backgroundColor: this.spotColor,
      });
    if (this.type === "fade") {
      $(".my-swiper > .my-swiper-list > .my-swiper-item", this.wrap)
        .css({
          display: "none",
        })
        .eq(this.nowIndex)
        .css({
          display: "block",
        });
    }
    if (this.showChangeBtn === "always") {
      $(".my-swiper > .my-swiper-btn", this.wrap).css({
        display: "block",
      });
    } else if (this.showChangeBtn === "hidden") {
      $(".my-swiper > .my-swiper-btn", this.wrap).css({
        display: "none",
      });
    } else if (this.showChangeBtn === "hover") {
      $(".my-swiper > .my-swiper-btn", this.wrap).css({
        display: "none",
      });
      var self = this;
      $(".my-swiper", this.wrap).hover(
        function () {
          console.log(self);
          $(".my-swiper > .my-swiper-btn", self.wrap).css({
            display: "block",
          });
        },
        function () {
          $(".my-swiper > .my-swiper-btn", self.wrap).css({
            display: "none",
          });
        }
      );
    }
    // this.wrap.find('.my-swiper')
  };
  // 实现动效行为
  Swiper.prototype.bindEvent = function () {
    var self = this;
    $(".my-swiper > .my-swiper-lbtn", this.wrap).click(function () {
      //  判断的当前是否有动画正在执行如果有动画在执行那么不进行下面的动画如果没有则继续执行动画
      if (self.flag) {
        self.flag = false;
      } else {
        return false;
      }
      if (self.nowIndex === 0) {
        if (self.type === "animation") {
          $(".my-swiper-list", self.wrap).css({
            left: -self.num * self.width,
          });
        }
        self.nowIndex = self.num - 1;
      } else {
        self.nowIndex--;
      }
      self.changePage();
    });
    $(".my-swiper > .my-swiper-rbtn", this.wrap).click(function () {
      //  判断的当前是否有动画正在执行如果有动画在执行那么不进行下面的动画如果没有则继续执行动画
      if (self.flag) {
        self.flag = false;
      } else {
        return false;
      }
    //   当前如果是从左到右的轮播   内容需要轮播到后面的第一张图片的位置，在进行回滚到第一张图片，继续轮播
      if (self.type === "animation") {
        if (self.nowIndex === self.num) {
          $(".my-swiper-list", self.wrap).css({
            left: 0,
          });
          self.nowIndex = 1;
        } else {
          self.nowIndex++;
        }
        // 淡入淡出效果则只需要判断是不是最后一张图片  如果是的话下一张图片应该是第一张
      } else {
        if (self.nowIndex === self.num - 1) {
          self.nowIndex = 0;
        } else {
          self.nowIndex++;
        }
      }

      self.changePage();
    });
    $(".my-swiper-spots > span", this.wrap).mouseenter(function () {
      //  判断的当前是否有动画正在执行如果有动画在执行那么不进行下面的动画如果没有则继续执行动画
      if (self.flag) {
        self.flag = false;
      } else {
        return false;
      }
    //   当前小圆点对应的索引值
      var index = $(this).index();
      self.nowIndex = index;
      self.changePage();
    });
    // 如果鼠标移入当前轮播图区域 则让自动轮播停止  移出继续
    $(".my-swiper", this.wrap)
      .mouseenter(function () {
        clearInterval(self.timer);
      })
      .mouseleave(function () {
        if (self.autoChange) {
          self.autoChangeFn();
        }
      });
  };
  // 实现轮播的效果
  Swiper.prototype.changePage = function () {
    var self = this;
    // 从左到右的动效
    if (this.type === "animation") {
        // 修改位置 动画结束之后把锁打开允许下一次动画继续
      $(".my-swiper-list", this.wrap).animate(
        {
          left: -this.nowIndex * this.width,
        },
        function () {
          self.flag = true;
        }
      );
    //   淡入淡出的到动效
    } else {
      $(".my-swiper-list > .my-swiper-item", this.wrap)
        .fadeOut()
        .eq(this.nowIndex)
        .fadeIn(function () {
          self.flag = true;
        });
    }
    // 切换小圆点的样式
    $(".my-swiper-spots > span", this.wrap)
      .css({
        backgroundColor: "#fff",
      })
      .eq(this.nowIndex % this.num)
      .css({
        backgroundColor: this.spotColor,
      });
  };
  // 自动轮播效果
  Swiper.prototype.autoChangeFn = function () {
    var self = this;
    clearInterval(this.timer);
    this.timer = setInterval(function () {
      $(".my-swiper > .my-swiper-rbtn", self.wrap).trigger("click");
    }, this.autoTime);
  };

  $.fn.extend({
    swiper: function (options) {
      var obj = new Swiper(options, this);
      obj.init();
    },
  });
})($ || jQuery);
