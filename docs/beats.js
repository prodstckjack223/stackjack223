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

// Beat list "Buy" -> go straight to checkout. WAV Lease is turned off for
// now (no WAV files exist yet), so there's only one license and no picker
// is needed. Every MP3 lease is the same price ($20), so this one link is
// shared across all beats rather than setting data-checkout-mp3 per beat --
// a beat's own data-checkout-mp3 attribute (if set) still wins over it, so
// specific beats can still be given their own unique link later.
var DEFAULT_CHECKOUT_MP3 = 'https://buy.stripe.com/test_fZu28tcrD1mi5mvf07dwc00';

function mailtoFor(beat, license) {
  return 'mailto:prodstckjack@gmail.com?subject=' + encodeURIComponent('Buying "' + beat + '" - ' + license);
}

document.querySelectorAll('.js-buy-track').forEach(function(btn){
  btn.addEventListener('click', function(){
    var checkoutUrl = btn.getAttribute('data-checkout-mp3') || DEFAULT_CHECKOUT_MP3;
    var beat = btn.getAttribute('data-beat');
    window.location.href = checkoutUrl || mailtoFor(beat, 'MP3 Lease');
  });
});
