import axios from "axios";
import Cookies from "js-cookie";

// 1. Membuat instance Axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000, // Timeout dalam milidetik (10 detik)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Request Interceptor
// Berguna untuk menyisipkan token autentikasi atau manipulasi request sebelum dikirim
apiClient.interceptors.request.use(
  (config) => {
    // Mengambil token dari cookie
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Anda juga bisa menambahkan logika lain di sini, misalnya loading state
    return config;
  },
  (error) => {
    // Menangani error pada tahap request (jarang terjadi)
    return Promise.reject(error);
  },
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
    let errorMessage = "Something went wrong.";

    if (error.response) {
      // Request berhasil dikirim, namun server merespons dengan status code di luar 2xx
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          console.error("Bad Request: invalid request", data);
          errorMessage = data?.message || "Invalid request.";
          // Tambahkan logika seperti menampilkan toast/notifikasi error
          break;
        case 401:
          console.error(
            "Unauthorized: your session has expired or is invalid.",
          );
          errorMessage =
            data?.message || "Your session has expired or is invalid.";
          // Logika umum: Hapus token dan redirect ke halaman login
          // Cookies.remove('token');
          // Cookies.remove('user');
          // window.location.href = '/login';
          break;
        case 403:
          console.error(
            "Forbidden: You do not have permission to access this resource.",
            data,
          );
          errorMessage =
            data?.message ||
            "You do not have permission to access this resource.";
          break;
        case 404:
          console.error("Not Found: Resource does not exist.", data);
          errorMessage = data?.message || "Resource does not exist.";
          break;
        case 422:
          console.error("Unprocessable Entity: Invalid data", data);
          errorMessage = data?.message || "Invalid data";
          break;
        case 500:
          console.error("Internal Server Error", data);
          errorMessage = data?.message || "Internal Server Error";
          break;
        case 503:
          console.error("Service Unavailable", data);
          errorMessage = data?.message || "Service Unavailable";
          break;
        default:
          console.error(`Something went wrong. Status: ${status}`, data);
          errorMessage = data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request berhasil dikirim, namun tidak ada response yang diterima (misal: koneksi terputus)
      console.error(
        "Network Error: No response received from the server. Check your network connection.",
      );
      errorMessage =
        "No response received from the server. Check your network connection.";
    } else {
      // Sesuatu terjadi saat menyiapkan request yang memicu error
      console.error("Error:", error.message);
      errorMessage = error.message;
    }

    // Tetap kembalikan Promise.reject agar kita bisa menangani error spesifik di fungsi pemanggil (opsional)
    // Gunakan custom object jika ingin menyeragamkan bentuk error yang ditangkap oleh try-catch
    return Promise.reject(new Error(errorMessage));
  },
);

export default apiClient;
