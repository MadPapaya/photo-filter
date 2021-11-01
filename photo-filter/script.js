const imageCurrent = document.querySelector('.image-current');
const fullScreenBtn = document.querySelector(".fullscreen");
const filters = document.querySelectorAll('.filters input');

function activeBtns() {
    const btns = document.querySelectorAll(".btn-container .btn");

    btns.forEach(btn => btn.addEventListener('click', function () {
        const current = document.getElementsByClassName("btn-active");
        current[0].className = current[0].className.replace(" btn-active", "");
        this.className += " btn-active";
    }));
}
activeBtns();

function handleFilters() {
    const btnReset = document.querySelector('.btn-reset');

    function handleUpdate() {
        const suffix = this.dataset.sizing || '';
        imageCurrent.style.setProperty(`--${this.name}`, this.value + suffix);

        const outputs = this.nextElementSibling;
        outputs.innerHTML = this.value;
    }
    filters.forEach(input => input.addEventListener('input', handleUpdate));

    function handleReset() {
        filters.forEach(input => {
            input.name === 'saturate' ? input.value = 100 : input.value = 0;
            imageCurrent.style.setProperty(`--${input.name}`, input.value + (input.dataset.sizing || ''));

            const outputs = input.nextElementSibling;
            outputs.innerHTML = input.value;
        });
    }
    btnReset.addEventListener('click', handleReset);
}
handleFilters();

function nextPicture() {
    const hour = new Date().getHours();
    const btnNextPicture = document.querySelector('.btn-next');
    let basePath = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
    let timeDay = '';

    function getPicturePath() {
        if (hour >= 6 && hour < 12) {
            timeDay = 'morning/';
        } else if (hour >= 12 && hour < 18) {
            timeDay = 'day/';
        } else if (hour >= 18 && hour < 24) {
            timeDay = 'evening/';
        } else {
            timeDay = 'night/';
        }
    }

    const imagesList = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
    let i = 0;

    function getImage() {
        getPicturePath();
        const index = i % imagesList.length;
        const imageSrc = basePath + timeDay + imagesList[index];
        imageCurrent.src = imageSrc;
        i++;
        btnNextPicture.disabled = true;
        setTimeout(function () {
            btnNextPicture.disabled = false;
        }, 250);
    }
    btnNextPicture.addEventListener('click', getImage);
}
nextPicture();

function loadPicture() {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            imageCurrent.src = reader.result;
        }
        reader.readAsDataURL(file);
        fileInput.value = null;
    });
}
loadPicture();

function downloadPicture() {
    const canvas = document.querySelector('canvas');
    const btnSavePicture = document.querySelector('.btn-save');

    function getFilters() {
        let filtersStr = '';
        const rateBlur = imageCurrent.naturalWidth > imageCurrent.naturalHeight ? imageCurrent.naturalWidth / imageCurrent.width : imageCurrent.naturalHeight / imageCurrent.height;
    
        filters.forEach(element => {
          if (element.name !== 'blur') {
            filtersStr += `${ element.name }(${ element.value + element.dataset['sizing'] }) `;
          } else {
            filtersStr += `${ element.name }(${ element.value * rateBlur + element.dataset['sizing'] }) `;
          }
        });

        return filtersStr;
    }

    function createCanvas(img) {
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = getFilters();
        ctx.drawImage(img, 0, 0);
    }

    function savePicture() {
        btnSavePicture.addEventListener('click', () => {
            const request = new Promise((resolve, reject) => {
                const img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = imageCurrent.src;
                img.onload = () => {
                    createCanvas(img);
                    resolve();
                };
            });
            request.then(
                function createLink() {
                    let link = document.createElement('a');
                    link.download = 'picture.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    link.delete;
                }
            );
        });
    }
    savePicture();
}
downloadPicture();

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

fullScreenBtn.onclick = toggleFullscreen;