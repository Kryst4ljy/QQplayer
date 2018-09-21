(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        // 属性
        constructor : Player,
        musicList : [],

        init : function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },

        currentIndex : -1,
        playMusic : function (index, music) {
            if (index === this.currentIndex) {
                // 同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                }else {
                    this.audio.pause();
                }
            }else {
                // 不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },

        preIndex : function () {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },

        nextIndex : function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        },

        changeMusic : function (index) {
            this.musicList.splice(index, 1);

            // 判断当前删除的是否是正在播放音乐的前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },

        getMusicDuration : function () {
            return this.audio.duration;
        },
        getMusicCurrentTime : function () {
            return this.audio.currentTime;
        },

        musicSeekTo : function (value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },

        musicVoiceSeekTo : function (value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1) return;
            // console.log(value);
            // 0-1
            this.audio.volume = value;

        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);