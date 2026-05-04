document.addEventListener('DOMContentLoaded', function () {
    const htmlHeaderPreview = document.getElementById('htmlHeaderPreview');
    const htmlNavPreview = document.getElementById('htmlNavPreview');
    const highlightHeaderBtn = document.getElementById('highlightHeaderBtn');
    const highlightNavBtn = document.getElementById('highlightNavBtn');
    const resetHtmlDemoBtn = document.getElementById('resetHtmlDemoBtn');
  
    function resetHtmlPreview() {
      if (!htmlHeaderPreview || !htmlNavPreview) return;
      htmlHeaderPreview.style.background = '#dbeafe';
      htmlHeaderPreview.style.color = '#0f172a';
      htmlNavPreview.style.background = '#1e293b';
      htmlNavPreview.style.color = '#ffffff';
      htmlHeaderPreview.style.transform = 'scale(1)';
      htmlNavPreview.style.transform = 'scale(1)';
    }
  
    if (highlightHeaderBtn) {
      highlightHeaderBtn.addEventListener('click', function () {
        resetHtmlPreview();
        htmlHeaderPreview.style.background = '#5bc0be';
        htmlHeaderPreview.style.color = '#08101f';
        htmlHeaderPreview.style.transform = 'scale(1.01)';
      });
    }
  
    if (highlightNavBtn) {
      highlightNavBtn.addEventListener('click', function () {
        resetHtmlPreview();
        htmlNavPreview.style.background = '#f4a261';
        htmlNavPreview.style.color = '#08101f';
        htmlNavPreview.style.transform = 'scale(1.01)';
      });
    }
  
    if (resetHtmlDemoBtn) {
      resetHtmlDemoBtn.addEventListener('click', resetHtmlPreview);
    }
  
    const fontSizeRange = document.getElementById('fontSizeRange');
    const bgSelect = document.getElementById('bgSelect');
    const roundCornersBtn = document.getElementById('roundCornersBtn');
    const addBorderBtn = document.getElementById('addBorderBtn');
    const resetCssDemoBtn = document.getElementById('resetCssDemoBtn');
    const cssDemoBox = document.getElementById('cssDemoBox');
  
    let cornersRounded = false;
    let borderVisible = false;
  
    function applyCssDemo() {
      if (!cssDemoBox || !fontSizeRange || !bgSelect) return;
  
      cssDemoBox.style.fontSize = fontSizeRange.value + 'px';
  
      if (bgSelect.value === 'light') {
        cssDemoBox.style.background = '#ffffff';
        cssDemoBox.style.color = '#1f2937';
      } else if (bgSelect.value === 'teal') {
        cssDemoBox.style.background = 'linear-gradient(135deg, #dff7f6, #ecfeff)';
        cssDemoBox.style.color = '#12343b';
      } else {
        cssDemoBox.style.background = '#0f172a';
        cssDemoBox.style.color = '#e2e8f0';
      }
  
      cssDemoBox.style.borderRadius = cornersRounded ? '28px' : '16px';
      cssDemoBox.style.border = borderVisible ? '3px solid #f4a261' : '1px solid #cbd5e1';
      cssDemoBox.style.boxShadow = cornersRounded
        ? '0 18px 40px rgba(11, 19, 43, 0.16)'
        : '0 10px 25px rgba(15, 23, 42, 0.08)';
    }
  
    if (fontSizeRange) fontSizeRange.addEventListener('input', applyCssDemo);
    if (bgSelect) bgSelect.addEventListener('change', applyCssDemo);
  
    if (roundCornersBtn) {
      roundCornersBtn.addEventListener('click', function () {
        cornersRounded = !cornersRounded;
        applyCssDemo();
      });
    }
  
    if (addBorderBtn) {
      addBorderBtn.addEventListener('click', function () {
        borderVisible = !borderVisible;
        applyCssDemo();
      });
    }
  
    if (resetCssDemoBtn) {
      resetCssDemoBtn.addEventListener('click', function () {
        if (fontSizeRange) fontSizeRange.value = 18;
        if (bgSelect) bgSelect.value = 'light';
        cornersRounded = false;
        borderVisible = false;
        applyCssDemo();
      });
    }
  
    const jsOutput = document.getElementById('jsOutput');
    const jsPopupBtn = document.getElementById('jsPopupBtn');
    const jsDoubleBtn = document.getElementById('jsDoubleBtn');
    const jsResetBtn = document.getElementById('jsResetBtn');
    const jsHoverBox = document.getElementById('jsHoverBox');
  
    if (jsPopupBtn) {
      jsPopupBtn.addEventListener('click', function () {
        alert('This popup was triggered by a JavaScript click event.');
        if (jsOutput) {
          jsOutput.innerHTML = '<strong>Click event:</strong> JavaScript opened a popup and updated this panel.';
        }
      });
    }
  
    if (jsDoubleBtn) {
      jsDoubleBtn.addEventListener('dblclick', function () {
        if (jsOutput) {
          jsOutput.innerHTML = '<strong>Double-click event:</strong> You activated a JavaScript double-click interaction.';
        }
      });
    }
  
    if (jsHoverBox) {
      jsHoverBox.addEventListener('mouseenter', function () {
        jsHoverBox.classList.add('active');
        if (jsOutput) {
          jsOutput.innerHTML = '<strong>Hover event:</strong> JavaScript detected that your pointer entered the box.';
        }
      });
  
      jsHoverBox.addEventListener('mouseleave', function () {
        jsHoverBox.classList.remove('active');
        if (jsOutput) {
          jsOutput.textContent = 'Waiting for a JavaScript event...';
        }
      });
    }
  
    if (jsResetBtn) {
      jsResetBtn.addEventListener('click', function () {
        if (jsHoverBox) jsHoverBox.classList.remove('active');
        if (jsOutput) jsOutput.textContent = 'Waiting for a JavaScript event...';
      });
    }
  
    resetHtmlPreview();
    applyCssDemo();
  });