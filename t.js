(function () {
  console.log('-----')
  setTimeout(() => {
    document.getElementById('content').innerText = 'hello'
  }, 1000);
  function say() {
    alert('t')
  }
  const module = {
    exports: {}
  }
  module.exports.say = say;
  window.installedModules['./t.js'] = module.exports
})()