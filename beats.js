// Beat row play/pause preview -> only one plays at a time
document.querySelectorAll('.js-play').forEach(function(btn){
  var audio = btn.nextElementSibling;
  var iconPlay = btn.querySelector('.icon-play');
  var iconPause = btn.querySelector('.icon-pause');
  var errorLabel = btn.closest('.beat-row').querySelector('.beat-row-error');
  btn.addEventListener('click', function(){
    if (audio.paused) {
      document.querySelectorAll('audio.beat-audio').forEach(function(a){
        if (a !== audio) { a.pause(); a.currentTime = 0; }
      });
      var playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(function(){ errorLabel.style.display = 'block'; });
      }
    } else {
      audio.pause();
    }
  });
  audio.addEventListener('play', function(){
    iconPlay.style.display = 'none';
    iconPause.style.display = '';
    errorLabel.style.display = 'none';
  });
  audio.addEventListener('pause', function(){ iconPlay.style.display = ''; iconPause.style.display = 'none'; });
  audio.addEventListener('ended', function(){ iconPlay.style.display = ''; iconPause.style.display = 'none'; });
  audio.addEventListener('error', function(){ errorLabel.style.display = 'block'; });
});

// Beat list "Buy" -> open a license picker (MP3 / WAV), each going straight
// to that license's checkout link. The contact form (on the homepage) stays
// for Custom Beats requests only -- a license with no checkout link yet
// emails instead.
var buyModalOverlay = document.getElementById('buy-modal-overlay');
var buyModalTitle = document.getElementById('buy-modal-title');
var buyModalClose = document.getElementById('buy-modal-close');
var buyModalMp3 = document.getElementById('buy-modal-mp3');
var buyModalWav = document.getElementById('buy-modal-wav');
var buyModalLastFocused = null;

function mailtoFor(beat, license) {
  return 'mailto:prodstckjack@gmail.com?subject=' + encodeURIComponent('Buying "' + beat + '" - ' + license);
}

function openBuyModal(btn) {
  var beat = btn.getAttribute('data-beat');
  var mp3Url = btn.getAttribute('data-checkout-mp3');
  var wavUrl = btn.getAttribute('data-checkout-wav');
  buyModalTitle.textContent = beat;
  buyModalMp3.href = mp3Url || mailtoFor(beat, 'MP3 Lease');
  buyModalWav.href = wavUrl || mailtoFor(beat, 'WAV Lease');
  buyModalLastFocused = document.activeElement;
  buyModalOverlay.hidden = false;
  buyModalClose.focus();
}

function closeBuyModal() {
  buyModalOverlay.hidden = true;
  if (buyModalLastFocused) { buyModalLastFocused.focus(); }
}

document.querySelectorAll('.js-buy-track').forEach(function(btn){
  btn.addEventListener('click', function(){ openBuyModal(btn); });
});

buyModalClose.addEventListener('click', closeBuyModal);
buyModalOverlay.addEventListener('click', function(e){
  if (e.target === buyModalOverlay) { closeBuyModal(); }
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && !buyModalOverlay.hidden) { closeBuyModal(); }
});
