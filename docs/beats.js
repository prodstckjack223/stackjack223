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
var DEFAULT_CHECKOUT_MP3 = 'https://buy.stripe.com/fZu28tcrD1mi5mvf07dwc00';

function mailtoFor(beat, license) {
  return 'mailto:prodstckjack@gmail.com?subject=' + encodeURIComponent('Buying "' + beat + '" - ' + license);
}

// Subscription beat picker (beats.html?mode=subscribe only -- the banner
// elements don't exist on index.html or on a plain beats.html visit, so all
// of this quietly no-ops there).
// Stripe Payment Links don't support auto-applying a promo code via URL
// (that trick only works for Checkout Sessions built through the API, which
// needs a backend we don't have) -- so STACK5 has to be typed in by the
// customer at checkout. The banner and continue button remind them to.
var SUBSCRIBE_CHECKOUT_URL = 'https://buy.stripe.com/8x2eVfgHT0iecOX3hpdwc01';
var SUBSCRIBE_PICK_COUNT = 6;
var subscribeMode = new URLSearchParams(window.location.search).get('mode') === 'subscribe';
var subscribeBanner = document.getElementById('subscribe-banner');
var subscribeCountEl = document.getElementById('subscribe-count');
var subscribeContinueBtn = document.getElementById('subscribe-continue');
var pickedBeats = [];

if (subscribeMode && subscribeBanner) {
  subscribeBanner.style.display = '';
}

function updateSubscribeBanner() {
  if (!subscribeCountEl) { return; }
  subscribeCountEl.textContent = pickedBeats.length;
  subscribeContinueBtn.disabled = pickedBeats.length !== SUBSCRIBE_PICK_COUNT;
}

document.querySelectorAll('.js-buy-track').forEach(function(btn){
  if (subscribeMode && subscribeBanner) {
    btn.textContent = 'Pick';
  }
  btn.addEventListener('click', function(){
    if (subscribeMode && subscribeBanner) {
      var beat = btn.getAttribute('data-beat');
      var idx = pickedBeats.indexOf(beat);
      if (idx !== -1) {
        pickedBeats.splice(idx, 1);
        btn.classList.remove('is-picked');
        btn.textContent = 'Pick';
      } else {
        if (pickedBeats.length >= SUBSCRIBE_PICK_COUNT) { return; }
        pickedBeats.push(beat);
        btn.classList.add('is-picked');
        btn.textContent = 'Picked';
      }
      updateSubscribeBanner();
      return;
    }
    var checkoutUrl = btn.getAttribute('data-checkout-mp3') || DEFAULT_CHECKOUT_MP3;
    var beat = btn.getAttribute('data-beat');
    window.location.href = checkoutUrl || mailtoFor(beat, 'MP3 Lease');
  });
});

if (subscribeContinueBtn) {
  subscribeContinueBtn.addEventListener('click', function(){
    if (pickedBeats.length !== SUBSCRIBE_PICK_COUNT) { return; }
    var ref = pickedBeats.join(', ');
    window.alert('Almost there! On the checkout page, click "Add promotion code" and enter STACK5 to get your first month for $9.99.');
    window.location.href = SUBSCRIBE_CHECKOUT_URL + '?client_reference_id=' + encodeURIComponent(ref);
  });
}

// Genre filter tabs (beats.html only -- no-op elsewhere since the buttons don't exist)
document.querySelectorAll('.genre-filter-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.genre-filter-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    var genre = btn.getAttribute('data-genre');
    document.querySelectorAll('.beat-row').forEach(function(row){
      if (row.classList.contains('beat-row-more')) { return; }
      var tagsEl = row.querySelector('.beat-row-tags');
      var tagsText = tagsEl ? tagsEl.textContent : '';
      var genres = tagsText.indexOf('·') !== -1 ? tagsText.split('·')[1].split(',').map(function(g){ return g.trim(); }) : [];
      var matches = genre === 'all' || genres.indexOf(genre) !== -1;
      row.classList.toggle('is-hidden', !matches);
    });
  });
});
