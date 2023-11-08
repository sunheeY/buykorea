
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

  // input, select, textarea 요소에 focus 및 blur 이벤트 핸들러 등록
  $('.bk-textfield input, .bk-select select, .bk-textarea textarea').focus(focusHandler);
  $('.bk-textfield input, .bk-select select, .bk-textarea textarea').blur(blurHandler);
  updateRequiredState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  updateReadonlyState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  updateDisabledState.call($('.bk-textfield input, .bk-select select, .bk-textarea textarea'));
  // clear 버튼 컨트롤
  $('.bk-textfield.has-clear .icon-text-clear').on('click', function (e) {
    e.preventDefault();
    $(this).removeClass('has-clear');
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

//checkbox
var $checkHead = $("#checkbox-agree-all");
var $checkBody = $(".checkbox-item input[type='checkbox']");
var $checkBdCnt = $(".checkbox-item");
var $checkCount = $(".checkbox-wrap");

var $checkHeadCnt = $checkCount.find("input[type='checkbox']").length;

console.log($checkHeadCnt);
/* 전체선택 */
$checkHead.click(function(){
    var $bodyPutCk = $checkHead.is(":checked");

    if ( $bodyPutCk == true ) {
        $checkBody.attr("checked", true);
        $checkBody.prop("checked", true);
    }else {
        $checkBody.attr("checked", false);
        $checkBody.prop("checked", false);
    }    
});

/* 전체선택 length 카운트 */
$checkBody.click(function(){
  var $checkBodyCnt = $checkBdCnt.find("[name='checkbox-agree-child']:checked").length ;
  if ($checkHeadCnt == ($checkBodyCnt + 1)) {
    $checkHead.attr("checked", true);
    $checkHead.prop("checked", true);
  } else {
    $checkHead.attr("checked", false);
    $checkHead.prop("checked", false);
  }

});


//체크박스제어
$("[id^='check-']").on('change', function(){
  $this_checkbox = $(this);
  var id_name = $this_checkbox.attr('id');
  var checked = $('[id="'+id_name+'"]').is(":checked");

  $("[id^='"+id_name+"']").prop('checked', checked );
  checkbox_checked(id_name, checked);
});

function checkbox_checked(id_name, checked){
  if(id_name.indexOf('-') == -1) return;

  var parent_id_name = id_name.substr(0, id_name.lastIndexOf('-') );
  var friend_id = id_name.substr(0, (id_name.lastIndexOf('-') + 1) );
  
  if(checked){
     var i=0;
     var node = $('input:checkbox:regex(id,'+ friend_id + '[0-9]$)');
     if(node.length == node.filter(":checked").length)
        $('#' + parent_id_name ).prop('checked', true );
  }else{
     $("[id^='"+id_name+"']").each(function(index, item){
        var parent_id_name = id_name.substr(0, id_name.lastIndexOf('-'));
        
        child_checked = $(this).is(':checked');
        if(!child_checked && parent_id_name != 'check'){
           $('#'+parent_id_name).prop('checked', child_checked );
           return false;
        }
     });
  }
  checkbox_checked(parent_id_name, checked);
}

// 클래스명에 숫자가 들어간것 select
jQuery.expr[':'].regex = function(elem, index, match){
  var matchParams = match[3].split(','),
  validLabels = /^(data|css):/,
  attr = {
        method: matchParams[0].match(validLabels) ?
                       matchParams[0].split(':')[0] : 'attr',
           property: matchParams.shift().replace(validLabels,'')
  },
  regexFlags = 'ig',
  regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
  return regex.test(jQuery(elem)[attr.method](attr.property));
}

//빈값체크
function fx_empty(value){
  if(value == null || value == "" || value == "undefined" || value == undefined)
     return true;

  return false;
}
//체크박스제어

// 레이어 팝업
var dialogOpen = function(e) {
	$(e).addClass('is-active');
  // body에 'overflow' 클래스 추가
  $('html,body').addClass('overflow');
	$(e).find('[role="dialogCloseBtn"]').on('click', function(e){
		$(this).closest('.bk-dialog').removeClass('is-active');
    // body에서 'overflow-hidden' 클래스 제거
    $('html,body').removeClass('overflow');
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


// 기업노출
function companyOpen(id) {
  //var dialog = $(e);
  //console.log(id);
  $('.bk-company-result .bk-tbl').removeClass('is-active');
  $('#'+ id).addClass('is-active');
  
  $openCompany = $('.bk-company-search-result');
  $openCompany.addClass('is-active');
  
}

//파일관리
$("#license-file").on('change',function(){
  var fileName = $("#license-file").val();
  //$(".file-list .upload-license-name").val(fileName);
  $(".file-list .upload-license-name").text(fileName);
  $(".file-list").addClass('is-active');
});


function license_file_del(){
	//$(".file-list .upload-license-name").val("");
  $(".file-list .upload-license-name").text("");
  $(".file-list").removeClass('is-active');
}



//배송지 리스트 삭제
$('[role="addressCloseBtn"]').on('click', function(e){
  $(this).closest('.bk-list').hide();  
});

//생산라인 리스트 추가
var productNumber = 0;
$('[role="productionPlus"]').on('click', function(e){
  var dhtml = '<div class="cp-company-img-list" id="productionNum_'+productNumber+'">';
  dhtml += '<button type="button" class="bk-btn btn-brand btn-text bk-list-delete" onclick="dialogOpen(#dialog-modal-delete-list)" >';
  dhtml += '<span class="deco-icon extra-icon"><i class="bk-icon bk-icon-image-list-delete">리스트 삭제</i></span></button>';

  dhtml += '<ul class="sub_list">';
  dhtml += '<li><div class="bk-text">생산라인</div><div class="bk-textfield input-full">';
  dhtml += '<div class="bk-control"><input type="text" name="company-production-01-'+productNumber+'" value="" placeholder="" class="iText" title="생산라인"></div></div></li>';
  dhtml += '<li><div class="bk-text">관리자수</div><div class="bk-textfield input-full">';
  dhtml += '<div class="bk-control"><input type="text" name="company-production-02'+productNumber+'" value="" placeholder="" class="iText" title="관리자수"></div></div></li>';
  dhtml += '<li><div class="bk-text">운영자수</div><div class="bk-textfield input-full">';
  dhtml += '<div class="bk-control"><input type="text" name="company-production-03'+productNumber+'" value="" placeholder="" class="iText" title="운영자수"></div></div></li>';
  dhtml += '<li><div class="bk-text">인라인 QC/QA수</div><div class="bk-textfield input-full">';
  dhtml += '<div class="bk-control"><input type="text" name="company-production-04'+productNumber+'" value="" placeholder="" class="iText" title="인라인 QC/QA수"></div></div></li>';
  dhtml += '</ul>';
  dhtml += '</div>';    


  $(this).siblings('.cp-company-img-list-group').append(dhtml);
  productNumber++;
});

//생산라인 리스트 삭제
function cpListDelete(e){ 
	$(e).closest('.cp-company-img-list').remove();
}


//기업사진 위아래이동
$(function() {
  $(document).on("click",".cp-company-img-list .btn-list-up", function() {
   console.log('up');
     var srcDiv = $(this).parents("#bk-list-id");
     var tgtDiv = srcDiv.prev();
     if (tgtDiv[0]) {
        tgtDiv.before(srcDiv);
     }
     up_down_control();
  });

  $(document).on("click",".cp-company-img-list .btn-list-down",function () {
   console.log('down');
     var srcDiv = $(this).parents("#bk-list-id");
     var tgtDiv = srcDiv.next();
     if (tgtDiv[0]) {
        tgtDiv.after(srcDiv);
     }
     up_down_control();
  });
});


//기업사진 리스트 추가
var plusNumber = 1;
$('[role="photoListPlus"]').on('click', function(e){
 var dhtml = '<div id="bk-list-id"><div class="cp-company-img-list bk-flex-row-gap-basic" id="productNum_'+plusNumber+'">';
 dhtml += '<button type="button" class="bk-btn btn-brand btn-text bk-list-delete" onClick="photoListdelete(this);">';
 dhtml += '<span class="deco-icon extra-icon">';
 dhtml += '<i class="bk-icon bk-icon-image-list-delete">리스트 삭제</i>';
 dhtml += '</span></button>';
 dhtml += '<div class="bk-photofield">';
 dhtml += '<img id="photo_img_file_'+plusNumber+'" class="img-preview">';
 dhtml += '<div class="bk-photoInfo-group">';
 dhtml += '<button type="button" class="bk-btn btn-default btn-outline btn-xsmall btn-text-xsmall">';
 dhtml += '<label for="productfile_upload_'+plusNumber+'" class="text">이미지 찾기</label></button>';
 dhtml += '<span class="upload-img-name_'+plusNumber+' text"></span>';
 dhtml += '<input type="file" name="file" id="productfile_upload_'+plusNumber+'" value="" onChange="list_plus_img(event,'+plusNumber+')" /></div></div>';
 dhtml += '<div class="bk-textfield input-full">';
 dhtml += '<div class="bk-control"><input type="text" name="company-image-01" value="" placeholder="이미지 설명을 영문 30자 이내로 입력." class="iText" title="이미지 설명"></div></div>';
 dhtml += '<div class="bk-list-move-group"><button type="button" class="bk-btn btn-brand btn-text btn-list-up"><span class="deco-icon extra-icon"><i class="bk-icon bk-icon-image-list-up">위로</i></span></button>';
 dhtml += '<button type="button" class="bk-btn btn-brand btn-text btn-list-down"><span class="deco-icon extra-icon"><i class="bk-icon bk-icon-image-list-down">아래로</i></span></button></div></div>';
 dhtml += '</div>';
 $(this).siblings('.cp-company-img-list-group').append(dhtml);
 up_down_control();
 plusNumber++;
});


//위 아래 화살표 컨트롤
function up_down_control(){
  var num = $('div[id=bk-list-id]').length;
  
  if(num == 1){
    $('div[id=bk-list-id]').eq(0).children().children().eq(3).hide();
    $('div[id=bk-list-id]').eq(0).children().children().eq(3).children().first().hide();
    $('div[id=bk-list-id]').eq(0).children().children().eq(3).children().last().hide();
  }else{
      //첫번째
      $('div[id=bk-list-id]').eq(0).children().children().eq(3).show();
      $('div[id=bk-list-id]').eq(0).children().children().eq(3).children().first().hide();
      $('div[id=bk-list-id]').eq(0).children().children().eq(3).children().last().show();
      
      //마지막
      $('div[id=bk-list-id]').eq(num-1).children().children().eq(3).children().first().show();
      $('div[id=bk-list-id]').eq(num-1).children().children().eq(3).children().last().hide();
      
      //중간
      for(var i=1; i<num-1; i++){
        $('div[id=bk-list-id]').eq(i).children().children().eq(3).children().first().show();
        $('div[id=bk-list-id]').eq(i).children().children().eq(3).children().last().show();
      }
  }
}

//추가리스트 내 사진
function list_plus_img(event,plusCnt) {
  var file = event.target.files[0];
  if(isImageLogoFile(file)) {
     var reader = new FileReader();
     reader.onload = function(event) {
        $("#photo_img_file_"+plusCnt).attr("src", event.target.result);
        $(".upload-img-name_"+plusCnt).text(file.name);
     }; 
     reader.readAsDataURL(event.target.files[0]);
  }else{
     alert("이미지 파일만 첨부 가능합니다.");
     event.target.value = ""; //파일 삭제
  }
  
}


//기업사진 리스트 삭제
function photoListdelete(e){ 
  $(e).closest('div[id=bk-list-id]').remove();
  up_down_control();
  plusNumber--;
  if(plusNumber == 0){
     plusNumber = 1;
  }

}



//로고
$(document).ready(function() {
	$("#logo_file").on("change", function(e) {
		var file = e.target.files[0];
		if(isImageLogoFile(file)) {
			var reader = new FileReader(); 
			reader.onload = function(e) {
				$("#logo_img_file").attr("src", e.target.result);        
        $(".file-logo-list .upload-logo-name").text(file.name);
        $(".file-logo-list").addClass('is-active');
			}
			reader.readAsDataURL(file);

		}else{
			alert("이미지 파일만 첨부 가능합니다.");
			$("#logo_file").val("");
			$("#logo_img_file").attr("src", "");
		}
	});
});

// 업로드 파일 이미지 파일인지 확인
function isImageLogoFile(file) {
	// 파일명에서 확장자를 가져옴
	var ext = file.name.split(".").pop().toLowerCase(); 
	return ($.inArray(ext, ["jpg", "jpeg", "gif", "png"]) === -1) ? false : true;
}

function form_chk() {
	var file_val = $("#logo_file").val();
	if(file_val){
		alert("이미지가 첨부되었습니다");
	}else{
		alert("첨부된 이미지가 없습니다.");
	}
}

function logoFileDelete(){
	//$(".upload-logo-name").val("");
	$(".upload-logo-name").text("");
	$("#logo_file").val("");
	$("#logo_img_file").attr("src", "");
  $(".file-logo-list").removeClass('is-active');
}


//select 박스 색상 변경
$(document).ready(function(e) {
  $('select').css('color','#999');
  $('select').change(function() {
     var current = $('select').val();
     if (current != 'null') {
         $('select').css('color','#000');
     } else {
         $('select').css('color','#999');
     }
  }); 
});


/* 달력 */
function addDiv(){

  var dhtml = '<div class="dialog-header">';
  dhtml += '<div class="header-left">';
  dhtml += '<div class="bk-title"><h1 class="title">날짜선택</h1></div></div>';
  dhtml += '<div class="header-right"><button type="button" class="bk-icon-only bk-btn-cal-close"><i class="bk-icon bk-icon-dialog-close">닫기</i></button></div>';
  dhtml += '</div>';

  var dhtml2 = '<div class="dialog-footer">';
  dhtml2 += '<div class="footer-center">';
  dhtml2 += '<button type="button" class="bk-btn btn-light-gray btn-sticky btn-half bk-btn-cal-close" >취소</button>';
  dhtml2 += '<button type="button" class="bk-btn btn-primary btn-sticky btn-half">확인</button>';
  dhtml2 += '</div>';
  dhtml2 += '</div>';


  var dhtml3 = '<button type="button" class="bk-btn btn-sub btn-text btn-underline-small btn-select-today"><span class="text">오늘</span></button>';

  var flatDiv = $('.flatpickr-calendar');
  var flatMonthDiv = $('.flatpickr-current-month');

  if((flatDiv).hasClass('open')){

    flatDiv.prepend(dhtml);
    flatDiv.append(dhtml2);
    $(".flatpicker-dimd").addClass('is-active');
    flatMonthDiv.prepend(dhtml3);

  }else{
    flatDiv.find('.dialog-header').remove();
    flatDiv.find('.dialog-footer').remove();
    $(".flatpicker-dimd").removeClass('is-active');
    flatMonthDiv.find('.bk-btn').remove();
  }      

  $('.flatpickr-monthDropdown-months').attr("disabled",true);
  $('.cur-year').attr("disabled",true);

  }     

  //flatpickr 옵션 설정
  //달력 공통설정 지정해놓음
  config = {
    inline:false,
    dateFormat: 'Y-m-d',
    enableTime: false,
    minDate: '2000-01-01',
    defaultDate: new Date(),
    locale: 'ko',
    onOpen: addDiv, // 바텀레이어추가
    onClose: addDiv, // 바텀레이어삭제
    onReady: function ( dateObj, dateStr, instance ) {
      $(document).on("click",".bk-btn-cal-close", () => {
          //'닫기,취소' 클릭
          datepicker.clear();
          datepicker2.clear();
          startDateInput.clear();
          endDateInput.clear();
          
          datepicker.close();
          datepicker2.close();
          startDateInput.close();
          endDateInput.close();
      });
      $(document).on("click",".btn-select-today", () => { 
          //'오늘'클릭
          datepicker.setDate(new Date);
          datepicker2.setDate(new Date);
          startDateInput.setDate(new Date);
          endDateInput.setDate(new Date);
      });
    },
    onChange: function ( dateObj, dateStr, instance ) {
    },
  };

  //flatpickr 생성
  const datepicker = $('#datepicker').flatpickr(config);
  const datepicker2 = $('#datepicker2').flatpickr(config);
  const startDateInput = $('#startDate').flatpickr(config);
  const endDateInput = $('#endDate').flatpickr(config);

  //flatpickr end