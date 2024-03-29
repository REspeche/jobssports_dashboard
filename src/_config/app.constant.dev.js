mainApp.constant('BASE_URL', {
    'api': 'http://localhost:3000',
    'secured': true, //[true:default]
    'dashboard': 'http://localhost:8088/',
    'site': 'http://localhost:8080/',
    'oldSite': 'http://old.jobs-sports.com/',
    'socket': 'http://localhost:3000',
    'cdn': 'http://incloux-jobssports-cdn.sfo3.cdn.digitaloceanspaces.com'
  })
  .constant('CONSTANTS', {
    'timeout_ajax': 5000, //milliseconds
    'askOpenNewTab': true,
    'regexMail': '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    'maxFileUpload': '1MB',
    'files': {
      'profile': [600, 600]
    },
    'meta': {
      'keywords': ''
    }
  })
  .constant('COOKIES', {
    'files': {
      'main': 'JOBSSPORTS',
      'settings': 'JOBSSPORTS_SETTINGS'
    },
    'domain': 'localhost'
  })
  .constant('LOGIN', {
    email: 'test.player@jobs-sports.com',
    password: 'jobssports123$',
    enableGmail: false
  });
