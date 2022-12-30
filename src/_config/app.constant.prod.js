mainApp.constant('BASE_URL', {
    'api': 'http://api.jobs-sports.com',
    'secured': true, //[true:default]
    'dashboard': 'http://dashboard.jobs-sports.com/',
    'site': 'http://jobs-sports.com/',
    'oldSite': 'http://old.jobs-sports.com/',
    'socket': 'http://dashboard.lengolo.com.ar:8080',
    'cdn': 'https://incloux-jobssports-cdn.sfo3.cdn.digitaloceanspaces.com'
  })
  .constant('CONSTANTS', {
    'timeout_ajax': 10000, //milliseconds
    'askOpenNewTab': true,
    'regexMail': '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    'maxFileUpload': '10MB',
    'files': {
      'profile': [300, 300]
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
    'domain': '.jobs-sports.com'
  })
  .constant('LOGIN', {
    email: '',
    password: ''
  });
