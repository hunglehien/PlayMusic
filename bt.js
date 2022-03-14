    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const playlist = $(".playlist");
    const audio = $("#audio");
    const heading = $('header h2');
    const playBtn = $(".btn-toggle-play");
    const player = $(".player");
    const progress = $("#progress");
    const cdThumb = $(".cd-thumb");
    const btnNext = $(".btn-next");
    const btnPrev = $(".btn-prev");
    const btnRandom = $(".btn-random");
    const btnRepeat = $(".btn-repeat");
    const currenttime = $("#currentTime");
    const durtimeText = $("#durtimeText");
    const volumeSlider = $("#volumeSlider");
    const volumeToggle = $("#mutebn");
    const inputVolume = $("#volumeSlider");
    
    const app = {
      songs: [
        {
            name:'Roi Toi Luôn',
            singer:'Nal',
            image:'./images/roi-toi-luon.jpeg',
            path:'./audio/roi-toi-luon.mp3'
        },

        {
            name:'Thien Dang',
            singer:'Wowwy & Jolipoli',
            image:'./images/thien-dang.jpeg',
            path:'./audio/thien-dang.mp3'
        },

        {
            name:'Hoa Hai Duong',
            singer:'Jack',
            image:'./images/hoa-hai-duong.jpeg',
            path:'./audio/hoa-hai-duong.mp3'
        },
    
        {
            name:'Sau Hong Gai',
            singer:'G5R Squad',
            image:'./images/sau-hong-gai.jpeg',
            path:'./audio/sau-hong-gai.mp3'
        },
    
        {
            name:'Thuong Nhau Toi Ben',
            singer:'Nal',
            image:'./images/thuong-nhau-toi-ben.jpeg',
            path:'./audio/thuong-nhau-toi-ben.mp3'
        },
    
        {
            name:'Khue Moc Lang',
            singer:'Huong Ly',
            image:'./images/khue-moc-lang.jpeg',
            path:'./audio/khue-moc-lang.mp3'
        }
    ],
      isRepeat: false,
      isRandom: false,
      isPlaying: false,
      isMute: false,
      currentIndex: 0,
      render: function(){
        const html = this.songs.map((song, index) => {
            return `
                              <div class="song ${
                                index === this.currentIndex ? "active" : ""
                              }" data-index="${index}">
                              
                                  <div class="thumb"
                                      style="background-image: url('${song.image}')">
                                  </div>
                                  <div class="body">
                                      <h3 class="name">${song.name}</h3>
                                      <p class="author">${song.singer}</p>
                                  </div>
                                  <div class="option">
                                      <i class="fas fa-ellipsis-h"></i>
                                  </div>
                              </div>
                          `;
          });
          playlist.innerHTML = html.join('');
      },

      handleEvent: function() {

        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        const cdThumbAnime =  cdThumb.animate({
          transform: 'rotate(360deg)'
        }, {
          duration: 10000,
          iterations: Infinity
        });

        cdThumbAnime.pause();

        
        
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        btnRandom.onclick = function(){
          app.isRandom = !app.isRandom;
          
            btnRandom.classList.toggle('active');
          
        }

        volumeSlider.oninput = function(){
          audio.volume = volumeSlider.value / 100;
          
        }

        btnRepeat.onclick = function(){
          app.isRepeat = !app.isRepeat;

                btnRepeat.classList.toggle('active');
             
        }


        volumeToggle.onclick = function(){
          app.isMute = !app.isMute;
          volumeToggle.classList.toggle('isMute');

          if (app.isMute){
              app.muteSong()
              inputVolume.style = 'display:none';
          }

          else {
            audio.volume = volumeSlider.value / 100;
            inputVolume.style = 'display:block';
          }
        }

        playBtn.onclick = function(){
          if(app.isPlaying) {
            audio.pause();
            cdThumbAnime.pause();
          }

          else {
            audio.play();
            cdThumbAnime.play();
          }
        }

        audio.onplay = function(){
          app.isPlaying = true;
          player.classList.add('playing')
          
        }

        audio.onpause = function(){
          app.isPlaying = false;
          player.classList.remove('playing');
          
        }

        audio.ontimeupdate = function(){
          if (audio.duration) {
            var progressUpdate = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressUpdate;
            var curmin = Math.floor(audio.currentTime / 60);
            var cursec = Math.floor(audio.currentTime - curmin * 60);
            var durmin = Math.floor(audio.duration / 60);
            var dursec = Math.floor(audio.duration - durmin * 60);
            if (cursec < 10) {cursec = "0"+cursec;}
            if (curmin < 10) {curmin = "0"+curmin;}
            if (dursec < 10) {dursec = "0"+dursec;}
            if (durmin < 10) {durmin = "0"+durmin;}

          currenttime.innerHTML = curmin +":"+cursec;
          durtimeText.innerHTML = durmin +":"+dursec;
          }
          
        }

        progress.oninput = function(e){ 
          const seek = audio.duration * e.target.value / 100;
          audio.currentTime = seek;

          

          audio.play();
        }

        audio.onended = function(){
          if (app.isRepeat) {
            app.isRandom = false;
            audio.play();
          }
          else{
            btnNext.click();
          }
          
        }

        btnNext.onclick = function(){
          if (app.isRandom) {
            app.playRandomSong()
          }
          else{
            app.nextSong();
          }
          
          audio.play();
        }

        btnPrev.onclick = function(){
          if (app.isRandom){
            app.playRandomSong()
          }
          else{
            app.prevSong();;
          }
          
          audio.play();
        }

        playlist.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)');
          const clickedSong = songNode.closest('.song');
          if (songNode || e.target.closest('.option')){
            if (songNode) {
              app.currentIndex = songNode.getAttribute('data-index');
              app.loadCurrent();
              playlist.querySelector('.song.active').classList.remove('active');
              clickedSong.classList.add('active');
              audio.play();
            }
          }
        }


      },

      muteSong: function() {
        audio.volume = 0;
      },

      playRandomSong: function() {
        let newIndex;
        do {
          newIndex  = Math.floor(Math.random() * app.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrent();
        this.activeSong();
      },



      
      defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
          get: function(){
              return this.songs[this.currentIndex]
          }
        })
      },



      loadCurrent: function(){

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
      },

      activeSong: function() {
        const itemSong = $$('.song')
        itemSong.forEach((item, index) => {
            if(index === this.currentIndex) {
                item.classList.add('active')
            } else {
                item.classList.remove('active')
            }
        })
    },

    activeSong2: function(){
      var loopSongs = $$('.song');
      for (song of loopSongs){
              song.classList.remove('active')
      }
      const activeSong = loopSongs[this.currentIndex]
      activeSong.classList.add('active')
  },

      nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.activeSong();
        this.loadCurrent();
        
      },

      prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1;
        }
        this.activeSong();
        this.loadCurrent();
        
      },

      


      start: function() {
        this.defineProperties();
        this.handleEvent();
        this.render();
        this.loadCurrent();
        
      }
  }

  app.start();