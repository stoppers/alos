export default function autosize() {
  const texts = document.querySelectorAll('textarea[data-autosize]');

  texts.forEach(text => {
    function resize() {
      text.style.height = 'auto';
      text.style.height = `${text.scrollHeight}px`;
    }
  
    if (text) {
  
      text.addEventListener('change', resize);
      text.addEventListener('cut', resize);
      text.addEventListener('paste', resize);
      text.addEventListener('drop', resize);
      text.addEventListener('keydown', resize);
  
      //text.focus();
      //text.select();
      resize();
    }
  })
}