    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const playlist = $(".playlist");
    const audio = $("#audio");
    const playBtn = $(".btn-toggle-play");
    const player = $(".player");
    const progress = $("#progress");
    const cdThumb = $(".cd-thumb");
    const btnNext = $(".btn-next");
    const btnPrev = $(".btn-prev");
    
    
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
      isPlaying: false,
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
          transform: 'rotate(180deg)'
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
            
          }
          
        }

        progress.oninput = function(e){
          const seek = audio.duration * e.target.value / 100;
          audio.currentTime = seek;
          
        }

        btnNext.onclick = function(){
          app.nextSong();
          audio.play();
        }

        btnPrev.onclick = function(){
          app.prevSong();
          audio.play();
        }


      },

      
      defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
          get: function(){
              return this.songs[this.currentIndex]
          }
        })
      },



      loadCurrent: function(){
        const cdThumb = $('.cd-thumb');
        const heading = $('header h2');

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
      },

      nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.loadCurrent();
      },

      prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1;
        }
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