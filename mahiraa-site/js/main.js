/* Mahiraa Designer Studio, interactions */
(function(){
  "use strict";
  var $ = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  $("#year").textContent = new Date().getFullYear();

  /* Header: transparent -> solid */
  var header = $("#siteHeader");
  var onScroll = function(){ header.classList.toggle("solid", window.scrollY > window.innerHeight * 0.55); };
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  /* Drawer */
  var drawer = $("#drawer");
  $("#hamburger").addEventListener("click", function(){ drawer.classList.add("open"); });
  $("#drawerClose").addEventListener("click", function(){ drawer.classList.remove("open"); });
  $$("#drawer a").forEach(function(a){ a.addEventListener("click", function(){ drawer.classList.remove("open"); }); });

  /* ---------- HERO slideshow (auto, in place of video) ---------- */
  var slides = $$(".hero-slide"), dotsWrap = $("#heroDots"), idx = 0, timer = null, paused = false;
  slides.forEach(function(_, i){
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Slide " + (i+1));
    if(i===0) b.classList.add("active");
    b.addEventListener("click", function(){ go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = $$("button", dotsWrap);
  function go(i){
    slides[idx].classList.remove("active"); dots[idx].classList.remove("active");
    idx = (i + slides.length) % slides.length;
    // restart Ken Burns animation
    var s = slides[idx]; s.style.animation = "none"; void s.offsetWidth; s.style.animation = "";
    s.classList.add("active"); dots[idx].classList.add("active");
  }
  function restart(){ if(timer) clearInterval(timer); if(!paused) timer = setInterval(function(){ go(idx+1); }, 5000); }
  $("#heroNext").addEventListener("click", function(){ go(idx+1); restart(); });
  $("#heroPrev").addEventListener("click", function(){ go(idx-1); restart(); });
  $("#heroPause").addEventListener("click", function(){
    paused = !paused;
    $("#heroPause").textContent = paused ? "▶" : "❚❚";
    restart();
  });
  restart();

  /* ---------- GALLERY data ---------- */
  var G = {
    lehengas: { label:"Lehenga", files:["lehenga-1.jpeg","lehenga-2.jpeg","lehenga-3.jpeg","lehenga-4.jpeg","lehenga-5.jpeg","lehenga-6.jpeg","lehenga-7.jpeg","lehenga-8.jpeg","lehenga-9.jpeg","lehenga-10.jpeg","lehenga-11.jpeg","lehenga-12.jpeg","lehenga-13.jpeg","lehenga-14.jpeg","lehenga-15.jpeg","lehenga-16.jpeg","lehenga-17.jpeg","lehenga-18.jpeg","lehenga-19.jpeg","lehenga-20.jpeg","lehenga-21.jpeg","lehenga-22.jpeg"] },
    blouses: { label:"Blouse", files:["Mahiraa-Designer-Studio-40.jpeg","Mahiraa-Designer-Studio-45.jpeg","Mahiraa-Designer-Studio-65.jpeg","Mahiraa-Designer-Studio-33.jpeg","Mahiraa-Designer-Studio-50.jpeg","Mahiraa-Designer-Studio-34.jpeg","Mahiraa-Designer-Studio-38.jpeg","Mahiraa-Designer-Studio-41.jpeg"] },
    gowns: { label:"Gown / Saree", files:["Mahiraa-Designer-Studio-10.jpeg","Mahiraa-Designer-Studio-55.jpeg","Mahiraa-Designer-Studio-60.jpeg","Mahiraa-Designer-Studio-15.jpeg","Mahiraa-Designer-Studio-20.jpeg","Mahiraa-Designer-Studio-43.jpeg","Mahiraa-Designer-Studio-5.jpeg","Mahiraa-Designer-Studio-6.jpeg"] },
    atelier: { label:"Atelier", files:["Mahiraa-Designer-Studio-25.jpeg","Mahiraa-Designer-Studio-28.jpeg","Mahiraa-Designer-Studio-3.jpeg","Mahiraa-Designer-Studio-12.jpeg"] }
  };
  var PREVIEW = 5, cat = "lehengas", expanded = false;
  var grid = $("#grid");

  function render(){
    grid.innerHTML = "";
    var files = G[cat].files;
    var show = expanded ? files : files.slice(0, PREVIEW);
    show.forEach(function(f, i){
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.loading = "lazy"; img.src = "images/" + f;
      img.alt = G[cat].label + " " + (i+1) + ", Mahiraa Designer Studio";
      img.onerror = function(){ fig.style.display = "none"; };
      var cap = document.createElement("figcaption");
      cap.textContent = G[cat].label + " " + (i+1) + " · tap to view";
      fig.appendChild(img); fig.appendChild(cap);
      fig.addEventListener("click", function(){ openLB(files, files.indexOf(f)); });
      grid.appendChild(fig);
    });
    $("#exploreMore").textContent = expanded ? "Show top 5 only ↑" : ("Explore all " + files.length + " in this craft →");
  }
  $$("#tabs .tab").forEach(function(t){
    t.addEventListener("click", function(){
      $$("#tabs .tab").forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active"); cat = t.dataset.cat; expanded = false; render();
    });
  });
  // deep links: nav/footer data-tab
  $$('[data-tab]').forEach(function(a){
    a.addEventListener("click", function(){
      var c = a.dataset.tab;
      if(G[c]){ cat = c; expanded = false;
        $$("#tabs .tab").forEach(function(x){ x.classList.toggle("active", x.dataset.cat===c); });
        render();
      }
    });
  });
  $("#exploreMore").addEventListener("click", function(){ expanded = !expanded; render(); });
  render();

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount"), lbFiles = [], lbIdx = 0;
  function openLB(files, i){ lbFiles = files; lbIdx = i; updateLB(); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function updateLB(){ lbImg.src = "images/" + lbFiles[lbIdx]; lbCount.textContent = (lbIdx+1) + " / " + lbFiles.length + " · " + lbFiles[lbIdx]; }
  function closeLB(){ lb.classList.remove("open"); document.body.style.overflow = ""; }
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbNext").addEventListener("click", function(){ lbIdx = (lbIdx+1)%lbFiles.length; updateLB(); });
  $("#lbPrev").addEventListener("click", function(){ lbIdx = (lbIdx-1+lbFiles.length)%lbFiles.length; updateLB(); });
  lb.addEventListener("click", function(e){ if(e.target===lb) closeLB(); });
  document.addEventListener("keydown", function(e){ if(!lb.classList.contains("open")) return; if(e.key==="Escape") closeLB(); if(e.key==="ArrowRight") $("#lbNext").click(); if(e.key==="ArrowLeft") $("#lbPrev").click(); });

  /* ---------- Reviews (7 Google reviews) ---------- */
  var R = [
    {n:"Priya Padmakar", m:"7 reviews · 3 photos · 4 months ago", t:"Found a gem in Sahakarnagar! Mahira is a new boutique but they work like pros. They take time to understand what you want, fabric, fit, occasion, everything, and execute it perfectly. Quality and finishing are on point. Reasonably priced too. Highly recommend if you want perfect fit. ⭐⭐⭐⭐⭐"},
    {n:"Amrutha G", m:"3 reviews · 2 months ago", t:"Highly recommend this boutique! They perfectly understand your requirements and customize every design with great attention to detail. The fitting, stitching, and finishing are excellent, the final outfit looks exactly as envisioned."},
    {n:"Nethra Naidu", m:"2 reviews · 4 months ago", t:"Mahira Boutique has won my heart! They don't just stitch outfits, they create them with so much care. The fitting was spot on, the finishing flawless, and the final look exactly how I imagined. Professional, friendly, reasonably priced. ❤️"},
    {n:"Shubha Devanga", m:"2 reviews · 3 months ago", t:"Mahiraa Designer Studio is simply brilliant. They understood our vision instantly and turned it into designs that look premium and feel unique. Creative, detail-oriented, super responsive. Smooth and stress-free from start to finish."},
    {n:"Triveni R", m:"1 review · 5 months ago", t:"The designs are unique and the quality of the fabric is top-notch. Absolutely loved the collections at Mahiraa."},
    {n:"Anandakumara A", m:"1 review · 11 photos · 2 months ago", t:"Extremely professional, communicative, and delivered the outfit right on the promised date. Best gem and marvelous fashion designer studio in Bangalore."},
    {n:"Rashmika Rashu", m:"9 reviews · 1 photo · 4 months ago", t:"Very good experience, good fitting."}
  ];
  var ri = 0, rTimer = null, card = $("#reviewCard"), rDots = $("#revDots");
  R.forEach(function(_, i){
    var b = document.createElement("button");
    b.setAttribute("aria-label","Review "+(i+1));
    if(i===0) b.classList.add("active");
    b.addEventListener("click", function(){ showR(i); restartR(); });
    rDots.appendChild(b);
  });
  var rd = $$("button", rDots);
  function showR(i){
    ri = (i + R.length) % R.length;
    card.innerHTML = '<div class="stars">★★★★★</div><p>“' + R[ri].t + '”</p><cite>- ' + R[ri].n + " · " + R[ri].m + "</cite>";
    rd.forEach(function(d,j){ d.classList.toggle("active", j===ri); });
  }
  function restartR(){ if(rTimer) clearInterval(rTimer); rTimer = setInterval(function(){ showR(ri+1); }, 6000); }
  $("#revNext").addEventListener("click", function(){ showR(ri+1); restartR(); });
  $("#revPrev").addEventListener("click", function(){ showR(ri-1); restartR(); });
  showR(0); restartR();

  /* ---------- Enquiry -> WhatsApp ---------- */
  $("#enquiryForm").addEventListener("submit", function(e){
    e.preventDefault();
    var f = e.target;
    var msg = "Hello Mahiraa Designer Studio! I'm " + f.name.value + " (" + f.phone.value + "). I'm looking for: " + f.need.value + ". " + f.msg.value;
    window.open("https://wa.me/+918971968008?text=" + encodeURIComponent(msg), "_blank");
  });

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, {threshold:.12});
  $$(".reveal").forEach(function(el){ io.observe(el); });

  /* ---------- New Collection popup ---------- */
  var ncPopup = $("#ncPopup");
  var ncSlides = $$(".nc-slide"), ncDotsWrap = $("#ncDots"), ncIdx = 0;
  ncSlides.forEach(function(_, i){
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Look " + (i+1));
    if(i===0) b.classList.add("active");
    b.addEventListener("click", function(){ showNC(i); });
    ncDotsWrap.appendChild(b);
  });
  var ncDots = $$("button", ncDotsWrap);
  var ncPrevBtn = $("#ncPrev"), ncNextBtn = $("#ncNext");
  function showNC(i){
    ncSlides[ncIdx].classList.remove("active"); ncDots[ncIdx].classList.remove("active");
    ncIdx = (i + ncSlides.length) % ncSlides.length;
    ncSlides[ncIdx].classList.add("active"); ncDots[ncIdx].classList.add("active");
    fitNCArrows();
  }
  function fitNCArrows(){
    var img = ncSlides[ncIdx].querySelector("img");
    function place(){
      var elW = img.clientWidth, elH = img.clientHeight;
      var iw = img.naturalWidth || elW, ih = img.naturalHeight || elH;
      var s = Math.min(elW / iw, elH / ih);
      var gap = Math.max(0, (elW - iw * s) / 2);
      ncPrevBtn.style.left = (gap + 8) + "px";
      ncNextBtn.style.right = (gap + 8) + "px";
    }
    if(img.complete && img.naturalWidth) place();
    else img.addEventListener("load", place, {once:true});
  }
  window.addEventListener("resize", function(){ if(ncPopup.classList.contains("open")) fitNCArrows(); });
  $("#ncFloat").addEventListener("click", function(){ showNC(0); ncPopup.classList.add("open"); ncPopup.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; });
  function closeNC(){ ncPopup.classList.remove("open"); ncPopup.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
  $("#ncClose").addEventListener("click", closeNC);
  $("#ncNext").addEventListener("click", function(){ showNC(ncIdx+1); });
  $("#ncPrev").addEventListener("click", function(){ showNC(ncIdx-1); });
  ncPopup.addEventListener("click", function(e){ if(e.target===ncPopup) closeNC(); });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape" && ncPopup.classList.contains("open")) closeNC(); });
})();
