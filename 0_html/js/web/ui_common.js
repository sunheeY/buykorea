/*  jQuery Nice Select - v1.0
https://github.com/hernansartorio/jquery-nice-select
Made by Hernán Sartorio  */
!function(e){e.fn.niceSelect=function(t){function s(t){t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class")||"").addClass(t.attr("disabled")?"disabled":"").attr("tabindex",t.attr("disabled")?null:"0").html('<span class="current"></span><ul class="list"></ul>'));var s=t.next(),n=t.find("option"),i=t.find("option:selected");s.find(".current").html(i.data("display")||i.text()),n.each(function(t){var n=e(this),i=n.data("display");s.find("ul").append(e("<li></li>").attr("data-value",n.val()).attr("data-display",i||null).addClass("option"+(n.is(":selected")?" selected":"")+(n.is(":disabled")?" disabled":"")).html(n.text()))})}if("string"==typeof t)return"update"==t?this.each(function(){var t=e(this),n=e(this).next(".nice-select"),i=n.hasClass("open");n.length&&(n.remove(),s(t),i&&t.next().trigger("click"))}):"destroy"==t?(this.each(function(){var t=e(this),s=e(this).next(".nice-select");s.length&&(s.remove(),t.css("display",""))}),0==e(".nice-select").length&&e(document).off(".nice_select")):console.log('Method "'+t+'" does not exist.'),this;this.hide(),this.each(function(){var t=e(this);t.next().hasClass("nice-select")||s(t)}),e(document).off(".nice_select"),e(document).on("click.nice_select",".nice-select",function(t){var s=e(this);e(".nice-select").not(s).removeClass("open"),s.toggleClass("open"),s.hasClass("open")?(s.find(".option"),s.find(".focus").removeClass("focus"),s.find(".selected").addClass("focus")):s.focus()}),e(document).on("click.nice_select",function(t){0===e(t.target).closest(".nice-select").length&&e(".nice-select").removeClass("open").find(".option")}),e(document).on("click.nice_select",".nice-select .option:not(.disabled)",function(t){var s=e(this),n=s.closest(".nice-select");n.find(".selected").removeClass("selected"),s.addClass("selected");var i=s.data("display")||s.text();n.find(".current").text(i),n.prev("select").val(s.data("value")).trigger("change")}),e(document).on("keydown.nice_select",".nice-select",function(t){var s=e(this),n=e(s.find(".focus")||s.find(".list .option.selected"));if(32==t.keyCode||13==t.keyCode)return s.hasClass("open")?n.trigger("click"):s.trigger("click"),!1;if(40==t.keyCode){if(s.hasClass("open")){var i=n.nextAll(".option:not(.disabled)").first();i.length>0&&(s.find(".focus").removeClass("focus"),i.addClass("focus"))}else s.trigger("click");return!1}if(38==t.keyCode){if(s.hasClass("open")){var l=n.prevAll(".option:not(.disabled)").first();l.length>0&&(s.find(".focus").removeClass("focus"),l.addClass("focus"))}else s.trigger("click");return!1}if(27==t.keyCode)s.hasClass("open")&&s.trigger("click");else if(9==t.keyCode&&s.hasClass("open"))return!1});var n=document.createElement("a").style;return n.cssText="pointer-events:auto","auto"!==n.pointerEvents&&e("html").addClass("no-csspointerevents"),this}}(jQuery);
$(function () {
  preLoad();
});

/***********************************************
 * 함수
 ************************************************/
function preLoad() {
  $('[component="dropdownMenu"]').dropdown();
  $('.bk-tab').tab({type : 'normal'});
  // accordion 초기화
  $('.bk-accordion').accordion({ type: 'single', leaveOpen: false });
  $('.bk-accordion.multi').accordion({ type: 'multiple', leaveOpen: false });

  $('select:not(.flatpickr-monthDropdown-months)').niceSelect();
  // input, select, textarea 요소에 focus 및 blur 이벤트 핸들러 등록
  $('.bk-textfield input, .bk-select select, .bk-textarea textarea').focus(focusHandler);
  $('.bk-textfield input, .bk-select select, .bk-textarea textarea').blur(blurHandler);
  updateRequiredState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  updateReadonlyState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  updateDisabledState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  // clear 버튼 컨트롤
  $('.bk-textfield.has-clear .icon-text-clear').on('click', function (e) {
    e.preventDefault();
    $(this).closest('.bk-textfield').find('.iText').val('');
  });
  addErrorClass();
  // 요소 상태 업데이트
  updateInputState();
  // 라디오 및 체크박스 상태 업데이트
  updateRadioCheckbox();
  // 함수 호출하여 마스킹 토글 활성화
  toggleMasking();

  // lnb 존재여부 체크
  addHasLnbClass();
}

$.fn.extend({
  // dropdown,레이어 팝업
  dropdown: function (options) {
    var defaults = {
      type: null,
    };
    var settings = $.extend({}, defaults, options);

    return this.each(function () {
      var $this = $(this);
      var $layer = $(this).next('.cp-layer, .bk-dialog');
      var $label = $layer.find('label, .cp-layer');
      var $close = $layer.find('[role="dropdownCloseBtn"]');

      var active = function () {
        $this.addClass('is-active');
        $layer.addClass('is-active');
      };

      var inactive = function () {
        $this.removeClass('is-active');
        $layer.removeClass('is-active');
      };

      $this.not('[disabled]').on('click', function (e) {
        if ($this.hasClass('is-active')) {
          inactive();
        } else {
          active();
        }
      });

      $label.on('click', function () {
        var selectedVal = $(this).find('.text-value').html();
        $this.find('.text').html(selectedVal);
        inactive();
      });

      $close.on('click', function (e) {
        inactive();
      });
    });
  },
  // tab
	tab: function(options) {
		var defaults = {
			type: null,
		}
		var o = $.extend( defaults, options );
		return this.each(function(){
			var $this = $(this);
			var $thisLI = $this.find('li');
			var $thisBtn = $thisLI.find('.tab-item');
			if ( o.type == 'normal' ){
				$thisBtn.on('click', function(e){
					var idx = $(this).parents('li').index();
					$(this).addClass('active').parents('li').siblings().find('.tab-item').removeClass('active');
					$(this).closest('.tab-menu-wrap').next('.tab-container-wrap').children('.tab-container').eq(idx).show().siblings().hide();
				});
			}
		});
	},
  // accordion
  accordion: function (options) {
    var defaults = {
      type: 'single',
      leaveOpen: false,
    };
    var settings = $.extend({}, defaults, options);

    this.initialize = function () {
      var type = settings.type;
      var leaveOpen = settings.leaveOpen;

      $.each(this, function () {
        var $this = $(this);
        var $acc = $this.find('.list-accordion');
        var $item = $acc.find('.acc-item');

        $.each($item, function () {
          var $header = $(this).find('.acc-header');
          var $link = $header.find('.link');
          var $container = $(this).find('.acc-container');

          $link.click(function (e) {
            $container.slideToggle('');
            $(this).closest('.acc-item').toggleClass('is-active'); // 토글 클래스 추가
            if (leaveOpen === false) {
              if (type === 'single') {
                $container
                  .closest('.list-accordion')
                  .find('.acc-container')
                  .not($container)
                  .slideUp('');
                $container
                  .closest('.list-accordion')
                  .find('.acc-item')
                  .not($(this).closest('.acc-item'))
                  .removeClass('is-active'); // 다른 항목에서 클래스 제거
              }
            }
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

  uiContainers.forEach(function(uiContainer) {
    var uiLnb = uiContainer.querySelector(".ui-lnb");
    
    if (uiLnb) {
      uiContainer.classList.add("has-lnb");
    }
  });
}

// 포커스 이벤트 핸들러
function focusHandler() {
  $(this).closest('.bk-textfield, .bk-textarea').addClass('is-focus');
}

// 블러 이벤트 핸들러
function blurHandler() {
  $(this).closest('.bk-textfield, .bk-textarea').removeClass('is-focus');
}

// 입력 요소 상태 업데이트
function updateInputState() {
  $('input, select, textarea').each(function () {
    const $input = $(this);
    const $parent = $input.closest('.bk-textfield, .bk-select, .bk-textarea');

    if ($input.prop('required')) {
      $parent.addClass('is-required');
    }

    if ($input.prop('readonly')) {
      $parent.addClass('is-readonly');
    }

    if ($input.prop('disabled')) {
      $parent.addClass('is-disabled');
    }
  });
}

// required 속성 변경 감지
function updateRequiredState() {
  $(this).each(function () {
    if ($(this).prop("required")) {
      $(this).closest(".bk-textfield, .bk-select, .bk-textarea").addClass("is-required");
    } else {
      $(this).closest(".bk-textfield, .bk-select, .bk-textarea").removeClass("is-required");
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

// 에러 클래스 추가 및 제거
function addErrorClass() {
  $(".bk-valid").on("click", function () {
    $(this).closest(".bk-textfield, .bk-textarea").toggleClass("error");
  });
}

// 라디오 및 체크박스
function updateRadioCheckbox() {
  $(document).on('click', 'input:checkbox, input:radio', function (e) {
    var $inp = $(this);
    var $label = $inp.next().is("label") ? $inp.next() : $inp.siblings('label'); // input 바로 뒤나 형제로부터 label 찾기
    var name = $inp.attr("name");

    // only for radio
    if ($inp.attr("type") == "radio") {
      $("input:radio[name=" + name + "]").each(function () {
        $(this).next().removeClass('on');
      });
    }

    // both checkbox and radio
    if (name) {
      $("input[name=" + name + "]").each(function (index) {
        if ($(this).is(":checked")) {
          $(this).next().addClass('on');
        } else {
          $(this).next().removeClass('on');
        }
      });
    } else {
      // if name is not specified
      if ($inp.is(":checked")) {
        $inp.next().addClass('on');
      } else {
        $inp.next().removeClass('on');
      }
    }

    // check/uncheck all checkboxes
    var $wrap = $inp.parent();
    if ($wrap.hasClass("otherCheck")) {
      $wrap = $wrap.parent();
    }
    if ($wrap.find("input:checkbox[name=allCheck]").length == 1) {
      if (name == "allCheck") {
        if ($inp.is(":checked")) {
          $wrap.find("input[name!=allCheck]:checkbox").each(function () {
            $(this).prop("checked", true);
            $(this).next().addClass("on");
          });
        } else {
          $wrap.find("input:checkbox").each(function () {
            $(this).prop("checked", false);
            $(this).next().removeClass("on");
          });
        }
      } else {
        var cnt1 = $wrap.find("input[name!=allCheck]").length;
        var cnt2 = $wrap.find("input[name!=allCheck]:checked").length;
        if (cnt1 == cnt2) {
          $wrap.find("input[name=allCheck]").prop("checked", true);
          $wrap.find("input[name=allCheck]").next().addClass("on");
        } else {
          $wrap.find("input[name=allCheck]").prop("checked", false);
          $wrap.find("input[name=allCheck]").next().removeClass("on");
        }
      }
    }
  });

  $(document).on('change', 'input:radio', function (e) {
    var $this = $(this);
    if ($this.prop('checked')) {
      $thisId = $this.attr('id');
      $thisGroup = $this.attr('name');
      $("input[name=" + $thisGroup + "]").siblings('label').removeClass('on');
      $this.siblings('label').each(function () {
        if ($(this).attr('for') == $thisId) {
          $(this).addClass('on');
        }
      });
    } else {
      $this.next('label').removeClass('on');
    }
  }).change();

  if ($('input[type=checkbox], input[type=radio]').length) {
    $('input[type=checkbox], input[type=radio]').each(function () {
      if ($(this).attr('checked') == 'checked') {
        var selObjName = $(this).attr('id');
        $('label').each(function () {
          if ($(this).attr('for') == selObjName) {
            $(this).addClass('on');
          }
        });
      }
    });
  }

  // 라디오 및 체크박스에 대한 키보드 이벤트 핸들러
  $(document).on('keydown', 'input:checkbox, input:radio', function (e) {
    if (e.which === 13) { // Enter 키 누를 때
      $(this).click(); // 라디오 및 체크박스 클릭
    }
  });
}

// 레이어 팝업
var dialogOpen = function(e) {
	$(e).addClass('is-active');
  // body에 'overflow' 클래스 추가
  $('body').addClass('overflow');
	$(e).find('[role="dialogCloseBtn"]').on('click', function(e){
		$(this).closest('.bk-dialog').removeClass('is-active');
    // body에서 'overflow-hidden' 클래스 제거
    $('body').removeClass('overflow');
	});
}
var dialogClose = function(e) {
	var dialog = $(e);
	dialog.removeClass('is-active');
}

// Masking
function toggleMasking() {
  // 마스킹 토글 버튼에 대한 이벤트 리스너 추가
  $(".textfield-masking .icon-masking").click(function() {
      // 입력 필드 및 아이콘을 선택
      var $input = $(this).closest(".bk-textfield").find(".iText");
      var $icon = $(this).find(".bk-icon");

      // 입력 필드의 타입을 토글
      if ($input.attr("type") === "text") {
          $input.attr("type", "password");
          $icon.text("안보임");
          $icon.removeClass("bk-icon-masking-on").addClass("bk-icon-masking-off");
      } else {
          $input.attr("type", "text");
          $icon.text("보임");
          $icon.removeClass("bk-icon-masking-off").addClass("bk-icon-masking-on");
      }
  });
}
