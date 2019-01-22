$(function(){
  $('.close-btn').click(function(){
    $(this).parent().hide().parents('.popup-wrap').hide();
  });

  $('.popup-buttons > a').click(function(){
    $(this).parents('.popup').hide().parents('.popup-wrap').hide();
  })
});
/*
* times: 剩余的抽奖次数
* tab: 抽奖记录和说明的切换
* current: 抽奖的 当前高亮
* begin: 开始的位置
* isRunning: 抽奖进行时
* sendData: 发送的txt
* prizeNumber: 抽奖的是现金的 值
* isLogin: 是否登录
* records: 记录的html字符串
* */
var vm = new Vue({
  el: '#app',
  data: {
    times: 0,
    tab: 1,
    current: 0,
    begin: 1,
    isRunning: false,
    sendData: null,
    prizeNumber: null,
    isLogin: true,
    records: null
  },
  created:function(){
    this.times = window.endTimes;
  },
  methods: {
    start:function () {
      if (this.isRunning) return;
      var res = this.makeData();
      if(this.isLogin === false){
        $('.popup.login-popup').show().parents('.popup-wrap').show();
      }else if(this.times <= 0){
        $('.popup.noTimes-popup').show().parents('.popup-wrap').show();
      }else{
        // $.ajax({
        //   methods: 'GET',
        //   url: '',
        //   dataType: 'json',
        //   data: {txt:this.sendData},
        //   success: function(data){
        //  模拟数据
        var data = {
          'state': 1
        };
          if(data.state == 0){
            $('.popup.login-popup').show().parents('.popup-wrap').show();
          }else if(data.state == 2){
            $('.popup.noTimes-popup').show().parents('.popup-wrap').show();
          }else{
            this.game(res);
            console.log(this.sendData);
          }
        //
        //   }
        // });
      }
    },
    game: function (res) {
        this.isRunning = true;
        this.current = 0;
        this.begin = 1;
        var index = 48;
        // let res = this.test();
        index = Number(index) + Number(res);
        var interval1 = setInterval(function(){
          var currentIndex = vm.begin % 8;
          if (currentIndex === 0) {
            vm.current = 8;
          } else {
            vm.current = currentIndex;
          }
          if (vm.begin >= index) {
            vm.isRunning = false;
            clearInterval(interval1);
            if(vm.sendData == 0){
              $('.popup.fail-popup').show().parents('.popup-wrap').show();
            }else if(vm.sendData == 5){
              $('.popup.hongbao-popup').show().parents('.popup-wrap').show();
            }else{
              $('.popup.xianjin-popup').show().parents('.popup-wrap').show();
            }
            vm.times--;
          } else {
            vm.begin++;
          }
        }, 50);
    },
    getRecords: function(){
      if(this.isLogin == false){
        $('.popup.login-popup').show().parents('.popup-wrap').show();
      }else{
        this.tab = 0;
        // $.ajax({
        //   url: '',
        //   method: 'GET',
        //   dataType: 'json',
        //   success: function(data){
              var data = {
                res: `
                  <p class="record-date">2019年1月28日</p>
                  <ul class="record-items">
                    <li class="record-item"><span>第1次</span><span>20元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>2元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>20元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>2元现金</span></li>
                  </ul>
                  <p class="record-date">2019年1月28日</p>
                  <ul class="record-items">
                    <li class="record-item"><span>第1次</span><span>20元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>2元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>20元现金</span></li>
                    <li class="record-item"><span>第1次</span><span>2元现金</span></li>
                  </ul>
                `
              };

              vm.records = data.res;
        //   }
        // })
      }
    },
    makeData: function () {
      var result = this.getPrize();
      if (result == 1) {
        console.log('10元现金');
        this.sendData = 2;
        this.prizeNumber = 10;
      } else if (result == 2 || result == 6) {
        console.log('50元红包');
        this.sendData = 5;
      } else if (result == 3) {
        console.log('20元现金');
        this.sendData = 4;
        this.prizeNumber = 20;
      } else if (result == 4 || result == 8) {
        console.log('5元现金');
        this.sendData = 1;
        this.prizeNumber = 5;
      } else if (result == 5) {
        console.log('谢谢参与');
        this.sendData = 0;
      } else if (result == 7) {
        console.log('15元现金');
        this.sendData = 3;
        this.prizeNumber = 15;
      }
      return result;
    },
    getPrize: function () {
      var lucks = [5, 30, 0.1, 5, 13.9, 30, 1, 5];
      var items = [1, 2, 3, 4, 5, 6, 7, 8];
      return this.goodLuck(items, lucks);
    },
    goodLuck: function (obj, luck) {
      var sum = 0, factor = 0, random = Math.random();
      for (var i = luck.length - 1; i >= 0; i--) {
        sum += luck[i];
      }
      random *= sum;
      for (var i = luck.length - 1; i >= 0; i--) {
        factor += luck[i];
        if (random <= factor) return obj[i];
      }
      return null;
    }
  }
});
