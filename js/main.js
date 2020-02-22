var vidas = 3;
var ready = false;
var width = $(window).width();
var height = $(window).height();
var gameTl = new TimelineMax({delay:0.5});  
var clockTl = new TimelineMax({delay:0.5});
var time = 20;
var cTono = 0;
var cMelvin = 0;
var cCornelio = 0;
var multiplier = 1.6;
var groups = [0, 10, 16, 22];
var muted = false;
var tutorial = true;
var dataDrag = [0,
    [2,2,1,2,3,3,2,3,1,1],
    [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1],
    [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,2]
]
var Order = [0,
    {
        top:[30,50,40,60,50,75,70,70,68,80],
        left:[115,85,125,160,210,40,90,110,170,220]
    },
    {
        top:[55,45,30,0,35,60,68,95,78,60,30,45,80,55,78,82],
        left:[165,50,250,150,165,-15,37,185,105,315,130,120,260,230,215,60]
    },
    {
        top:[88,117,55,20,70,70,75,100,100,90,30,45,80,55,78,105,75,100,60,115,95,120],
        left:[165,30,60,160,140,315,25,105,105,265,130,120,220,230,215,60,175,330,195,280,-18,175]
    }
] 
var images = []
var progress = 0;
var nivel = 1;
var gameState;
var nivelTl;
var manoTl;
var audiosIndex = 0;
var clockSound;
var bgSound;
(function initAll() {

    createjs.Sound.alternateExtensions = ["wav"];
    createjs.Sound.registerSound({ id: "BG", src: "./assets/audios/Positive_Music.mp3" });
    createjs.Sound.registerSound({ id: "CLOCK", src: "./assets/audios/reloj-tic-tac-.mp3" });
    createjs.Sound.registerSound({ id: "LVL", src: "./assets/audios/Magic_Chime.mp3" });
    createjs.Sound.registerSound({ id: "DROP", src: "./assets/audios/Pop.mp3" });
    createjs.Sound.registerSound({ id: "ERROR", src: "./assets/audios/Wood_Plank_Flicks.mp3" });
    createjs.Sound.on("fileload", handleFileLoad);
   
   $("#vidas img").attr('src','assets/Vidas_'+vidas+'.png');
    gameState = groups[nivel];
    if(width < 768){
        multiplier = 1.6
        multiplier = 1.6
    }else{
        multiplier = 1.3;   
    }
    Timer();
    clockTl.pause();
    clockTl.seek(0);
    preload(assets);
    pepInit();

})()
function ie() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
       return false;
    }
    else  // If another browser, return 0
    {
       return true;
    }
}
function handleFileLoad(event) {
    audiosIndex++;

    if (audiosIndex == 5) {
       
         var props = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1, volume: 0.2})
        //  bgSound = createjs.Sound.play("BG", props);
    }
}
function Timer () {
    clockTl
    .add(TweenLite.to("#pie1",(time + (nivel * 5)),{rotation:"+=180", ease: Power0.easeNone, onComplete:function(){
            $("#clock").removeClass("clip");
            $("#pie2").removeClass("hide").addClass("show");
        }}))
    .add(TweenLite.to("#pie1",time + (nivel * 5),{rotation:"+=180", ease: Power0.easeNone,onComplete:function(){
       
        vidas--;
		if (vidas > 0) {
			// Descontar vida.
			
            nextLvl(nivel);
            $("#vidas img").attr('src','/assets/Vidas_'+vidas+'.png');
            TweenLite.to("#vidas img",.3,{rotationX:"+=360", ease: Power0.easeNone}) 
        }else{
            gameOver(false);
        }
        clockTl.pause();
        clockTl.seek(0);
    }}))
}
function nextLvl(n) {
    clockSound.stop();
    if (n != nivel) {
     
        //createjs.Sound.play("LVL", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 1600, volume: 1 });

    }
    if (n == undefined) {
      
        n = nivel + 1;
    }
    nivel = n;
    clockTl.pause();
    clockTl.seek(0);


    $("#shadow").removeClass("none");
    $("#mano").css({ 'opacity': '1', 'left': '-100px', 'top': '-100px' });
    $("#ojuela").css({ 'opacity': '0' });
    $(".topUI").css({ 'opacity': '0' });


    $("#drags_container").empty();
    $("#clock").addClass("clip");
    $("#pie2").removeClass("show").addClass("hide");

    // $("#nivel img").attr('src','./assets/Nivel_'+n+'.png');
    //TweenLite.to("#nivel img",.3,{rotationX:"+=360", ease: Power0.easeNone,})
    gameTl = new TimelineMax({ delay: 0.5 });

    $("#tono").css({ 'margin-top': '0px' });
    $("#melvin").css({ 'margin-top': '0px' });
    $("#cornelio").css({ 'margin-top': '0px' });

    $("#cTono").css({ 'opacity': '0' });
    $("#cMelvin").css({ 'opacity': '0' });
    $("#cCornelio").css({ 'opacity': '0' });
    gameState = groups[nivel];
    cTono = 0;
    cMelvin = 0;
    cCornelio = 0;

    pepInit();
    Init();

}
function hand() {
    var element = $("#drag10");
    var x = element;
    var y = $("#tono");



    var topVal = Math.floor(element.offset().top)
    var leftVal = Math.floor(element.offset().left)


    element.addClass("pep-active");
    manoTl = new TimelineMax();
    manoTl
        .add(TweenMax.fromTo("#mano", 1.5, { top: 0, left: 0 }, {
            top: (x.offset().top), left: (x.offset().left), ease: Power1.easeNone, onComplete: function () {

                $("#ojuela").css({ opacity: 1 });
                $("#drag10").addClass("none");

            }
        }))
        .add("END", 1.8)
        .to("#mano", 1.2, {
            top: (y.offset().top) + y.height(), left: (y.offset().left) + (y.width() / 6), ease: Power1.easeNone, onComplete: function () {

                createjs.Sound.play("DROP", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 400, volume: 0.5 });
                gameState--
                updateCounter(1);
                $("#shadow").addClass("hide").removeClass("show");
                tutorial = false;
                nivelAnim();

            }
        }, "END")
        .to("#ojuela", .9, { top: -20 }, "END")
        .to("#mano", .1, { opacity: 0 }, "MANOFF")
}
function preload(imageArray, index) {
    
    var percent = Math.floor(progress * 100 / imageArray.length);
    if(percent%5 == 0){
        $("#loader").attr("src","./assets/loader/"+percent+".png")
    }

    if(index == imageArray.length){

       
      
        setTimeout(function () {

       

        ready = true;
            $("#loader").attr("src","./assets/toca_para_jugar.gif");
            $("#loader").css({'width':'255px'});
       }, 500)
       
    }

    index = index || 0;
    if (imageArray && imageArray.length > index) {
        var img = new Image ();
        img.onload = function() {
            progress++;
            preload(imageArray, index + 1);
        }
        img.src = imageArray[index];
    }

}

function Init(){
 
    $(".target").css({opacity:1})
    gameTl.
    add(TweenMax.fromTo("#target-1",.4,{css:{scale:0}},{css:{scale:1}},Power0.easeNone)).
    add(TweenLite.to("#tono",.3,{marginTop:"-207"},Power0.easeNone)).

    add(TweenMax.fromTo("#target-2",.4,{css:{scale:0}},{css:{scale:1}},Power0.easeNone)).
    add(TweenLite.to("#melvin",.3,{marginTop:"-178"},Power0.easeNone)).

    add(TweenMax.fromTo("#target-3",.4,{css:{scale:0}},{css:{scale:1}},Power0.easeNone)).
    add(TweenLite.to("#cornelio",.3,{marginTop:"-207"},Power0.easeNone));

    

    $('#drags_container .drag').each(function(index){
        a = $(this).width();
        var j = index+1;
        var el = "#drag"+j;
        if(j != groups[nivel]){
            gameTl.add(TweenLite.to(el,.1,{css:{opacity:"1"}, onComplete:function(){
            //    $(el).attr('src','./assets/Ceriales'+nivel+'/'+j+'.png')
    
            }},Power0.easeNone));
        }else{
            gameTl.add(TweenLite.to(el,.1,{css:{opacity:"1"},  onComplete:function(){


                if (nivel == 1 && tutorial == true) {
                    $("#shadow").removeClass("hide").addClass("show");
                    setTimeout(function () {
                        hand();
                    }, 500);
                } else {
                    nivelAnim();
                }


            }},Power0.easeNone));
        }
        
    });
         
}
function nivelAnim() {

    nivelTl = new TimelineMax();
    nivelTl.
        add(TweenLite.to(".topUI", .2, { opacity: 1 })).
        add(TweenLite.to("#nivel img", .2, { scale: 1.3, ease: Power0.easeNone, })).
        add(TweenLite.to("#nivel img", .2, {
            rotationX: "+=360", ease: Power0.easeNone, onComplete: function () {

                createjs.Sound.play("LVL", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 1600, volume: 1 });
                clockSound = createjs.Sound.play("CLOCK", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 1000, loop: -1, volume: 0.4 });

                $("#shadow").addClass("none");
                $("#nivel img").attr('src', './assets/Nivel_' + nivel + '.png');
                clockTl.resume();




                pageReady = true;
                TweenMax.fromTo("#pie1", time * 2, { backgroundColor: "#FF8400", ease: Power2.easeIn }, { backgroundColor: "red", ease: Power3.easeIn })
                TweenMax.fromTo("#pie2", time * 2, { backgroundColor: "#FF8400", ease: Power2.easeIn }, { backgroundColor: "red", ease: Power3.easeIn })

            }
        })).
        add(TweenLite.to("#nivel img", .2, { scale: 1, ease: Power0.easeNone, }));
}
function pepInit(){

    for (var i = 0; i < groups[nivel]; i++) {
        
        var el = i + 1;
         $("#drags_container").append('<img id="drag'+el+'" src="./assets/Ceriales'+nivel+'/'+el+'.png" class="drag" data-drag="'+dataDrag[nivel][i]+'" alt="">');
    }
    $('.drag').pep({

        droppable: '.drop_target',
        allowDragEventPropagation: false,
        overlapFunction: false,
        useCSSTranslation: ie(),
        cssEaseDuration: 0,
        multiplier:multiplier,
        revert: true,
        revertIf: function(ev, obj){
            var drop = this;
            var obj = this.$el;
            return _evalual(drop, obj);
        },
        rest: function(ev, obj){ handleOnDrop(obj, obj.$el); }
    });

    $('.drag').each(function(index){
        $(this).css({
            'top':Order[nivel].top[index]+'px',
            'left':Order[nivel].left[index]+'px',
            'opacity':'0',
        });
    });

    return true;
}

function _evalual(drop, obj){
    var set = drop.activeDropRegions;
    var dragIndex = parseInt(obj.attr('data-drag'));
    var dropIndex = parseInt($(drop.activeDropRegions[0]).attr('data-drop'));
  
        if(dropIndex  == dragIndex){
            createjs.Sound.play("DROP", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 400, volume: 0.5 });
            gameState--
            updateCounter(dragIndex);
            obj.addClass("none");
         
            if(gameState == 0){
              
                if(nivel == 3){
                    gameOver(true)
                }else{
                    nextLvl()
                }
            }

            return false;
        }else{
            createjs.Sound.play("ERROR", { interrupt: createjs.Sound.INTERRUPT_ANY, offset: 50, volume: 0.5 });
            return true;
        }
}

function gameOver(state){
    clockTl.pause();
    clockTl.seek(0);
    clockSound.stop();
    bgSound.stop();
    $('.drag').removeClass("drag");
    $(".gameContainer").removeClass("show").addClass("hide");
    $(".gameContainer").hide();
    if(!state){ 
        $("#lose_view").removeClass("none");
    }else{
		gana();
    }
}
function mute() {
    if (!muted) {
        $("#cta_sonido img").attr('src', './assets/No_sound.png');
        bgSound.stop();
        muted = true;
    } else {
        bgSound.play();
        muted = false;
        $("#cta_sonido img").attr('src', './assets/Sonido.png');
    }
}
function updateCounter(which){
    switch (which) {
        case 1:
            cTono++
            $("#cTono").css({opacity:1})
            $("#cTono p").text(cTono);
            TweenMax.fromTo("#cTono",.3,{css:{scale:.9}},{css:{scale:1.2}},Power0.easeNone)
            break;
        case 2:
            cMelvin++
            $("#cMelvin").css({opacity:1})
            $("#cMelvin p").text(cMelvin);
            TweenMax.fromTo("#cMelvin",.3,{css:{scale:.9}},{css:{scale:1.2}},Power0.easeNone)
            break;
        case 3:
            cCornelio++
            $("#cCornelio").css({opacity:1})
            $("#cCornelio p").text(cCornelio);
            TweenMax.fromTo("#cCornelio",.3,{css:{scale:.9}},{css:{scale:1.2}},Power0.easeNone)
            break;
    
        default:
            break;
    }
}

$("#cta_instruccions").click(function () {
    clockSound.stop();
    if (width < 600) {
        $("#popup").attr('src', './assets/Como_jugar_mobile.png').attr('width', '260px')
        $("#cta_close").css({ 'width': '32px', 'top': '-5px', 'right': 'px' })
    }
    $("#how_view").removeClass("none");

    //piezas.pause();
    clockTl.pause();
    TweenLite.to("#cta_close", .3, { rotationX: "+=360", ease: Power0.easeNone, })
});
$("#cta_instruccions").hover(function () {
    $("#cta_instruccions img").attr('src', './assets/info.png')
}, function () {
    $("#cta_instruccions img").attr('src', './assets/instrucciones.png')
});
$("#cta_close").click(function () {
    clockSound.play();
    $("#how_view").addClass("none");
    //piezas.resume();
    clockTl.resume();
})
$("#loader_container").click(function(){

	

   if(ready){
   
        $("#loader_view").fadeOut("fast", function() {
            $("#loader_view").addClass("none");
            $(".gameContainer").removeClass("hide").addClass("show");
            Init();
        });
        bgSound = createjs.Sound.play("BG");
       
   }

})
$("#cta_sonido").click(function () {

    mute();
});
$("#cta_sonido").hover(function () {

    if (!muted) {
        $("#cta_sonido img").attr('src', './assets/No_sound.png');
    }

}, function () {
    if (!muted) {
        $("#cta_sonido img").attr('src', './assets/Sonido.png');
    }
});
// function descuentaVida() {
// 	$.post("/Juego/DescuentaVida", function () {
// 		$(".vidas-usr").text(vidas - 1);
// 	});
// }

function gana() {
    window.location.reload();
}
