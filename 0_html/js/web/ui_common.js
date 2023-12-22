/*  jQuery Nice Select - v1.0
https://github.com/hernansartorio/jquery-nice-select
Made by Hernán Sartorio  */
!(function (e) {
  e.fn.niceSelect = function (t) {
    function s(t) {
      t.after(
        e("<div></div>")
          .addClass("nice-select")
          .addClass(t.attr("class") || "")
          .addClass(t.attr("disabled") ? "disabled" : "")
          .attr("tabindex", t.attr("disabled") ? null : "0")
          .html('<span class="current"></span><ul class="list"></ul>')
      );
      var s = t.next(),
        n = t.find("option"),
        i = t.find("option:selected");
      s.find(".current").html(i.data("display") || i.text()),
        n.each(function (t) {
          var n = e(this),
            i = n.data("display");
          s.find("ul").append(
            e("<li></li>")
              .attr("data-value", n.val())
              .attr("data-display", i || null)
              .addClass(
                "option" +
                  (n.is(":selected") ? " selected" : "") +
                  (n.is(":disabled") ? " disabled" : "")
              )
              .html(n.text())
          );
        });
    }
    if ("string" == typeof t)
      return (
        "update" == t
          ? this.each(function () {
              var t = e(this),
                n = e(this).next(".nice-select"),
                i = n.hasClass("open");
              n.length && (n.remove(), s(t), i && t.next().trigger("click"));
            })
          : "destroy" == t
          ? (this.each(function () {
              var t = e(this),
                s = e(this).next(".nice-select");
              s.length && (s.remove(), t.css("display", ""));
            }),
            0 == e(".nice-select").length && e(document).off(".nice_select"))
          : console.log('Method "' + t + '" does not exist.'),
        this
      );
    this.hide(),
      this.each(function () {
        var t = e(this);
        t.next().hasClass("nice-select") || s(t);
      }),
      e(document).off(".nice_select"),
      e(document).on("click.nice_select", ".nice-select", function (t) {
        var s = e(this);
        e(".nice-select").not(s).removeClass("open"),
          s.toggleClass("open"),
          s.hasClass("open")
            ? (s.find(".option"),
              s.find(".focus").removeClass("focus"),
              s.find(".selected").addClass("focus"))
            : s.focus();
      }),
      e(document).on("click.nice_select", function (t) {
        0 === e(t.target).closest(".nice-select").length &&
          e(".nice-select").removeClass("open").find(".option");
      }),
      e(document).on(
        "click.nice_select",
        ".nice-select .option:not(.disabled)",
        function (t) {
          var s = e(this),
            n = s.closest(".nice-select");
          n.find(".selected").removeClass("selected"), s.addClass("selected");
          var i = s.data("display") || s.text();
          n.find(".current").text(i),
            n.prev("select").val(s.data("value")).trigger("change");
        }
      ),
      e(document).on("keydown.nice_select", ".nice-select", function (t) {
        var s = e(this),
          n = e(s.find(".focus") || s.find(".list .option.selected"));
        if (32 == t.keyCode || 13 == t.keyCode)
          return (
            s.hasClass("open") ? n.trigger("click") : s.trigger("click"), !1
          );
        if (40 == t.keyCode) {
          if (s.hasClass("open")) {
            var i = n.nextAll(".option:not(.disabled)").first();
            i.length > 0 &&
              (s.find(".focus").removeClass("focus"), i.addClass("focus"));
          } else s.trigger("click");
          return !1;
        }
        if (38 == t.keyCode) {
          if (s.hasClass("open")) {
            var l = n.prevAll(".option:not(.disabled)").first();
            l.length > 0 &&
              (s.find(".focus").removeClass("focus"), l.addClass("focus"));
          } else s.trigger("click");
          return !1;
        }
        if (27 == t.keyCode) s.hasClass("open") && s.trigger("click");
        else if (9 == t.keyCode && s.hasClass("open")) return !1;
      });
    var n = document.createElement("a").style;
    return (
      (n.cssText = "pointer-events:auto"),
      "auto" !== n.pointerEvents && e("html").addClass("no-csspointerevents"),
      this
    );
  };
})(jQuery);
$(function () {
  preLoad();
});

/***********************************************
 * 함수
 ************************************************/
function preLoad() {
  // dropdown,레이어 팝업
  $('[component="dropdownMenu"]').dropdown();
  // tab
  $(".bk-tab").tab({ type: "normal" });
  // accordion-해당 페이지에서 호출
  // 셀렉트박스 라이브러리
  $("select:not(.flatpickr-monthDropdown-months)").niceSelect();
  // 포커스 이벤트 핸들러
  $(".bk-textfield input, .bk-select select, .bk-textarea textarea").focus(
    focusHandler
  );
  // 블러 이벤트 핸들러
  $(".bk-textfield input, .bk-select select, .bk-textarea textarea").blur(
    blurHandler
  );
  // required 속성 변경 감지
  updateRequiredState.call(
    $(".bk-textfield input, .bk-select select, .bk-textarea textarea")
  );
  // readonly 속성 변경 감지
  updateReadonlyState.call(
    $(".bk-textfield input, .bk-select select, .bk-textarea textarea")
  );
  // disabled 속성 변경 감지
  updateDisabledState.call(
    $(".bk-textfield input, .bk-select select, .bk-textarea textarea")
  );
  // input clear버튼
  $(".bk-textfield.has-clear .icon-text-clear").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".bk-textfield").find(".iText").val("");
  });
  // 입력 요소 상태 업데이트
  updateInputState();
  // 라디오 및 체크박스
  updateRadioCheckbox();
  // lnb 존재여부 체크
  addHasLnbClass();
  // input type="file"
  updateFileName();
  // toggle button
  toggleButton();
  // 셀렉트박스 10개 이상
  sizeSelectboxState();
  // 해더
  fixedHeader();
  //bk-list-toolbar(카드/리스트 모드 선택)
  modeChange();
  // treeMenu
  if ($("#lnb").is(":visible")) {
    treeMenu();
  }
  //gnb
  gnbMenu();
  //퀵메뉴 top버튼
  topScroll();
  //로그인 페이지 header,footer 안보이게
  loginUiClass();
  // mainPopup 함수 호출
  mainPopup();
}

$.fn.extend({
  // dropdown,레이어 팝업
  dropdown: function (options) {
    var defaults = {
      type: null,
    };
    var settings = $.extend({}, defaults, options);

    var activeDropdown = null;

    return this.each(function () {
      var $this = $(this);
      var $layer = $this.next(".cp-layer, .bk-dialog");
      var $label = $layer.find("label, .cp-layer");
      var $close = $layer.find('[role="dropdownCloseBtn"]');

      var active = function () {
        if (activeDropdown) {
          activeDropdown.removeClass("is-active");
          activeDropdown.next(".cp-layer, .bk-dialog").removeClass("is-active");
        }
        activeDropdown = $this;
        $this.addClass("is-active");
        $layer.addClass("is-active");
      };

      var inactive = function () {
        $this.removeClass("is-active");
        $layer.removeClass("is-active");
        activeDropdown = null;
      };

      $this.not("[disabled]").on("click", function (e) {
        e.stopPropagation();
        if ($this.hasClass("is-active")) {
          inactive();
        } else {
          active();
        }
      });

      $label.on("click", function () {
        var selectedVal = $(this).find(".text-value").html();
        $this.find(".text").html(selectedVal);
        inactive();
      });

      $close.on("click", function (e) {
        inactive();
      });
    });
  },
  // tab
  tab: function (options) {
    var defaults = {
      type: null,
    };
    var o = $.extend(defaults, options);
    return this.each(function () {
      var $this = $(this);
      var $thisLI = $this.find("li");
      var $thisBtn = $thisLI.find(".tab-item");
      if (o.type == "normal") {
        $thisBtn.on("click", function (e) {
          var idx = $(this).parents("li").index();
          $(this)
            .addClass("active")
            .parents("li")
            .siblings()
            .find(".tab-item")
            .removeClass("active");
          $(this)
            .closest(".tab-menu-wrap")
            .next(".tab-container-wrap")
            .children(".tab-container")
            .eq(idx)
            .show()
            .siblings()
            .hide();
        });
      }
    });
  },
  // accordion
  accordion: function (options) {
    var defaults = {
      type: "single",
      leaveOpen: false,
    };
    var settings = $.extend({}, defaults, options);

    this.initialize = function () {
      var type = settings.type;

      $.each(this, function () {
        var $this = $(this);
        var $acc = $this.find(".list-accordion");
        var $item = $acc.find(".acc-item");

        $item.each(function () {
          var $item = $(this);
          var $link = $item.find(".link");

          $link.on("click", function (e) {
            var $accItem = $item;

            if (type === "multiple") {
              $accItem.toggleClass("is-active");
            } else {
              $accItem
                .toggleClass("is-active")
                .siblings()
                .removeClass("is-active");
            }

            $accItem.find(".subDepth").slideToggle("slow");
          });
        });
      });
      return this;
    };

    return this.initialize();
  },
});

// lnb 존재여부 체크
function addHasLnbClass() {
  var uiContainers = document.querySelectorAll(".ui-container");

  uiContainers.forEach(function (uiContainer) {
    var uiLnb = uiContainer.querySelector(".ui-lnb");

    if (uiLnb) {
      uiContainer.classList.add("has-lnb");
    }
  });
}

// 로그인 페이지 체크
function loginUiClass() {
  var uiWrap = document.querySelector(".ui-wrap");

  if (uiWrap && uiWrap.querySelector(".login-seller")) {
    var uiHeader = document.getElementById("header");
    var uiFooter = document.getElementById("footer");

    if (uiHeader) {
      uiHeader.classList.add("hidden");
    }

    if (uiFooter) {
      uiFooter.classList.add("hidden");
    }
  }
}

// 포커스 이벤트 핸들러
function focusHandler() {
  $(this).closest(".bk-textfield, .bk-textarea").addClass("is-focus");
}

// 블러 이벤트 핸들러
function blurHandler() {
  $(this).closest(".bk-textfield, .bk-textarea").removeClass("is-focus");
}

// 입력 요소 상태 업데이트
function updateInputState() {
  $("input, select, textarea").each(function () {
    const $input = $(this);
    const $parent = $input.closest(".bk-textfield, .bk-select, .bk-textarea");

    if ($input.prop("required")) {
      $parent.addClass("is-required");
    }

    if ($input.prop("readonly")) {
      $parent.addClass("is-readonly");
    }

    if ($input.prop("disabled")) {
      $parent.addClass("is-disabled");
    }
  });
}

// required 속성 변경 감지
function updateRequiredState() {
  $(this).each(function () {
    if ($(this).prop("required")) {
      $(this)
        .closest(".bk-textfield, .bk-select, .bk-textarea")
        .addClass("is-required");
    } else {
      $(this)
        .closest(".bk-textfield, .bk-select, .bk-textarea")
        .removeClass("is-required");
    }
  });
}

// readonly 속성 변경 감지
function updateReadonlyState() {
  $(this).each(function () {
    if ($(this).prop("readonly")) {
      $(this).closest(".bk-textfield, .bk-textarea").addClass("is-readonly");
    } else {
      $(this).closest(".bk-textfield, .bk-textarea").removeClass("is-readonly");
    }
  });
}

// disabled 속성 변경 감지
function updateDisabledState() {
  $(this).each(function () {
    if ($(this).prop("disabled")) {
      $(this).closest(".bk-textfield, .bk-textarea").addClass("is-disabled");
    } else {
      $(this).closest(".bk-textfield, .bk-textarea").removeClass("is-disabled");
    }
  });
}

// 라디오 및 체크박스
function updateRadioCheckbox() {
  $(document).on("click", "input:checkbox, input:radio", function (e) {
    var $inp = $(this);
    var $label = $inp.next().is("label") ? $inp.next() : $inp.siblings("label"); // input 바로 뒤나 형제로부터 label 찾기
    var name = $inp.attr("name");

    if ($inp.attr("type") == "radio") {
      $("input:radio[name=" + name + "]").each(function () {
        $(this).next().removeClass("on");
      });
    }
    if (name) {
      $("input[name=" + name + "]").each(function (index) {
        if ($(this).is(":checked")) {
          $(this).next().addClass("on");
        } else {
          $(this).next().removeClass("on");
        }
      });
    } else {
      if ($inp.is(":checked")) {
        $inp.next().addClass("on");
      } else {
        $inp.next().removeClass("on");
      }
    }
  });

  $(document)
    .on("change", "input:radio", function (e) {
      var $this = $(this);
      if ($this.prop("checked")) {
        $thisId = $this.attr("id");
        $thisGroup = $this.attr("name");
        $("input[name=" + $thisGroup + "]")
          .siblings("label")
          .removeClass("on");
        $this.siblings("label").each(function () {
          if ($(this).attr("for") == $thisId) {
            $(this).addClass("on");
          }
        });
      } else {
        $this.next("label").removeClass("on");
      }
    })
    .change();

  if ($("input[type=checkbox], input[type=radio]").length) {
    $("input[type=checkbox], input[type=radio]").each(function () {
      if ($(this).attr("checked") == "checked") {
        var selObjName = $(this).attr("id");
        $("label").each(function () {
          if ($(this).attr("for") == selObjName) {
            $(this).addClass("on");
          }
        });
      }
    });
  }

  $(document).on("keydown", "input:checkbox, input:radio", function (e) {
    if (e.which === 13) {
      $(this).click();
    }
  });
}

// 체크박스 전체 선택
function allCheckbox(allCheckId) {
  var $allCheck = $("#" + allCheckId);
  var name = $allCheck.attr("name");

  $allCheck.on("click", function () {
    var $checkboxes = $('input[name="' + name + '"]').not("#" + allCheckId);

    if ($allCheck.is(":checked")) {
      $checkboxes.not(":disabled").prop("checked", true);
    } else {
      $checkboxes.prop("checked", false);
    }
  });

  $('input[name="' + name + '"]')
    .not("#" + allCheckId)
    .not(":disabled")
    .on("click", function () {
      var $checkboxes = $('input[name="' + name + '"]').not("#" + allCheckId);
      var total = $checkboxes.length;
      var checked = $checkboxes.not(":disabled").filter(":checked").length;

      if (total === checked) {
        $allCheck.prop("checked", true);
      } else {
        $allCheck.prop("checked", false);
      }
    });
}

// input file
function updateFileName(fileInputId, fileListSelector) {
  var maxFileCount = 5;
  var $fileInput = $("#" + fileInputId);
  var $fileList = $(fileListSelector);

  $fileInput.on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) return;

    if ($fileList.length === 0) {
      console.log("upload-name-group 영역이 없어 파일명을 불러오지 않습니다.");
      return;
    }

    for (var i = 0; i < files.length; i++) {
      if ($fileList.find("li").length >= maxFileCount) {
        alert("최대 " + maxFileCount + "개의 파일까지 업로드할 수 있습니다.");
        break;
      }

      var fileName = files[i].name;
      var $li = $("<li></li>");
      var $nameDiv = $('<div class="upload-name"></div>').text(fileName);
      var $deleteButton = $(
        '<button type="button" class="bk-icon-only bk-icon-only-delete">' +
          '<i class="bk-icon bk-icon-delete">delete</i>' +
          "</button"
      );

      $deleteButton.on("click", function () {
        $li.remove();
        $fileInput.val("");
      });

      $li.append($nameDiv, $deleteButton);
      $fileList.append($li);
    }
  });
}

// 레이어 팝업
var dialogOpen = function (e) {
  $(e).addClass("is-active");

  if (!$(e).hasClass("bk-snackbar")) {
    $("body").addClass("overflow");
  }

  $(e)
    .find('[role="dialogCloseBtn"]')
    .on("click", function (e) {
      $(this).closest(".bk-dialog").removeClass("is-active");

      if (!$(this).closest(".bk-dialog").hasClass("bk-snackbar")) {
        $("body").removeClass("overflow");
      }
    });
};
var dialogClose = function (e) {
  var dialog = $(e);
  dialog.removeClass("is-active");
};

// toggle button
function toggleButton() {
  const toggleButtons = document.querySelectorAll(".btn-toggle");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.classList.contains("on")) {
        button.classList.remove("on");
      } else {
        button.classList.add("on");
      }
    });
  });
}

// 셀렉트박스 10개 이상
function sizeSelectboxState() {
  $(".bk-select").each(function () {
    const select = $(this).find("select");

    const optionCount = select.find("option").length;

    if (optionCount >= 10) {
      $(this).addClass("data-lot");
    }
  });
}

// 해더
function fixedHeader() {
  const header = $("#header");
  const detailContents = $("#sticky-tabs");

  const initialHeaderTop = header.offset().top;
  let headerHeight = 204;
  if (header.hasClass("header-fixed")) {
    headerHeight = 113;
  }

  const detailContentsTop = detailContents.length
    ? detailContents.offset().top - headerHeight
    : 0;

  $(window).scroll(function () {
    const currentScrollTop = $(this).scrollTop();

    if (currentScrollTop > initialHeaderTop) {
      header.addClass("header-fixed");
    } else {
      header.removeClass("header-fixed");
    }

    // 상세페이지
    if (currentScrollTop >= detailContentsTop) {
      detailContents.addClass("sticky-tabs");
    } else {
      header.addClass("header-fixed");
      detailContents.removeClass("sticky-tabs");
    }

    if (currentScrollTop == 0) {
      header.removeClass("header-fixed");
    }
  });
}

// treeMenu
function treeMenu() {
  $(".tree-menu ul > li > a.on").each(function () {
    var submenu = $(this).next("ul").addClass("active");
    submenu.slideDown(300);
  });

  $(".tree-menu ul > li > a").click(function (e) {
    var submenu = $(this).next("ul").addClass("active");
    submenu.slideToggle(300);

    $(this)
      .toggleClass("on")
      .parent("li")
      .siblings()
      .find("a")
      .removeClass("on");
    $(this).parent().siblings().find("ul").removeClass("active").slideUp(300);
  });
}

//bk-list-toolbar
function modeChange() {
  $(".bk-list-toolbar .btns-group.btns-mode-change .bk-icon-only").click(
    function (e) {
      $(this).addClass("on").siblings().removeClass("on");
      var isImageMode = $(this).hasClass("bk-icon-only-image on");

      if (isImageMode) {
        $(".bk-icon-only-list").removeClass("on");
        $(".bk-icon-mode-image").addClass("on");
        $(".bk-icon-mode-list").removeClass("on");
      } else {
        $(".bk-icon-only-image").removeClass("on");
        $(".bk-icon-mode-image").removeClass("on");
        $(".bk-icon-mode-list").addClass("on");
      }

      return false;
    }
  );
  // 초기 상태 설정: 이미지 모드 버튼이 "on" 클래스를 가지고 있으면 이미지 모드를 기본으로 설정
  $(document).ready(function () {
    if ($(".bk-icon-only-image").hasClass("on")) {
      // 이미지 모드를 기본으로 설정
      $(".bk-icon-mode-image").addClass("on");
      $(".bk-icon-mode-list").removeClass("on");
    } else {
      // 리스트 모드를 기본으로 설정
      $(".bk-icon-mode-list").addClass("on");
      $(".bk-icon-mode-image").removeClass("on");
    }
  });
}

//gnb
function gnbMenu() {
  $("#gnb .bk-btn-allCategories").click(function () {
    $(".all-menu-wrap").toggleClass("open");
    $(this).toggleClass("on");
  });
  $(".menu-depth").hover(
    function () {
      $(this).prevAll().addBack().addClass("on");
    },
    function () {
      $(".menu-depth").removeClass("on");
    }
  );
  $(".menu-depth .list>li>a").hover(
    function () {
      $(this).parent().addClass("active");
    },
    function () {
      $(this).parent().removeClass("active");
    }
  );
  $(".all-menu-wrap").on("mouseleave", function () {
    $(".menu-depth").removeClass("on");
    $("#gnb .bk-btn-allCategories").removeClass("on");
    $(this).removeClass("open");
  });

  $(".gnb-menu .list-menu>li").on("mouseover focusin", function () {
    $(this)
      .children(".gnb-sub-menu")
      .addClass("on")
      .stop()
      .fadeIn(200)
      .siblings("a")
      .addClass("on");
  });
  $(".gnb-menu .list-menu>li").on("mouseleave", function () {
    $(this)
      .children(".gnb-sub-menu")
      .removeClass("on")
      .stop()
      .fadeOut(200)
      .siblings("a")
      .removeClass("on");
  });
  $(".gnb-menu .list-menu>li").on("focusout", function () {
    $(this).children(".gnb-sub-menu").stop().fadeOut(200);
  });
}

//topScroll
function topScroll() {
  $(window).scroll(function () {
    var scrollValue = $(this).scrollTop();
    var $goTopButton = $(".go-top");

    if (scrollValue > 200) {
      $goTopButton.addClass("on");
      if (scrollValue < 400) {
        $goTopButton.parents(".ui-setting-btns").addClass("on");
      } else {
      }
    } else {
      $goTopButton.parents(".ui-setting-btns").removeClass("on");
      $goTopButton.removeClass("on").fadeOut(200);
    }
  });

  $(".go-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 300);
  });
}

// 메인 팝업
function mainPopup() {
  $(document).mouseup(function (e) {
    var LayerPopup = $(".dialog-main");
    if (LayerPopup.has(e.target).length === 0) {
      LayerPopup.removeClass("is-active");
    }
  });

  var initialPopup = $(".dialog-main.is-active");
  $(".btn-close").click(function () {
    initialPopup.removeClass("is-active");
  });
}

// 레이어 닫기
$(document).mouseup(function (e) {
  var LayerPopup = $(
    ".bk-icon-only-drop, .layer-kotra-family,.family-group .bk-btn,.family-group .layer-family, .language .bk-btn-icon, .language .layer-language"
  );
  if (LayerPopup.has(e.target).length === 0) {
    LayerPopup.removeClass("is-active");
  }
});

// 언어 번역 레이어 닫기
$(".list-language a").on("click", function () {
  $(".cp-layer.layer-language, .bk-btn-icon").removeClass("is-active");
});
