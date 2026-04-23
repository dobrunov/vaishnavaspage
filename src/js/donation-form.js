/**
 * Preset amounts + submit scrolls to bank requisites CTA or legacy inline block.
 */
export function initDonationForm() {
  const form = document.querySelector('[data-donation-form]');
  if (!form) return;

  const amountInput = form.querySelector('input[name="amount"]');

  form.querySelectorAll('[data-amount-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-amount-preset');
      if (amountInput && v) {
        amountInput.value = v;
        amountInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const terms = form.querySelector('#donation-terms');
    if (terms && !terms.checked) {
      terms.focus();
      return;
    }
    const bank = document.getElementById('donation-bank-details');
    const cta = document.getElementById('donation-bank-cta');
    const target = bank ?? cta;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add(
        'ring-2',
        'ring-brand/30',
        'transition-shadow',
        'duration-300',
        'rounded-lg'
      );
      window.setTimeout(() => {
        target.classList.remove('ring-2', 'ring-brand/30', 'rounded-lg');
      }, 2400);
    }
  });
}
