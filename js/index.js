$(function () {

    // 0.自定义滚动条
    $(".content-list").mCustomScrollbar();

    /*列表菜单*/

    var $audio = $("audio");
    var player = new Player($audio);
    var $progressBar = $(".music-progress-bar");
    var $progressLine = $(".music-progress-line");
    var $progressDot = $(".music-progress-dot");
    var progress = Progress($progressBar,$progressLine,$progressDot);

    progress.progressClick(function (value) {
        player.musicSeekTo(value);
    });
    progress.progressMove(function (value) {
        player.musicSeekTo(value);
    });

    // var $listMenu = $(".list-menu");
    // var $listMain = $(".list-main");
    // var $timer = $(".list-time>span");
    // var $time = $(".list-time>a");
    // for (var i = 0; i < $listMenu.length; i++) {
    //     (function (index) {
    //         $listMain.eq(index).hover(function () {
    //             $listMenu.eq(index).css({display : "block"});
    //             $timer.eq(index).css({display : "none"});
    //             $time.eq(index).css({display : "block"});
    //         },function () {
    //             $listMenu.eq(index).css({display : "none"});
    //             $timer.eq(index).css({display : "block"});
    //             $time.eq(index).css({display : "none"});
    //         });
    //     })(i);
    // } 高级排他思想

    /*新生成的list鼠标移出移入事件托管*/
    $(".music-list").delegate("li", "mouseenter", function () {
        $(this).find(".list-menu").stop().fadeIn(0);
        $(this).find(".list-time>span").stop().fadeOut(0);
        $(this).find(".list-time>a").stop().fadeIn(0);
    });
    $(".music-list").delegate("li", "mouseleave", function () {
        $(this).find(".list-menu").stop().fadeOut(0);
        $(this).find(".list-time>span").stop().fadeIn(0);
        $(this).find(".list-time>a").stop().fadeOut(0);
    });

    /*新生成的list鼠标移入移除a的事件托管*/
    $(".music-list").delegate(".list-menu>a", "mouseenter", function () {
        $(this).css({opacity : 1});
    });
    $(".music-list").delegate(".list-menu>a", "mouseleave", function () {
        $(this).css({opacity : 0.5});
    });

    // $(".list-main").hover(function () {
    //     $(this).find(".list-menu").stop().fadeIn(0);
    //     $(this).find(".list-time>span").stop().fadeOut(0);
    //     $(this).find(".list-time>a").stop().fadeIn(0);
    // },function () {
    //     $(this).find(".list-menu").stop().fadeOut(0);
    //     $(this).find(".list-time>span").stop().fadeIn(0);
    //     $(this).find(".list-time>a").stop().fadeOut(0);
    // });

    /*复选框点击事件*/
    // var $checkBox = $(".list-check>i")
    // $checkBox.on("click", function () {
    //     $(this).toggleClass("current");
    // });

    /*新生成的复选框点击事件托管*/
    $(".music-list").delegate(".list-check>i", "click", function () {
        $(this).toggleClass("current");
        var $className = $(this).hasClass("current");
        if ($className === true){
            $(this).css({opacity : 1});
        }else {
            $(this).css({opacity : 0.5});
        }
    });

    /*新生成的删除框的鼠标移入移出事件*/
    $(".music-list").delegate(".list-time>a", "mouseenter", function () {
        $(this).css({opacity : 1});
    });
    $(".music-list").delegate(".list-time>a", "mouseleave", function () {
        $(this).css({opacity : 0.5});
    });
    /*监听删除按钮的点击*/
    $(".music-list").delegate(".list-del", "click", function () {
        var $item = $(this).parents(".list-main");
        // 判断当前删除是否正在播放
        if ($item.get(0).index === player.currentIndex) {
            $(".music-next").trigger("click");
        }

        $item.remove();
        player.changeMusic($item.get(0).index);

        // 重新排序
        $(".list-main").each(function (index, ele) {
            ele.index = index;
            $(ele).find(".list-number").text(index + 1);
        });
    });

    $(".music-list").delegate(".list-menu-play", "click", function () {
        var $item = $(this).parents(".list-main");

        // console.log($item.get(0).index);
        // console.log($item.get(0).music);

        $(this).toggleClass("list-menu-play2");
        $item.siblings().find(".list-menu-play").removeClass("list-menu-play2");
        $item.siblings().find("div").css({color: "rgba(255,255,255,0.5)"});
        $item.siblings().find(".list-number").removeClass("list-number2");

        // 判断当前是播放还是暂停
        if ($(this).attr("class").indexOf("list-menu-play2") !== -1){
            $(".music-play1").addClass("music-play2");
            $item.find("div").css({color: "rgba(255,255,255,1)"});
            $item.find(".list-number").toggleClass("list-number2");
        }else {
            $(".music-play1").removeClass("music-play2");
            $item.find("div").css({color: "rgba(255,255,255,0.5)"});
            $item.find(".list-number").removeClass("list-number2");
        }

        // 播放音乐
        player.playMusic($item.get(0).index, $item.get(0).music);

        // 切换歌曲信息
        initMusicInfo($item.get(0).music);
        // 切换歌词信息
        initMusicLyric($item.get(0).music);
    });

    /*监听底部控制区域播放按钮的点击*/
    $(".music-play1").on("click", function () {
        if (player.currentIndex === -1) {
            // 没有播放过音乐
            $(".list-main").eq(0).find(".list-menu-play").trigger("click");
        }else {
            $(".list-main").eq(player.currentIndex).find(".list-menu-play").trigger("click");
        }
    });

    $(".music-pre").on("click", function () {
        $(".list-main").eq(player.preIndex()).find(".list-menu-play").trigger("click");
    });

    $(".music-next").on("click", function () {
        $(".list-main").eq(player.nextIndex()).find(".list-menu-play").trigger("click");
    });

    /*监听播放的进度*/
    player.$audio.on("timeupdate", function () {
        var duration = player.getMusicDuration();
        var currentTime = player.getMusicCurrentTime();

        var timeSrc = formatData(duration, currentTime);
        $(".music-progress-time").text(timeSrc);

        var value = currentTime / duration * 100;

        progress.setProgress(value);

        // 实现歌词的同步
        var index = lyric.currentIndex(currentTime);
        var $item = $(".song-lyric li").eq(index);
        $item.addClass("cur");
        $item.siblings().removeClass("cur");

        if (index <= 2) return;
        $(".song-lyric").css({
            marginTop : ((-index + 2) * 30)
        });
    });

    /*监听声音按钮的点击*/
    $(".music-voice-icon").on("click", function () {
        $(this).toggleClass("music-voice-icon2");

        if ($(this).attr("class").indexOf("music-voice-icon2") !== -1) {
            player.musicVoiceSeekTo(0);
        }else {
            player.musicVoiceSeekTo(1);
        }
    });
    var $voiceProgressBar = $(".music-voice-bar");
    var $voiceProgressLine = $(".music-voice-line");
    var $voiceProgressDot = $(".music-voice-dot");
    var voiceProgress = Progress($voiceProgressBar,$voiceProgressLine,$voiceProgressDot);

    voiceProgress.progressClick(function (value) {
        player.musicVoiceSeekTo(value);
    });
    voiceProgress.progressMove(function (value) {
        player.musicVoiceSeekTo(value);
    });


    /*加载歌曲列表*/
    function getPlayList() {
        $.ajax({
            url : "./source/musiclist.json",
            dataType : "json",
            success : function (data) {

                player.musicList = data;

                $.each(data, function (index, music) {
                    var $item = $("<li class='list-main'>" +
                        "<div class='list-check'><i></i></div>" +
                        "<div class='list-number'>"+ (index + 1) +"</div>" +
                        "<div class='list-name'>"+ music.name +"" +
                        "<div class='list-menu'>" +
                        "<a href='javascript:;' class='list-menu-play'></a>" +
                        "<a href='javascript:;'></a>" +
                        "<a href='javascript:;'></a>" +
                        "<a href='javascript:;'></a>" +
                        "</div>" +
                        "</div>" +
                        "<div class='list-singer'>"+ music.singer +"</div>" +
                        "<div class='list-time'>" +
                        "<a href='javascript:;' class='list-del'></a>" +
                        "<span>"+ music.time +"</span>" +
                        "</div>" +
                        "</li>");

                    $(".music-list").append($item);

                    $item.get(0).index = index;
                    $item.get(0).music = music;

                    return $item;
                });

                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error : function (e) {
                console.log(e);
            }
        });
    }

    getPlayList();

    /*初始化歌曲信息*/
    function initMusicInfo(music) {
        var $musicImg = $(".song-info-pic img");
        var $musicA = $(".song-info-name a");
        var $musicSinger = $(".song-info-player a");
        var $musicAblum = $(".song-info-ablum a");
        var $musicProName = $(".music-progress-name");
        var $musicProTime = $(".music-progress-time");
        var $musicMask = $(".mask_bg");

        $musicImg.attr("src", music.cover);
        $musicA.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProName.text(music.name + '/' + music.singer);
        $musicProTime.text('00:00' + ':' + music.time);
        $musicMask.css("background", "url('"+music.cover+"')");
    }



    /*初始化歌词信息*/
    var lyric;
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $(".song-lyric");
        // 清空上一首音乐的歌词
        $lyricContainer.html("");
        lyric.loadLyric(function () {
            // 创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>"+ ele +"</li>");
                $lyricContainer.append($item);
            })
        });
    }

    /*定义一个格式化时间的方法*/
    function formatData(duration, currentTime) {
        var endMin = parseInt(duration / 60);
        var endSec = parseInt(duration % 60);
        if (endMin < 10) {
            endMin = "0" + endMin;
        }else if (endMin = NaN){

        }
        if (endSec < 10) {
            endSec = "0" + eendSec;
        }

        var startMin = parseInt(currentTime / 60);
        var startSec = parseInt(currentTime % 60);
        if (startMin < 10) {
            startMin = "0" + startMin;
        }
        if (startSec < 10) {
            startSec = "0" + startSec;
        }

        return startMin+":"+startSec + " / " + endMin+":"+endSec;
    }
});


