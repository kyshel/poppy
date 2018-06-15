/*
0. these codes are crap, never smell it, you got my warning!
1. event add order is vital, ele's bind order rely on it


*/

$(document).ready(function(){
	DEBUG = 0;

	var stack_undo = [];
	var stack_redo = [];
	var stack_play = [];

	$(".btn-trick").on( "click", function(e) {

		// console.log($(this)[0])
		push_stack($(this)[0].id,stack_undo);
		push_stack($('#play').val(),stack_play);

		if(e.hasOwnProperty('originalEvent')){
			stack_redo = [];
			// $("#btn-preview-all").click();

		}
		// else{
		// 	stack_undo = [];
		// }

	});


	$("#btn-undo").on("click", function() {
		last_trick=stack_undo.pop();
		last_play=stack_play.pop(); 
		stack_redo.push(last_trick);
		$('#play').val(last_play);
	});

	$("#btn-redo").on("click",function() {
		next_trick=stack_redo.pop();
		$("#"+next_trick).click();
	});




	

	$(window).on("error", function(evt) {
		var e = evt.originalEvent; 
		if (e.message) { 
			$('.tip').html(e.message );		
			stack_undo.pop()
			stack_play.pop() 
			init_view();
		} else {
			alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
		}
	});


	c='refresh undo redo progress'
	$(".btn").on("click", function() {
		empty_tip();

		$('#stack-trick').html( function(){
			var joint='origin';
			for (var i = 0; i < stack_undo.length; i++) {
				joint = joint + '>' + stack_undo[i] + ' ' ;
			}
			return joint;
		});
		
		init_view();
	});



	init_view=function(){	
		$("#btn-reset").attr("disabled", 
			(stack_redo.length || stack_play.length)?false:true);
		$("#btn-origin").attr("disabled", stack_undo.length?false:true);
		$("#btn-undo").attr("disabled", stack_undo.length?false:true);
		$("#btn-redo").attr("disabled", stack_redo.length?false:true);
		$(".btn-trick").attr("disabled", false);
	}

	reset=function(){
		stack_undo = [];
		stack_redo = [];
		stack_play = [];
		$("#btn-fake").click();
		$("#play").val('');
		$("#stack-trick").html('');
		$("#div-preview-all").html('');
	}

	origin=function(){
		while(stack_undo.length){
			$("#btn-undo").click();
		}
	}


	$("#btn-reset").on("click", reset);
	$("#btn-origin").on("click", origin);
	init_view();





	$("#btn-preview-all").click(function() {
		var tricks=[];
		$(".btn-trick").each(function() {
			tricks.push(this.id);
		});
		//console.log(tricks);

		$('#stack-trick').hide()
		

		var html_build='',temp='',origin_val=$('#play').val();
		for (var i = 0; i < tricks.length; i++) {

			var no_error=true;

			try {
				$("#"+tricks[i]).click();;
			}
			catch(err) {
				no_error=false;
				DEBUG ? console.log(err) : 0 ;
				temp='<span class="tip">'+err+'</span>';
			}

			if (no_error) {
				temp=$('#play').val();
			}



			if (tricks[i]=='html-entity-encode') {
				temp ='<span class="tip">Need manually!</span>';
			}
			
			html_build = html_build +'<div>' +tricks[i] +': '+ temp+'</div>';

			$('#play').val(origin_val);
		}

		$("#div-preview-all").html(html_build);

		stack_undo = [];
		stack_redo = [];

		$('#stack-trick').html('')
		$('#stack-trick').show()

	});

	$('#play').keydown(function (e) {
		if (e.ctrlKey && e.keyCode == 13) {
			$("#btn-preview-all").click();
		}

	});



	$('#sw-realtime').change(function(){

		if($(this).is(':checked')) {
			$("#btn-preview-all").click();
			$('.btn').attr("disabled", true);
		} else{
			init_view();
			$('#div-preview-all').html('')

		}

		$("#play").focus();
	});

	$('#play').on('input',function (e) {
		if($("#sw-realtime").is(':checked')){
			$("#btn-preview-all").click();
			$('.btn').attr("disabled", true);
		}
	});




	$("#base64encode").on("click", base64_encode);
	$("#base64decode").on("click", base64_decode);


	$("#url-encode").on("click", function(){
		come = $('#play').val();
		go=encodeURIComponent(come)
		$('#play').val(go);	
	});

	$("#url-decode").on("click", function(){
		$('#play').val(decodeURIComponent($('#play').val()));	
	});


	$("#html-entity-encode").on("click", function(){
		come = $('#play').val();
		go=come.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#'+i.charCodeAt(0)+';';
		});
		$('#play').val(go);	
	});

	$("#html-entity-decode").on("click", function(){
		$('#play').val(decodeHTMLEntities($('#play').val()));
	});

	//test();


});


function test(){
	$("#btn-preview-all").click();
}



function decodeHTMLEntities (str) {
	if(str && typeof str === 'string') {

		str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
		str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
		var decoded = $("<div/>").html(str).text();
	}

	return decoded;
}










function base64_encode(){
	come = $('#play').val();
	go=btoa(come)
	$('#play').val(go);
}


function base64_decode(){
	come = $('#play').val();
	go=atob(come)
	$('#play').val(go);	
}












function push_stack(ele,stack){
	stack.push(ele); 
}

function empty_tip(){
	$('.tip').html('');
}

function run(functionName,arguments = NULL ){
	window[functionName](arguments);
}




/* litter */


/*a=$._data($(".base64encode").get(0), "events") */




