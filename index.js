$(document).ready(function(){
    // Slick Carousel
    $('.slick-carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 2000,
    });

    $('.testimonial-carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
    });

// index.js
$(document).ready(function(){
    fetch('https://equran.id/api/v2/surat')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging: cek data yang diterima
            let surahList = $('#surah-list');
            const surahData = data.data; // Simpan data surah di variabel lokal
            
            // Fungsi untuk menampilkan daftar surah
            function displaySurahs(surahs) {
                surahList.empty(); // Kosongkan daftar surah sebelum menambahkan yang baru
                surahs.forEach(surah => {
                    let surahItem = `<div class="surah-item">
                                        <h3><a href="detail.html?nomor=${surah.nomor}">${surah.namaLatin}</a></h3>
                                        <p>${surah.arti}</p>
                                    </div>`;
                    surahList.append(surahItem);
                });
            }

            displaySurahs(surahData); // Tampilkan daftar surah saat pertama kali memuat halaman

            // Handle pencarian surah
            $('#search-input').on('input', function() {
                let searchText = $(this).val().trim().toLowerCase();
                if (searchText === '') {
                    displaySurahs(surahData); // Jika search kosong, tampilkan semua surah
                } else {
                    // Filter surah berdasarkan nama atau nomor surah
                    let filteredSurahs = surahData.filter(surah => {
                        return surah.namaLatin.toLowerCase().includes(searchText) || surah.nomor.toString().includes(searchText);
                    });
                    displaySurahs(filteredSurahs); // Tampilkan hasil pencarian
                }
            });
        })
        .catch(error => console.error('Error:', error));
});

function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    var modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
});