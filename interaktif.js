// Menunggu hingga seluruh halaman HTML dimuat sebelum menjalankan skrip
document.addEventListener("DOMContentLoaded", function() {
    
    // Cari elemen formulir di HTML
    const form = document.getElementById("form-kelayakan");

    // Tambahkan 'event listener' ke formulir
    form.addEventListener("submit", function(event) {
        // Mencegah halaman me-refresh saat tombol submit ditekan
        event.preventDefault(); 
        
        // Sembunyikan hasil dan error sebelumnya
        document.getElementById("hasil-penilaian").style.display = "none";
        document.getElementById("error-message").style.display = "none";
        document.getElementById("error-message").textContent = "";

        // --- 1. Ambil Semua Input dari HTML ---
        const TOTAL_PERTEMUAN = 12;
        const nama = document.getElementById("nama").value;
        
        // Ambil nilai numerik
        const masuk = parseInt(document.getElementById("masuk").value);
        const tidak_masuk_tugas = parseInt(document.getElementById("tidak_masuk_tugas").value);
        const tidak_masuk = parseInt(document.getElementById("tidak_masuk").value);
        
        const ujian_tulis = parseInt(document.getElementById("ujian_tulis").value);
        const ujian_lisan = parseInt(document.getElementById("ujian_lisan").value);
        const ujian_praktek = parseInt(document.getElementById("ujian_praktek").value);
        
        // --- 2. Validasi Input (Sama seperti di Python) ---
        let errors = [];

        // Cek nama
        if (nama.trim() === "") {
            errors.push("- Nama tidak boleh kosong.");
        }

        // Cek error 'ValueError' dan angka negatif
        if (isNaN(masuk) || isNaN(tidak_masuk_tugas) || isNaN(tidak_masuk) || isNaN(ujian_tulis) || isNaN(ujian_lisan) || isNaN(ujian_praktek)) {
            errors.push("- Semua input harus berupa angka.");
        }
        if (masuk < 0 || tidak_masuk_tugas < 0 || tidak_masuk < 0) {
             errors.push("- Jumlah pertemuan tidak boleh negatif.");
        }

        // Cek total pertemuan
        const total_input_pertemuan = masuk + tidak_masuk_tugas + tidak_masuk;
        if (total_input_pertemuan !== TOTAL_PERTEMUAN) {
            errors.push(`- Total pertemuan yang Anda masukkan (${total_input_pertemuan}) tidak sesuai. Seharusnya ${TOTAL_PERTEMUAN}.`);
        }
        
        // Cek rentang nilai ujian
        if (!(0 <= ujian_tulis && ujian_tulis <= 100 && 0 <= ujian_lisan && ujian_lisan <= 100 && 0 <= ujian_praktek && ujian_praktek <= 100)) {
            errors.push("- Nilai ujian harus berada di antara 0 dan 100.");
        }

        // Jika ada error, tampilkan dan hentikan fungsi
        if (errors.length > 0) {
            const errorMsg = document.getElementById("error-message");
            errorMsg.innerHTML = "[ERROR]\n" + errors.join("\n");
            errorMsg.style.display = "block";
            window.scrollTo(0, 0); // Scroll ke atas untuk melihat error
            return;
        }
        
        // --- 3. Lakukan Perhitungan (Sama seperti di Python) ---
        
        const poin_kehadiran = (masuk * 1) + (tidak_masuk_tugas * 0.5) + (tidak_masuk * 0);
        const presentase_kehadiran = (poin_kehadiran / TOTAL_PERTEMUAN) * 100;
        
        const nilai_ujian = (ujian_tulis * 0.3) + (ujian_lisan * 0.3) + (ujian_praktek * 0.4);
        
        const predikat_keaktifan = (presentase_kehadiran * 0.5) + (nilai_ujian * 0.5);

        let category = "";
        if (predikat_keaktifan >= 90) {
          category = "SANGAT AKTIF";
        } else if (predikat_keaktifan >= 75) {
          category = "AKTIF";
        } else if (predikat_keaktifan >= 60) {
          category = "CUKUP AKTIF";
        } else if (predikat_keaktifan >= 25) {
          category = "KURANG AKTIF";
        } else {
          category = "TIDAK AKTIF";
        }

        const syarat_kehadiran_terpenuhi = presentase_kehadiran >= 75;
        const syarat_ujian_terpenuhi = nilai_ujian >= 75;

        // --- 4. Tampilkan Hasil ke HTML ---
        
        // Tampilkan area hasil
        const hasilDiv = document.getElementById("hasil-penilaian");
        hasilDiv.style.display = "block";
        
        // Isi data hasil
        const nama_kapital = nama.toUpperCase();
        document.getElementById("hasil-nama").textContent = nama_kapital;
        document.getElementById("hasil-presentase").textContent = `${presentase_kehadiran.toFixed(2)}%`;
        document.getElementById("hasil-nilai-ujian").textContent = nilai_ujian.toFixed(2);
        document.getElementById("hasil-keterangan-keaktifan").textContent = `${predikat_keaktifan.toFixed(2)} (${category})`;

        // Logika untuk status kelayakan
        const statusDiv = document.getElementById("status-kelayakan");
        const alasanUl = document.getElementById("alasan-kelayakan");
        alasanUl.innerHTML = ""; // Kosongkan daftar alasan

        if (syarat_kehadiran_terpenuhi && syarat_ujian_terpenuhi) {
            statusDiv.textContent = "SELAMAT! Anda dinyatakan LAYAK mendapatkan sertifikat";
            statusDiv.className = "status-layak";
        } else {
            statusDiv.textContent = "MOHON MAAF. Anda dinyatakan TIDAK LAYAK mendapatkan sertifikat";
            statusDiv.className = "status-tidak-layak";
            
            if (!syarat_kehadiran_terpenuhi) {
                const li = document.createElement("li");
                li.textContent = `Presentase kehadiran ${presentase_kehadiran.toFixed(2)}% (Minimum: 75%)`;
                alasanUl.appendChild(li);
            }
            if (!syarat_ujian_terpenuhi) {
                const li = document.createElement("li");
                li.textContent = `Nilai ujian ${nilai_ujian.toFixed(2)} (Minimum: 75)`;
                alasanUl.appendChild(li);
            }
        }
        
        // Predikat akhir
        document.getElementById("predikat-akhir").textContent = `Ananda ${nama_kapital} dinyatakan ${category} dalam pertemuan Ekstrakulikuler EC.`;

        // Scroll ke bawah untuk melihat hasil
        hasilDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

});
