if (window.File && window.FileReader && window.FileList && window.Blob) { 
    var fileInput = document.querySelector('#inputImages');
    var watermark = document.querySelector('#watermarkInput');
    var previewContainer = document.querySelector('#previewContainer');
    var previewImageContainer = document.querySelector('#previewImageContainer');

    var addBtn = document.querySelector('#add');
    var mergebtn = document.querySelector('#merge');
    var convertBtn = document.querySelector('#convert');
    var downloadBtn = document.querySelector('#download');

    var loader = document.querySelector('.loader');
    var upIcon = document.querySelector('.quick-navigation svg.up');
    var downIcon = document.querySelector('.quick-navigation svg.down');

    // for storing image data as base64 with image name as obj.
    var canvasImageData = [];
         
    // jsZip Initialization
    var zip = new JSZip();

    addBtn.addEventListener('click', function() {
        try {
            showLoader();
            var Imagefiles = Array.from(fileInput.files);
            Imagefiles.forEach(file => {
                renderImage(file);
            });
            showDownIcon();
            mergebtn.style.display = 'inline-block';
        } catch(e) {
            alert(e);
        }
        hideLoader();
    });

    mergebtn.addEventListener('click', function() {
        try {
            var watermarkImg = Array.from(watermark.files)[0];
            renderWatermarkImage(watermarkImg);
            convertBtn.style.display = 'inline-block';
        } catch (error) {
            alert(error)
        }
    });

    convertBtn.addEventListener('click', function(){
        showLoader();
        convertToCanvas();
    });

    downloadBtn.addEventListener('click', function() {
        showLoader();
        downloadAsZip();
    });

    downIcon.addEventListener('click', function() {
        window.scrollTo(0,document.body.scrollHeight);
        hideDownIcon();
        showUpIcon();
    });

    upIcon.addEventListener('click', function() {
        window.scrollTo(0, 0);
        // hideDownIcon();
        hideUpIcon();
        showDownIcon();
    });

    window.addEventListener('scroll', function() {
        if(window.scrollY > 100) {
            showUpIcon();
        }
    })

    function renderImage(file) {
        var reader = new FileReader();
        reader.onload = async function(event){
           var the_url = event.target.result;

            // create image wrapper element
            var imageDiv = document.createElement('div');
            imageDiv.classList.add('image-preview');

            // image element
            var img = document.createElement('img');
            img.setAttribute('src', the_url);
            img.setAttribute('alt', file.name);

            imageDiv.appendChild(img);
            previewContainer.appendChild(imageDiv);
        }
        reader.readAsDataURL(file);
    }

    function renderWatermarkImage(watermarkImg) {
        var reader2 = new FileReader();
        reader2.onload = function(event) {
            var the_watermark_url = event.target.result;
            var imageWrappers =  document.querySelectorAll('.image-preview');
            imageWrappers.forEach(function(imageDiv) {

                // image element
                var watermark = document.createElement('img');
                watermark.setAttribute('src', the_watermark_url);
                watermark.setAttribute('alt', watermarkImg.name);
                watermark.classList.add('watermark');
                imageDiv.appendChild(watermark);
            })
        }
        reader2.readAsDataURL(watermarkImg);
    }

    function convertToCanvas() {
        try {
            document.querySelectorAll('.image-preview').forEach(function(imageDiv) {
                html2canvas(imageDiv, {
                    allowTaint: false,
                    useCORS: true,
                    letterRendering: 1,
                })
                .then(function(canvas) {
                    previewImageContainer.appendChild(canvas);
                    var imageData = canvas.toDataURL("image/png");
                    var dataObj = {
                        imageData : imageData,
                        fileName : imageDiv.querySelector('img').getAttribute('alt')
                    }
                    canvasImageData.push(dataObj);
                });
                // show convet label
                document.querySelector('.convert-label').style.display= 'block';
        
            });
            hideLoader();
            downloadBtn.style.display = 'inline-block';

        }catch(e) {
            alert(e);
        }

    }

    function downloadAsZip() {
        try {
            canvasImageData.forEach(function(data) { 
                zip.file(data.fileName, rawb64(data.imageData), {base64: true});
            })
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "example.zip");
                hideLoader();
            });
        }catch(e) {
            alert(e);
        }
    }

    function rawb64(src) {
        const q = 'base64,';
        const index = src.indexOf(q);
        if (index === -1) {
            throw new Error('no base64 here');
        }
        return src.substr(index + q.length);
    }

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    function showUpIcon() {
        upIcon.style.display = 'inline-block';
    }

    function showDownIcon() {
        downIcon.style.display = 'inline-block';
    }

    function hideUpIcon() {
        upIcon.style.display = 'none';
    }

    function hideDownIcon() {
        downIcon.style.display = 'none';
    }


} else {
    console.log("your browser don't suport this feature.  ")
}