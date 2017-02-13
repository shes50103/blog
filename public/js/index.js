/*1*/
/*
$(".my_work").click(function(){
 //<a href="http://140.113.69.132:3000/friendship">刷新</a>
  $psot(""http://140.113.69.132:3000/friendship"");
  console.log("QQ");
});
*/



/*1*/
$(".buybtn").click(function(){
  $(".buybtn").text("已經購買");
  $(".buybtn").addClass("buyed");
});

/*2*/
$(".selbtn").click(function(){
  $(".show_info").text("已經選擇: "+$(this).text());
  var cata=$(this).attr("data-cata");
  $(".show_cata").text(cata);
  if (cata=="flower"){
    $(".show_cata").append("，他買的是花!!!");
  }else{
    $(".show_cata").append("嗚嗚他買的不是花:((");
  }
});


/*3*/
$(".hoverbox").mouseenter(function(){
  $(this).text("使用者有興趣!!!! :)");
});
$(".hoverbox").mouseleave(function(){
  $(this).text("使用者沒興趣....");
});



/*4*/
setTimeout(function(){
  $(".timerbox").css("background-color","#f24");
  $(".timerbox").css("margin-left","50px");
  $(".timerbox").css("color","#fff");
  
},5000);

var sec=1;
setInterval(function(){

  $(".countbox").text("經過了:"+sec+"秒");
  sec=sec+1;
},1000);




/*iphone!!!!!!!!!!!!!!!!!!!*/






var button_audio=new Audio("http://www.monoame.com/awi_class/ballsound/click14.wav");

$(".i5").click(function(){
  $(".phone").css("width","");
  $(".screen").css("height","");
  $(".phonename").text($(this).text());
  button_audio.play();
});

$(".i5s").click(function(){
  $(".phone").css("width","250px");
  $(".screen").css("height","420px");
  $(".phonename").text($(this).text());
  button_audio.play();
});


$(".i6").click(function(){
  $(".phone").css("width","270px");
  $(".screen").css("height","440px");
  $(".phonename").text($(this).text());
  button_audio.play();
});

$(".i6s").click(function(){
  $(".phone").css("width","300px");
  $(".screen").css("height","480px");
  $(".phonename").text($(this).text());
  button_audio.play();
});


var screen_audio=new Audio("http://www.monoame.com/awi_class/ballsound/click18.wav");

var page=0;

$(".sub_screen_right").click(function(){
  if (page<3){
	  page+=1;
	  $(".pages").css("left","-"+page*100+"%");
	  screen_audio.play();  
  }else{
	  button_audio.play();
  }
});

$(".sub_screen_left").click(function(){
  if (page>0){
	  page-=1;
	  $(".pages").css("left","-"+page*100+"%");
	  screen_audio.play();  
  }else{
	  button_audio.play();
  }
});




var home_audio=new Audio("http://www.monoame.com/awi_class/ballsound/click23.wav");
$(".button").click(function(){
  page=0;
  $(".pages").css("left","-"+page*100+"%");
  home_audio.play();
});

$(".turn").click(function(){
  $(".phone").css("transform","rotate(360deg)");
});

$(".start").click(function(){
  $(".phone").css("bottom","10px");
  button_audio.play();
});

var phone_appear=0;


$(".phone_start").click(function(){
	if(phone_appear){
		phone_appear=0;
		$(".phone").css("bottom","-630px");
		$(".phone_start").css("background-color","");
		$(".phone_notice").text(phone_appear);
	}else{
		phone_appear=1;
		$(".phone").css("bottom","10px");
		$(".phone_start").css("background-color","#26FF00");
		$(".phone_notice").text(phone_appear);

	}
  button_audio.play();
});


$(".buybtn").click(function(){
  $(".buybtn").text("已經購買");
  $(".buybtn").addClass("buyed");
});

$(".shutdown").click(function(){
  $(".phone").css("bottom","-800px");
  phone_appear=0;
  $(".phone_start").css("background-color","");
  button_audio.play();
});

$(".wiggle").click(function(){
  wiggletime=0;
  wiggle_audio.play();
});


/*
$(".phone_notice").click(function(){
    $(".phone_notice").removeClass("phone_noticeing");
  button_audio.play();

});
*/


var wiggle_audio=new Audio("http://www.monoame.com/awi_class/ballsound/phonevi.mp3");
var wiggletime=21;
setInterval(function(){

  	var n_friend = $(".phone_notice").text();
	if(n_friend==1)
    $(".phone_notice").addClass("phone_noticeing");

	
  if (wiggletime<=20){
    wiggletime+=1;
    console.log(wiggletime);
	    console.log("123");

    if (wiggletime%2==0){
      $(".phone").css("right",""+(-30)+"px");
    }else{
      $(".phone").css("right",""+(30)+"px");
    }
	
    if (wiggletime==21){
      $(".phone").css("right","");
    }
    
  }
},60);

var input_num;
var output_num_a=0;
var output_num_b=0;
var output_num_a_point=0;
var output_num_b_point=0;
var output_num_a_carry=0;
var output_num_b_carry=0;
var output_num_c=0;
var point_a=0;
var point_b=0;
var i=0;


var carry=0;
var operator=0;



$(".cal_1").click(function(){
	show_output(1);		
	home_audio.play();
});

$(".cal_2").click(function(){
	show_output(2);
	home_audio.play();
});

$(".cal_3").click(function(){
	show_output(3);
	home_audio.play();
});

$(".cal_4").click(function(){
	show_output(4);
	home_audio.play();
});

$(".cal_5").click(function(){
	show_output(5);
	home_audio.play();
});

$(".cal_6").click(function(){
	show_output(6);
	home_audio.play();
});

$(".cal_7").click(function(){
	show_output(7);
	home_audio.play();
});

$(".cal_8").click(function(){
	show_output(8);
	home_audio.play();
});

$(".cal_9").click(function(){
	show_output(9);
	home_audio.play();
});

$(".cal_0").click(function(){
	show_output(0);
	home_audio.play();
});

$(".cal_add").click(function(){
	i=0;
	operator=1;
	home_audio.play();
});

$(".cal_sub").click(function(){
	i=0;
	operator=2;
	home_audio.play();
});

$(".cal_mul").click(function(){
	i=0;
	operator=3;
	home_audio.play();
});

$(".cal_di").click(function(){
	i=0;
	operator=4;
	home_audio.play();
});

$(".cal_mod").click(function(){
	i=0;
	operator=5;
	home_audio.play();
});

$(".cal_na").click(function(){
	if(operator==0){
		output_num_a =output_num_a*-1;
		$(".cal_output").text(output_num_a);
	}else{
		output_num_b =output_num_b*-1;
		$(".cal_output").text(output_num_b);
	}	
	home_audio.play();
});

$(".cal_poi").click(function(){
	if(operator==0){
		point_a=1;
		$(".cal_output").text(output_num_a+".");
	}else{
		point_b=1;
		$(".cal_output").text(output_num_b+".");
	}	
	home_audio.play();
});


$(".cal_equal").click(function(){
	home_audio.play();
	if(operator==1){output_num_c = output_num_b + output_num_a;}
	if(operator==2){output_num_c = output_num_a - output_num_b;}
	if(operator==3){output_num_c = output_num_b * output_num_a;}
	if(operator==4){output_num_c = output_num_a / output_num_b;}
	if(operator==5){output_num_c = output_num_a % output_num_b;}
	$(".cal_output").text(output_num_c);
	clean();

});



function clean(){
	i=0;
	output_num_a=0;
	output_num_b=0;
	output_num_c=0;
	operator=0;
	point_a = 0;
	point_b = 0;
	output_num_a_point=0;
	output_num_b_point=0;
	output_num_a_carry=0;
	output_num_b_carry=0;
}

function show_output(input_num){
	if(operator==0){
		if(point_a==0){
			output_num_a *=10;
			output_num_a = output_num_a+input_num;
		}else{
			output_num_a_carry+=1;
			for(i;i<output_num_a_carry;i++){
				input_num=input_num/10;
			}
			output_num_a_point+=input_num;
			output_num_a=output_num_a+output_num_a_point;
		}
		$(".cal_output").text(output_num_a);
	}else{
		if(point_b==0){
			output_num_b *=10;
			output_num_b = output_num_b+input_num;
		}else{
			output_num_b_carry+=1;
			for(i;i<output_num_b_carry;i++){
				input_num=input_num/10;
			}
			output_num_b_point+=input_num;
			output_num_b=output_num_b+output_num_b_point;
		}
		$(".cal_output").text(output_num_b);
	}
}






$(".cal_ac").click(function(){
	clean();
	$(".cal_output").text(0);
	home_audio.play();
});


























