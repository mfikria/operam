$(document).ready(() => {
    alert(window.location.pathname);
  if (window.location.pathname === '/text-editor') {
    function insertRandomWord(data) {
      const string = $('#text').val();
      index = Math.floor(Math.random() * string.length);
      $('#text').val(`${string.substr(0, index)} ${data}${string.substr(index)}`);
    }

    function deleteRandom() {
      const string = $('#text').val();
      index = Math.floor(Math.random() * string.length - 6);
      $('#text').val(string.substr(0, index) + string.substr(index + Math.floor(Math.random() * 6)));
    }

    const times = 200;
    for (let i = 0; i < times; i++) {
      $.ajax({
        url: 'http://setgetgo.com/randomword/get.php',
        cache: false,
        success(data) {
          if (Math.random() >= 0.6) {
            insertRandomWord(data);
          } else {
            deleteRandom();
          }
          document.getElementById('text').dispatchEvent(new Event('input'));
        }
      });
    }
  } else if (window.location.pathname === "/flowchart-editor") {

  }
});
