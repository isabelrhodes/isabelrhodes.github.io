let isDragging = false;
let dragStartTime;

const folders = document.querySelectorAll('.folder');
folders.forEach(folder => {
    folder.addEventListener('mousedown', startDrag);
    folder.addEventListener('touchstart', startDrag, { passive: false });
    folder.addEventListener('click', handleClick);

    function startDrag(e) {
        e.preventDefault();
        isDragging = false;
        dragStartTime = Date.now();

        
        const isTouch = e.type === 'touchstart';
        const startX = isTouch ? e.touches[0].clientX : e.clientX;
        const startY = isTouch ? e.touches[0].clientY : e.clientY;

        const rect = folder.getBoundingClientRect();
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;

        folder.style.position = 'absolute';
        folder.style.zIndex = '1000';

        function onMove(moveEvent) {
            const moveX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const moveY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let newLeft = moveX - offsetX;
            let newTop = moveY - offsetY;

            newLeft = Math.max(0, Math.min(viewportWidth - folder.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(viewportHeight - folder.offsetHeight, newTop));

            folder.style.left = `${newLeft}px`;
            folder.style.top = `${newTop}px`;

            isDragging = true;
        }

        function stopDrag() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', stopDrag);

            folder.style.zIndex = '';

            setTimeout(() => {
                isDragging = false;
            }, 100);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    function handleClick(e) {
        if (!isDragging) {
            const page = e.target.closest('.folder-link').getAttribute('href'); 
        } else {
            e.preventDefault(); 
        }
    }
});

function positionFoldersRandomly() {
    const folders = document.querySelectorAll('.folder');
    const screen = document.getElementById('file-screen');
    const screenWidth = screen.offsetWidth;
    const screenHeight = screen.offsetHeight;
    const folderWidth = 150; 
    const folderHeight = 150;
    const margin = 200; 

    const positions = [];

    folders.forEach(folder => {
        let validPosition = false;
        let top, left;

        while (!validPosition) {
            left = Math.random() * (screenWidth - folderWidth - 2 * margin) + margin;
            top = Math.random() * (screenHeight - folderHeight - 2 * margin) + margin;

            validPosition = positions.every(pos => {
                const noOverlap = 
                    left + folderWidth < pos.left || 
                    left > pos.left + folderWidth || 
                    top + folderHeight < pos.top || 
                    top > pos.top + folderHeight;
                return noOverlap;
            });

            if (validPosition) {
                positions.push({ top, left });
            }
        }

        folder.style.position = 'absolute';
        folder.style.left = `${left}px`;
        folder.style.top = `${top}px`;
    });
}
const headerImage = document.querySelector('.header-image');

  headerImage.addEventListener('click', () => {
    window.location.href = '/'; 
  });
window.onload = positionFoldersRandomly;
