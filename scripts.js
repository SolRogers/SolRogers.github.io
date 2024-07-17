function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

document.addEventListener('DOMContentLoaded', function() {
    const polaroids = document.querySelectorAll('.polaroid');
    let imageIndex = 0;
    let allImagesShown = false;

    function getRandomPosition() {
        const margin = 100; // Margin to avoid placing images too close to the edges
        const spacing = 350; // Increase the spacing between images
        let x, y, validPosition;
        let attempts = 0;
        do {
            if (attempts > 100) { // To prevent infinite loop
                return { x: margin, y: margin };
            }
            x = Math.floor(Math.random() * (window.innerWidth - 300 - margin * 2)) + margin;
            y = Math.floor(Math.random() * (window.innerHeight - 300 - margin * 2)) + margin;
            validPosition = true;

            for (let i = 0; i < imageIndex; i++) {
                const rect = polaroids[i].getBoundingClientRect();
                const distance = Math.hypot(rect.x - x, rect.y - y);
                if (distance < spacing) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        } while (!validPosition);

        return { x, y };
    }

    function getRandomRotation() {
        const angle = Math.floor(Math.random() * 30) - 15; // Random angle between -15 and 15 degrees
        return `rotate(${angle}deg)`;
    }

    function showNextPolaroid() {
        if (imageIndex < polaroids.length) {
            const polaroid = polaroids[imageIndex];
            const { x, y } = getRandomPosition();
            const rotation = getRandomRotation();
            polaroid.style.left = `${x}px`;
            polaroid.style.top = `${y}px`;
            polaroid.style.transform = rotation;
            polaroid.style.opacity = '1';
            console.log(`Showing polaroid ${imageIndex + 1} at (${x}px, ${y}px) with rotation ${rotation}`);
            imageIndex++;
            setTimeout(showNextPolaroid, 1500);  // Slow down appearance by 1.5 seconds
        } else {
            allImagesShown = true;
            document.body.style.overflowY = 'auto';  // Enable vertical scrolling
        }
    }

    function onScroll() {
        const scrollY = window.scrollY;
        console.log(`ScrollY: ${scrollY}, imageIndex: ${imageIndex}, allImagesShown: ${allImagesShown}`);  // Debugging log
        if (!allImagesShown && scrollY > 0) {
            showNextPolaroid();
            window.removeEventListener('scroll', onScroll);  // Ensure the function is called only once on the first scroll
        }
    }

    polaroids.forEach(polaroid => {
        polaroid.style.opacity = '0'; // Hide the polaroids initially
    });

    console.log('Scroll event listener added');
    window.addEventListener('scroll', onScroll);

    // Video autoplay workaround for mobile devices
    const video = document.getElementById('background-video');
    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay was prevented. Adding event listener to play video on interaction.');
            document.addEventListener('click', () => {
                video.play().catch(error => console.error('Error attempting to play video:', error));
            });
            document.addEventListener('touchstart', () => {
                video.play().catch(error => console.error('Error attempting to play video:', error));
            });
        });
    }
});
