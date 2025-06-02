

(function (document, window) {
  var isAdvancedUpload = function () {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }();


  // applying the effect for every form
  var drags = document.querySelectorAll('.drag-file');
  drags.forEach(drag => {
    let form = drag.closest('form')
    if (!form || drag.classList.contains('has-advanced-upload')) {

      return
    }
    let input = form.querySelector('input[type="file"]'),

      label = form.querySelector('.drag-file__input label span'),
      errorMsg = form.querySelector('.drag-file__message'),
      dismiss = form.querySelector('.drag-file__dismiss-icon'),
      restart = form.querySelectorAll('.drag-file__restart'),
      droppedFiles = false,
      showFiles = function (files) {
        // label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
        const filename = files[0].name;
        if (filename.substring(0, filename.lastIndexOf('.')).length > 19) {
          label.textContent = filename.substring(0, filename.lastIndexOf('.')).slice(0, 19) + '…' + filename.substring(filename.lastIndexOf('.') + 1, filename.length)
        }
        else (
          label.textContent = filename
        )
      },
      triggerFormSubmit = function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('submit', true, false);
        form.dispatchEvent(event);
      },
      validateSize = function (input) {
        const fileSize = input.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 5.1) {
          errorMsg.textContent = 'Размер файла не должен превышать 5Mb'
          input.value = '';
          return false;
        } else {
          return true
        }
      },
      validateExt = function (input) {

        const filePath = input.value;
        // Allowing file type
        const allowedExtensions =
          /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd|\.pages|\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(filePath)) {
          // alert('Invalid file type');
          errorMsg.textContent = 'Данный формат файла не поддерживается'
          input.value = '';
          return false;
        }
        else {
          return true;
        }
      };

    // automatically submit the form on file select
    input.addEventListener('change', function (e) {

      if (validateExt(e.target) && validateSize(e.target)) {
        showFiles(e.target.files);
        drag.classList.add('file-attached')
        errorMsg.textContent = ''
      }
      else {
        label.textContent = 'Прикрепить файл'
        drag.classList.remove('file-attached')
      }
      // triggerFormSubmit();
    });
    dismiss.addEventListener('click', function (e) {
      e.preventDefault()
      input.value = ''
      drag.classList.remove('file-attached')
      label.textContent = 'Прикрепить файл'
      errorMsg.textContent = ''
    });

    // drag&drop files if the feature is available
    if (isAdvancedUpload) {
      drag.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
        form.addEventListener(event, function (e) {
          // preventing the unwanted behaviours
          e.preventDefault();
          e.stopPropagation();
        });
      });
      ['dragover', 'dragenter'].forEach(function (event) {
        form.addEventListener(event, function () {
          drag.classList.add('is-dragover');
        });
      });
      ['dragleave', 'dragend', 'drop'].forEach(function (event) {
        form.addEventListener(event, function () {
          drag.classList.remove('is-dragover');
        });
      });
      form.addEventListener('drop', function (e) {
        // console.log(e)
        droppedFiles = e.dataTransfer.files; // the files that were dropped
        input.files = droppedFiles
        input.dispatchEvent(new Event('change'))

      });
    }


    // restart the form if has a state of error/success
    Array.prototype.forEach.call(restart, function (entry) {
      entry.addEventListener('click', function (e) {
        e.preventDefault();
        form.classList.remove('is-error', 'is-success');
        input.click();
      });
    });

  });

})(document, window);
