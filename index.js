$(document).ready(function(){
    // Slick Carousel initialization
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


    // Fetching surah data from API
    fetch('https://equran.id/api/v2/surat')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging: Check received data
            let surahList = $('#surah-list');
            const surahData = data.data; // Save surah data locally
            
            // Function to display list of surahs
            function displaySurahs(surahs) {
                surahList.empty(); // Clear surah list before adding new items
                surahs.forEach(surah => {
                    // Check if surah is bookmarked
                    let isBookmarked = localStorage.getItem(`bookmark_${surah.nomor}`);
                    let bookmarkIconClass = isBookmarked ? 'fas' : 'far'; // Solid or regular star icon

                    // Create surah item with bookmark button
                    let surahItem = $(`
                        <div class="surah-item">
                            <h3><a href="detail.html?nomor=${surah.nomor}">${surah.namaLatin}</a></h3>
                            <p>${surah.arti}</p>
                            <button class="bookmark-btn" data-surah="${surah.nomor}">
                                <i class="${bookmarkIconClass} fa-star fa-lg"></i>
                            </button>
                        </div>
                    `);

                    // Handle bookmark button click
                    surahItem.find('.bookmark-btn').click(function() {
                        let surahNumber = $(this).data('surah');
                        let isBookmarked = localStorage.getItem(`bookmark_${surahNumber}`);
                        
                        // Toggle bookmark state
                        if (isBookmarked) {
                            localStorage.removeItem(`bookmark_${surahNumber}`);
                            $(this).find('i').removeClass('fas').addClass('far');
                        } else {
                            localStorage.setItem(`bookmark_${surahNumber}`, 'true');
                            $(this).find('i').removeClass('far').addClass('fas');
                        }
                    });

                    // Append surah item to surah list
                    surahList.append(surahItem);
                });
            }

            displaySurahs(surahData); // Display surah list when page first loads

            // Handle surah search
            $('#search-input').on('input', function() {
                let searchText = $(this).val().trim().toLowerCase();
                if (searchText === '') {
                    displaySurahs(surahData); // Show all surahs if search is empty
                } else {
                    // Filter surahs based on name or number
                    let filteredSurahs = surahData.filter(surah => {
                        return surah.namaLatin.toLowerCase().includes(searchText) || surah.nomor.toString().includes(searchText);
                    });
                    displaySurahs(filteredSurahs); // Display search results
                }
            });
        })
        .catch(error => console.error('Error:', error));



});
 
