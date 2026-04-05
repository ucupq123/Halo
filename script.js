// ========================================
// ORVION CLOUD - AUTHENTICATION SYSTEM
// ========================================

// Storage key
const USERS_KEY = 'orvion_users';

// ========== HELPER FUNCTIONS ==========
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isUsernameExists(username) {
    const users = getUsers();
    return users.some(user => user.username === username);
}

function registerUser(username, nama, password) {
    const users = getUsers();
    const newUser = {
        username: username,
        nama: nama,
        password: password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return true;
}

function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || false;
}

// ========== SHOW TOAST NOTIFICATION ==========
function showToast(message, isError = false) {
    // Hapus toast lama jika ada
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isError ? 'rgba(220, 53, 69, 0.95)' : 'rgba(79, 172, 254, 0.95)'};
        backdrop-filter: blur(12px);
        padding: 10px 24px;
        border-radius: 60px;
        color: white;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(255,255,255,0.2);
        animation: toastSlide 0.3s ease;
    `;
    
    // Tambahkan keyframes jika belum ada
    if (!document.querySelector('#toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'toast-keyframes';
        style.textContent = `
            @keyframes toastSlide {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== SWITCH TABS ==========
function showTab(tabName) {
    const loginPanel = document.getElementById('loginPanel');
    const registerPanel = document.getElementById('registerPanel');
    const loginBtn = document.querySelector('.tab-btn:first-child');
    const registerBtn = document.querySelector('.tab-btn:last-child');
    
    if (tabName === 'login') {
        loginPanel.classList.add('active');
        registerPanel.classList.remove('active');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        // Reset pesan
        document.getElementById('loginMessage').innerHTML = '';
        document.getElementById('loginMessage').className = 'auth-message';
    } else {
        loginPanel.classList.remove('active');
        registerPanel.classList.add('active');
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
        document.getElementById('registerMessage').innerHTML = '';
        document.getElementById('registerMessage').className = 'auth-message';
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordMatchError').textContent = '';
    }
}

// ========== VALIDASI PASSWORD MATCH (REALTIME) ==========
function initRealtimeValidation() {
    const regPassword = document.getElementById('regPassword');
    const regConfirm = document.getElementById('regConfirmPassword');
    const passwordError = document.getElementById('passwordMatchError');
    
    function validate() {
        if (regConfirm.value.length > 0 && regPassword.value !== regConfirm.value) {
            passwordError.textContent = '✗ Konfirmasi password tidak cocok';
            passwordError.style.color = '#ff6b6b';
        } else if (regConfirm.value.length > 0) {
            passwordError.textContent = '✓ Password cocok';
            passwordError.style.color = '#00e676';
        } else {
            passwordError.textContent = '';
        }
    }
    
    regPassword.addEventListener('input', validate);
    regConfirm.addEventListener('input', validate);
}

// ========== CEK KETERSEDIAAN USERNAME (REALTIME) ==========
function initUsernameCheck() {
    const regUsername = document.getElementById('regUsername');
    const usernameError = document.getElementById('usernameError');
    
    regUsername.addEventListener('input', function() {
        const username = regUsername.value.trim();
        if (username.length > 0 && isUsernameExists(username)) {
            usernameError.textContent = '✗ Username sudah digunakan';
            usernameError.style.color = '#ff6b6b';
        } else if (username.length > 0) {
            usernameError.textContent = '✓ Username tersedia';
            usernameError.style.color = '#00e676';
        } else {
            usernameError.textContent = '';
        }
    });
}

// ========== MODAL SYARAT & KETENTUAN ==========
function initModal() {
    const modal = document.getElementById('termsModal');
    const termsLink = document.querySelector('.checkbox-group .link');
    const closeBtn = document.querySelector('.modal-close');
    const okBtn = document.querySelector('.modal-ok-btn');
    
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    if (okBtn) {
        okBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Tutup modal klik di luar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// ========== REGISTRATION HANDLER ==========
function initRegistration() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const nama = document.getElementById('regNama').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const termsChecked = document.getElementById('termsCheckbox').checked;
        const registerMessage = document.getElementById('registerMessage');
        const usernameError = document.getElementById('usernameError');
        const passwordMatchError = document.getElementById('passwordMatchError');
        
        // Reset pesan
        registerMessage.innerHTML = '';
        registerMessage.className = 'auth-message';
        
        // Validasi
        if (!username) {
            usernameError.textContent = 'Username tidak boleh kosong';
            usernameError.style.color = '#ff6b6b';
            return;
        }
        
        if (!nama) {
            usernameError.textContent = 'Nama lengkap tidak boleh kosong';
            usernameError.style.color = '#ff6b6b';
            return;
        }
        
        if (isUsernameExists(username)) {
            usernameError.textContent = 'Username sudah digunakan';
            usernameError.style.color = '#ff6b6b';
            return;
        }
        
        if (password.length < 4) {
            passwordMatchError.textContent = 'Password minimal 4 karakter';
            passwordMatchError.style.color = '#ff6b6b';
            return;
        }
        
        if (password !== confirmPassword) {
            passwordMatchError.textContent = 'Konfirmasi password tidak cocok';
            passwordMatchError.style.color = '#ff6b6b';
            return;
        }
        
        if (!termsChecked) {
            showToast('Anda harus menyetujui syarat & ketentuan', true);
            return;
        }
        
        // Registrasi
        const success = registerUser(username, nama, password);
        if (success) {
            registerMessage.innerHTML = '✓ Pendaftaran berhasil! Silakan login.';
            registerMessage.classList.add('success');
            showToast('Akun berhasil dibuat! Silakan login', false);
            
            // Reset form
            form.reset();
            document.getElementById('usernameError').textContent = '';
            document.getElementById('passwordMatchError').textContent = '';
            
            // Pindah ke tab login setelah 1.5 detik
            setTimeout(() => {
                showTab('login');
                document.getElementById('loginMessage').innerHTML = '';
            }, 1500);
        } else {
            registerMessage.innerHTML = 'Registrasi gagal, coba lagi.';
            registerMessage.classList.add('error');
        }
    });
}

// ========== LOGIN HANDLER ==========
function initLogin() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginMessage = document.getElementById('loginMessage');
        
        loginMessage.innerHTML = '';
        loginMessage.className = 'auth-message';
        
        if (!username || !password) {
            loginMessage.innerHTML = 'Username dan password harus diisi';
            loginMessage.classList.add('error');
            return;
        }
        
        const user = loginUser(username, password);
        
        if (user) {
            loginMessage.innerHTML = `✓ Login berhasil! Selamat datang, ${user.nama} 🎉`;
            loginMessage.classList.add('success');
            showToast(`Selamat datang kembali, ${user.nama}!`, false);
            
            // Simpan session (contoh)
            sessionStorage.setItem('orvion_logged_in', 'true');
            sessionStorage.setItem('orvion_user', JSON.stringify(user));
            
            // Reset form
            form.reset();
            
            // Redirect atau reload setelah 1 detik
            setTimeout(() => {
                alert(`Login sukses! Selamat datang ${user.nama} di Orvion Cloud`);
                // Uncomment untuk redirect ke halaman utama
                // window.location.href = "dashboard.html";
            }, 500);
        } else {
            loginMessage.innerHTML = '✗ Username atau password salah';
            loginMessage.classList.add('error');
            showToast('Username atau password salah', true);
        }
    });
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', function() {
    // Setup tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            if (tab) showTab(tab);
        });
    });
    
    // Inisialisasi semua fungsi
    initRealtimeValidation();
    initUsernameCheck();
    initModal();
    initRegistration();
    initLogin();
});