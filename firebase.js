/* ============================================
   WEDDING INVITATION — firebase.js
   Firestore: Save & Load Wishes
   ============================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ===== CONFIG =====
const firebaseConfig = {
  apiKey:            'AIzaSyCfdAZG6Kz53ExFjMvIZmZX4RMF0LIu5HU',
  authDomain:        'weddings-e0b85.firebaseapp.com',
  projectId:         'weddings-e0b85',
  storageBucket:     'weddings-e0b85.firebasestorage.app',
  messagingSenderId: '753305552995',
  appId:             '1:753305552995:web:3d4f641ce3355702745056',
  measurementId:     'G-XWRG6DF2JS',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ===== LOAD WISHES =====
async function loadWishes() {
  const list = document.getElementById('wishes-list');
  if (!list) return;

  try {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      list.innerHTML = `<div class="wish-loading">كن أول من يهنئ! <svg class="gold-icon inline-icon" viewBox="0 0 24 24" fill="url(#goldLeafGrad)"><path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.03 L12,21.35 Z" /></svg></div>`;
      return;
    }

    list.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-card-name">
          <svg class="gold-icon inline-icon" viewBox="0 0 24 24" fill="url(#goldLeafGrad)"><path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.03 L12,21.35 Z" /></svg> 
          ${escapeHtml(data.name)}
        </div>
        <div class="wish-card-text">${escapeHtml(data.text)}</div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    console.error('خطأ في تحميل التهاني:', err);
    list.innerHTML = '<div class="wish-loading">تعذر تحميل التهاني</div>';
  }
}

// ===== SUBMIT WISH =====
window.submitWish = async function () {
  const nameInput = document.getElementById('wish-name');
  const textInput = document.getElementById('wish-text');
  const btn       = document.getElementById('wish-submit');
  const btnText   = document.getElementById('wish-btn-text');
  const success   = document.getElementById('wish-success');

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    alert('من فضلك أكتب اسمك وتهنئتك 🤍');
    return;
  }

  btn.disabled = true;
  btnText.innerHTML = 'جاري الإرسال...';

  try {
    await addDoc(collection(db, 'wishes'), {
      name,
      text,
      createdAt: serverTimestamp(),
    });

    nameInput.value = '';
    textInput.value = '';
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 4000);

    // reload wishes to show the new one
    await loadWishes();
  } catch (err) {
    console.error('خطأ في الإرسال:', err);
    alert('حدث خطأ، حاول مرة تانية');
  } finally {
    btn.disabled = false;
    btnText.innerHTML = `أرسل تهنئتك <svg class="gold-icon inline-icon" viewBox="0 0 24 24" fill="currentColor" style="color: var(--bg-dark); vertical-align: middle; margin-right: 4px;"><path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.03 L12,21.35 Z" /></svg>`;
  }
};

// ===== HELPERS =====
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== INIT =====
// Load wishes after main content appears
const observer = new MutationObserver(() => {
  const main = document.getElementById('main-content');
  if (main && !main.classList.contains('hidden')) {
    loadWishes();
    observer.disconnect();
  }
});
observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
