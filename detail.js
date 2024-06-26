document.addEventListener("DOMContentLoaded", function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const surahNumber = urlParams.get('nomor');

    if (surahNumber) {
        fetchSurahDetail(surahNumber);
        updateBookmarkButton(surahNumber); // Update bookmark button status when page is loaded
    } else {
        document.getElementById('surah-detail').innerHTML = '<p>Invalid Surah number.</p>';
    }
});

function fetchSurahDetail(nomor) {
    // Pastikan nomor surah adalah angka dan valid
    if (isNaN(nomor) || nomor < 1 || nomor > 114) {
        console.error('Invalid surah number:', nomor);
        document.getElementById('surah-detail').innerHTML = '<p>Invalid Surah number.</p>';
        return;
    }

    fetch(`https://equran.id/api/v2/surat/${nomor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displaySurahDetail(data.data);
        })
        .catch(error => {
            console.error('Error fetching Surah details:', error);
            console.log('Error message:', error.message); // Cetak pesan error
            document.getElementById('surah-detail').innerHTML = '<p>Error fetching Surah details. Please try again later.</p>';
        });
}

function displaySurahDetail(surah) {
    let surahDetail = document.getElementById('surah-detail');
    surahDetail.innerHTML = `
        <h2>${surah.namaLatin} (${surah.arti})</h2>
        <p>${surah.deskripsi}</p>
        <h3>Ayat:</h3>
        <div id="ayat-list"></div>
    `;
    
    let ayatList = document.getElementById('ayat-list');
    surah.ayat.forEach((ayat, index) => {
        let ayatItem = document.createElement('div');
        ayatItem.className = 'ayat-item';
        ayatItem.innerHTML = `
            <h4>Ayat ${ayat.nomorAyat}</h4>
            <p>${ayat.teksArab}</p>
            <p>${ayat.teksLatin}</p>
            <p>${ayat.teksIndonesia}</p>
            <audio controls id="audio-${index}">
                <source src="${ayat.audio['05']}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        ayatList.appendChild(ayatItem);
    });

    // Add event listener for autoplay
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((audio, index) => {
        audio.addEventListener('ended', () => {
            if (index + 1 < audioElements.length) {
                audioElements[index + 1].play();
            }
        });
    });
}

function goBack() {
    window.history.back();
}
