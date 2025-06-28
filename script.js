// ========================== script.js ==========================
(() => {
  // Elements
  const openFormBtn = document.getElementById('openForm');
  const formModal   = document.getElementById('formModal');
  const closeForm   = document.getElementById('closeForm');
  const wishForm    = document.getElementById('wishForm');
  const wishesGrid  = document.getElementById('wishesContainer');

  // ---------- Confetti on load ----------
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });

  // ---------- Modal show/hide ----------
  openFormBtn.addEventListener('click', () => formModal.classList.remove('hidden'));
  closeForm.addEventListener('click', () => formModal.classList.add('hidden'));
  window.addEventListener('click', (e) => {
    if (e.target === formModal) formModal.classList.add('hidden');
  });

  // ---------- Submit wish ----------
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = wishForm['name'].value.trim();
    const message = wishForm['message'].value.trim();
    if (!name || !message) return;
    try {
      await db.collection('wishes').add({
        name,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      wishForm.reset();
      formModal.classList.add('hidden');
    } catch (err) {
      alert('Error saving wish:\n' + err.message);
    }
  });

  // ---------- Real‑time listener ----------
  db.collection('wishes')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      wishesGrid.innerHTML = '';
      snapshot.forEach((doc) => {
        const { name, message } = doc.data();
        wishesGrid.insertAdjacentHTML(
          'beforeend',
          `
          <div class="card">
            <h3>🎈 ${name}</h3>
            <p>${message}</p>
          </div>
        `
        );
      });
    });
})();
