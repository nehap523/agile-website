document.addEventListener("DOMContentLoaded", function () {
  const toggleSummaryBtn = document.getElementById("toggleSummaryBtn");
  const quickSummaryBox = document.getElementById("quickSummaryBox");
  const skillFills = document.querySelectorAll(".skill-fill");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const statNumbers = document.querySelectorAll(".hero-stat-number");

  if (toggleSummaryBtn && quickSummaryBox) {
    toggleSummaryBtn.addEventListener("click", function () {
      const isVisible = quickSummaryBox.style.display === "block";
      quickSummaryBox.style.display = isVisible ? "none" : "block";
      toggleSummaryBtn.textContent = isVisible ? "Toggle quick summary" : "Hide quick summary";
    });
  }

  function animateSkills() {
    skillFills.forEach((bar) => {
      const targetWidth = bar.getAttribute("data-width");
      bar.style.width = targetWidth + "%";
    });
  }

  function animateStatNumber(element) {
    const target = Number(element.getAttribute("data-target"));
    const duration = 1000;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = String(value);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = String(target);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function revealOnScroll() {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        item.classList.add("is-visible");
      }
    });
  }

  animateSkills();
  revealOnScroll();
  statNumbers.forEach((stat) => animateStatNumber(stat));
  window.addEventListener("scroll", revealOnScroll);
});