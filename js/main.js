'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Preloader ──────────────────────────────────────────── */
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
  }, 700);

  /* ─── Toast ──────────────────────────────────────────────── */
  function showToast(msg, ms = 3000) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), ms);
  }

  /* ─── vCard Download ─────────────────────────────────────── */
  function downloadVCard() {
    const c = {
      fn:      'Amma Lingerie',
      org:     'Amma Lingerie',
      title:   'Luxury Intimates Brand',
      tel:     '+919876543210',
      email:   'hello@ammalingerie.in',
      url:     'https://www.ammalingerie.in',
      street:  'Shop 4, Linking Road',
      city:    'Bandra West',
      state:   'Maharashtra',
      zip:     '400050',
      country: 'India',
    };
    const vcf = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${c.fn}`, `ORG:${c.org}`, `TITLE:${c.title}`,
      `TEL;TYPE=CELL,PREF:${c.tel}`,
      `EMAIL;TYPE=WORK,PREF:${c.email}`,
      `URL;TYPE=WORK:${c.url}`,
      `ADR;TYPE=WORK:;;${c.street};${c.city};${c.state};${c.zip};${c.country}`,
      `X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/ammalingerie`,
      `NOTE:Luxury women's intimates — Mumbai. DM for private consultation.`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'amma-lingerie.vcf' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast('Contact saved to your phone ✓');
  }

  /* Attach to all .btn-save elements */
  document.querySelectorAll('.btn-save').forEach(btn =>
    btn.addEventListener('click', downloadVCard)
  );

  /* ─── Share API ──────────────────────────────────────────── */
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Amma Lingerie — Luxury Intimates',
          text:  'Discover Amma — luxurious intimates for your everyday confidence.',
          url:   location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(location.href);
        showToast('Link copied to clipboard ✓');
      } catch {
        showToast('Copy the link from your address bar.');
      }
    }
  }

  ['btn-share', 'btn-share-bar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handleShare);
  });

  /* ─── QR Button — show toast (upgrade to modal later) ───── */
  const qrBtn = document.getElementById('btn-qr');
  if (qrBtn) {
    qrBtn.addEventListener('click', () => {
      showToast('QR Code feature coming soon ✦');
    });
  }

  /* ─── Scroll Reveal ──────────────────────────────────────── */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ─── VIP Form Submission ────────────────────────────────── */
  const form = document.getElementById('vip-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!this.checkValidity()) { this.reportValidity(); return; }

      const btn = document.getElementById('btn-submit');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      const payload = {
        name:    document.getElementById('f-name').value.trim(),
        mobile:  document.getElementById('f-mobile').value.trim(),
        email:   document.getElementById('f-email').value.trim(),
        source:  'Amma Digital Card',
        time:    new Date().toISOString(),
      };

      try {
        /* ── Replace URL with your actual webhook / EmailJS / API ──
           const res = await fetch('https://hooks.zapier.com/hooks/catch/YOUR_ID/', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(payload),
           });
           if (!res.ok) throw new Error();
        */
        await new Promise(resolve => setTimeout(resolve, 800)); /* demo delay */
      } catch (err) {
        console.warn('Webhook not configured — showing success for demo.', err);
      }

      this.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) success.style.display = 'block';
      showToast('Welcome to Amma VIP ✦');
    });
  }
});
