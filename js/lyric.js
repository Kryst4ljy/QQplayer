(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        // 属性
        constructor : Lyric,

        init : function (path) {
            this.path = path;
        },
        times : [],
        lyrics : [],
        index : -1,

        loadLyric : function (callBack) {
            var $this = this;
            $.ajax({
                url : $this.path,
                dataType : "text",
                success : function (data) {
                    $this.ParseLyric(data);
                    callBack();
                },
                error : function (e) {
                    console.log(e);
                }
            });
        },
        ParseLyric : function (data) {
            var $this = this;
            // 一定要清空上一首歌的歌词和时间
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            // console.log(array);
            // 遍历取出每一行歌词
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            $.each(array, function (index, ele) {
                // 处理歌词
                var lrc = ele.split("]")[1];
                // 排除空字符串(没有歌词的)
                if (lrc.length === 1) return true;
                $this.lyrics.push(lrc);

                // console.log(ele);

                var res = timeReg.exec(ele);
                // console.log(res);
                if (res === null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                $this.times.push(time);


            });
        },

        currentIndex : function (currentTime) {
               // console.log(currentTime);
            if (currentTime >= this.times[0]) {
                this.index++;
                this.times.shift();
            }
            return this.index;
        }

    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);