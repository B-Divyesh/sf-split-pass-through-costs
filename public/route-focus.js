const focusPageHeading = () => {
  const heading = document.querySelector('h1');
  if (heading instanceof HTMLElement) heading.focus({ preventScroll: true });
};

window.addEventListener('pageshow', focusPageHeading);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', focusPageHeading, { once: true });
else focusPageHeading();
