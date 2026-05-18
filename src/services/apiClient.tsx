import axios from 'axios';

// 1. Membuat instance Axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: 'https://api.contoh.com/v1', // Ganti dengan URL API Anda
  timeout: 10000, // Timeout dalam milidetik (10 detik)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 2. Request Interceptor
// Berguna untuk menyisipkan token autentikasi atau manipulasi request sebelum dikirim
apiClient.interceptors.request.use(
  (config) => {
    // Contoh: Mengambil token dari localStorage (sesuaikan dengan cara Anda menyimpan token)
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Anda juga bisa menambahkan logika lain di sini, misalnya loading state
    return config;
  },
  (error) => {
    // Menangani error pada tahap request (jarang terjadi)
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// Berguna untuk memformat response atau menangani error berdasarkan status code secara global
apiClient.interceptors.response.use(
  (response) => {
    // Jika request berhasil, kita bisa langsung mengembalikan datanya saja
    // sehingga di pemanggil tidak perlu lagi memanggil response.data
    return response.data;
  },
  (error) => {
    // Menangani berbagai jenis error berdasarkan HTTP Status Code
    if (error.response) {
      // Request berhasil dikirim, namun server merespons dengan status code di luar 2xx
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          console.error('Bad Request: Permintaan tidak valid.', data);
          // Tambahkan logika seperti menampilkan toast/notifikasi error
          break;
        case 401:
          console.error('Unauthorized: Sesi Anda telah habis atau tidak valid.');
          // Logika umum: Hapus token dan redirect ke halaman login
          // localStorage.removeItem('accessToken');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: Anda tidak memiliki akses ke resource ini.', data);
          break;
        case 404:
          console.error('Not Found: Resource yang diminta tidak ditemukan.', data);
          break;
        case 422:
          console.error('Unprocessable Entity: Validasi data gagal.', data);
          break;
        case 500:
          console.error('Internal Server Error: Terjadi kesalahan pada server.', data);
          break;
        case 503:
          console.error('Service Unavailable: Layanan sedang tidak tersedia.', data);
          break;
        default:
          console.error(`Terjadi kesalahan yang tidak terduga. Status: ${status}`, data);
      }
    } else if (error.request) {
      // Request berhasil dikirim, namun tidak ada response yang diterima (misal: koneksi terputus)
      console.error('Network Error: Tidak ada respons dari server. Periksa koneksi internet Anda.');
    } else {
      // Sesuatu terjadi saat menyiapkan request yang memicu error
      console.error('Error:', error.message);
    }

    // Tetap kembalikan Promise.reject agar kita bisa menangani error spesifik di fungsi pemanggil (opsional)
    // Gunakan custom object jika ingin menyeragamkan bentuk error yang ditangkap oleh try-catch
    return Promise.reject(error);
  }
);

export default apiClient;
