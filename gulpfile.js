let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');
let inject = require("gulp-inject");
let cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify-es').default;
let revOutdated  = require('gulp-rev-outdated');
let clean = require('gulp-clean');
let replace = require('gulp-replace');
let rename = require('gulp-rename');
let connect = require('gulp-connect');
let del = require('del');
let series = require('stream-series');
let environments = require('gulp-environments');
let headerComment = require('gulp-header-comment');
let dateFormat = require('dateformat');
let version = require('gulp-version-number');
let argv = require('yargs').argv;

sass.compiler = require('node-sass');

let development = environments.development;
let production = environments.production;
if (production()) {
  var now = new Date();
  if (argv.type=='site' || !argv.type) {
    var valVersionSite = incrementVersion('site');
    var textVersionS = 'version: '+valVersionSite+'\ngenerated: '+dateFormat(now, "dd/mm/yyyy h:MM:ss");
  }
  if (argv.type=='dashboard' || !argv.type) {
    var valVersionDashboard = incrementVersion('dashboard');
    var textVersionD = 'version: '+valVersionDashboard+'\ngenerated: '+dateFormat(now, "dd/mm/yyyy h:MM:ss");
  }
}

let pathBuildSite = '_build_site';
let pathBuildDashboard = '_build_dashboard';

const versionConfig = {
  'value': '%TS%',
  'append': {
    'key': 'v',
    'to': ['js','css'],
  },
};

var arrFrameworkSiteCss = [
  'framework/addons/toastr/toastr.min.css'
];
var arrFrameworkSiteJs = [
  'framework/jquery/jquery-3.6.1.min.js',
  'framework/angular/angular.js',
  'framework/angular/angular-ui-router.js',
  'framework/angular/angular-sanitize.js',
  'framework/angular/angular-cookies.js',
  'framework/angular/angular-idle.js',
  'framework/angular/ocLazyLoad.js',
  'framework/bootstrap/ui-bootstrap-tpls.js',
  'framework/addons/angular-translate/angular-translate.min.js',
  'framework/addons/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
  'framework/addons/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
  'framework/addons/angular-translate-storage-local/angular-translate-storage-local.js',
  'framework/addons/toastr/toastr.min.js'
];

var arrFrameworkDashboardCss = [
  'framework/addons/toastr/toastr.min.css'
];
var arrFrameworkDashboardJs = [
  'framework/jquery/jquery-3.6.1.min.js',
  'framework/angular/angular.js',
  'framework/angular/angular-ui-router.js',
  'framework/angular/angular-sanitize.js',
  'framework/angular/angular-cookies.js',
  'framework/angular/angular-idle.js',
  'framework/angular/ocLazyLoad.js',
  'framework/bootstrap/ui-bootstrap-tpls.js',
  'framework/addons/angular-translate/angular-translate.min.js',
  'framework/addons/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
  'framework/addons/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
  'framework/addons/angular-translate-storage-local/angular-translate-storage-local.js',
  'framework/addons/toastr/toastr.min.js'
];

//Clean build folder
function deleteBuild () {
    return del([pathBuildSite, pathBuildDashboard], {force: true});
};
function deleteBuildSite () {
    return del([pathBuildSite], {force: true});
};
function deleteBuildDashboard () {
    return del([pathBuildDashboard], {force: true});
};

function createFramework (done) {
    //base
    gulp.src(['files_base/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src(['files_base/**/*']).pipe(gulp.dest(pathBuildDashboard+'/'));
    //framework assets
    gulp.src(['assets/**/*']).pipe(gulp.dest(pathBuildSite+'/assets/'));
    gulp.src(['assets/**/*']).pipe(gulp.dest(pathBuildDashboard+'/assets/'));
    done();
};
function createFrameworkSite (done) {
    //base
    gulp.src(['files_base/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    //framework assets
    gulp.src(['assets/**/*']).pipe(gulp.dest(pathBuildSite+'/assets/'));
    done();
};
function createFrameworkDashboard (done) {
    //base
    gulp.src(['files_base/**/*']).pipe(gulp.dest(pathBuildDashboard+'/'));
    //framework assets
    gulp.src(['assets/**/*']).pipe(gulp.dest(pathBuildDashboard+'/assets/'));
    done();
};

function createTranslations (done) {
    //translations
    gulp.src([
        'src_site/translations/locate-*.json'
      ])
      .pipe(gulp.dest(pathBuildSite+'/translations/'));

    gulp.src([
        'src_dashboard/translations/locate-*.json'
      ])
      .pipe(gulp.dest(pathBuildDashboard+'/translations/'));
    done();
};
function createTranslationsSite (done) {
    //translations
    gulp.src([
        'src_site/translations/locate-*.json'
      ])
      .pipe(gulp.dest(pathBuildSite+'/translations/'));
    done();
};
function createTranslationsDashboard (done) {
    //translations
    gulp.src([
        'src_dashboard/translations/locate-*.json'
      ])
      .pipe(gulp.dest(pathBuildDashboard+'/translations/'));
    done();
};

function compileSiteCss () {
    return gulp.src([
        'src_site/**/*.scss'
    ])
        .pipe(production(concat('assets.min.css')))
        .pipe(plumber())
        .pipe(sass())
        //.pipe(production(cleanCSS({compatibility: 'ie8'})))
        .pipe(production(headerComment(textVersionS)))
        .pipe(gulp.dest(pathBuildSite+'/assets/css'));
};
function compileDashboardCss () {
    return gulp.src([
        'src_dashboard/**/*.scss'
    ])
        .pipe(production(concat('assets.min.css')))
        .pipe(plumber())
        .pipe(sass())
        //.pipe(production(cleanCSS({compatibility: 'ie8'})))
        .pipe(production(headerComment(textVersionD)))
        .pipe(gulp.dest(pathBuildDashboard+'/assets/css'));
};

function compileSiteJs() {
  return gulp.src(development() ? [
      'src/**/*.js',
      'src_site/**/*.js',
      '!src/**/*.prod.js',
      '!src/**/@*.js',
      '!src_site/**/*.prod.js',
      '!src_site/**/@*.js'
  ] : [
      'src/**/*.js',
      'src_site/**/*.js',
      '!src/**/*.dev.js',
      '!src/**/@*.js',
      '!src_site/**/*.dev.js',
      '!src_site/**/@*.js'
  ])
    .pipe(production(concat('assets.min.js')))
    .pipe(rename(function (path) {
        path.basename = path.basename.replace(development()?'.dev':'.prod','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    .pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+'/assets/js'));
};
function compileDashboardJs() {
  return gulp.src(development() ? [
      'src/**/*.js',
      'src_dashboard/**/*.js',
      '!src_dashboard/**/*.prod.js',
      '!src_dashboard/**/@*.js',
      '!src/**/*.prod.js',
      '!src/**/@*.js'
  ] : [
      'src/**/*.js',
      'src_dashboard/**/*.js',
      '!src/**/*.dev.js',
      '!src/**/@*.js',
      '!src_dashboard/**/*.dev.js',
      '!src_dashboard/**/@*.js'
  ])
    .pipe(production(concat('assets.min.js')))
    .pipe(rename(function (path) {
        path.basename = path.basename.replace(development()?'.dev':'.prod','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    .pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+'/assets/js'));
};

function compilePartialSiteJs(done) {
  gulp.src([
      'src/partials/**/@*.js',
      'src_site/partials/**/@*.js'
    ])
    .pipe(rename(function (path) {
        path.basename = path.basename.replace('@','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    .pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+'/assets/js/partials'));
    done();
};
function compilePartialDashboardJs(done) {
  gulp.src([
      'src/partials/**/@*.js',
      'src_dashboard/partials/**/@*.js'
    ])
    .pipe(rename(function (path) {
        path.basename = path.basename.replace('@','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    .pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+'/assets/js/partials'));
    done();
};

function compileSiteHtml() {
  return gulp.src([
    'src/**/*.html',
    'src/**/*.json',
    'src_site/**/*.html',
    'src_site/**/*.json'
  ])
    .pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+"/templates"));
};
function compileDashboardHtml() {
  return gulp.src([
    'src/**/*.html',
    'src/**/*.json',
    'src_dashboard/**/*.html',
    'src_dashboard/**/*.json'
  ])
    .pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+"/templates"));
};

function createAssets(done) {
    //html
    compileSiteHtml();
    compileDashboardHtml();

    //Images/Css/Js
    gulp.src(['src/img/**/*', 'src_site/img/**/*']).pipe(gulp.dest(pathBuildSite+'/assets/img/'));
    gulp.src(['src/img/**/*', 'src_dashboard/img/**/*']).pipe(gulp.dest(pathBuildDashboard+'/assets/img/'));

    // Assets Site into project
    var sourcesAsssetsSiteCss = gulp.src(arrFrameworkSiteCss)
        .pipe(production(concat('framework.min.css')))
        .pipe(gulp.dest(pathBuildSite+'/framework/css'));
    var sourcesAsssetsSiteJs = gulp.src(arrFrameworkSiteJs)
        .pipe(production(concat('framework.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(gulp.dest(pathBuildSite+'/framework/js'));

    gulp.src('src_site/site.html')
        .pipe(inject(series([sourcesAsssetsSiteCss,compileSiteCss()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsSiteJs,compileSiteJs()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(headerComment(textVersionS)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildSite));

    // Assets Dashboard into project
    var sourcesAsssetsDashboardCss = gulp.src(arrFrameworkDashboardCss)
        .pipe(production(concat('framework.min.css')))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/css'));
    var sourcesAsssetsDashboardJs = gulp.src(arrFrameworkDashboardJs)
        .pipe(production(concat('framework.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/js'));

    gulp.src('src_dashboard/dashboard.html')
        .pipe(inject(series([sourcesAsssetsDashboardCss,compileDashboardCss()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsDashboardJs,compileDashboardJs()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(headerComment(textVersionD)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildDashboard));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildSite+'/*.*', pathBuildDashboard+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};
function createAssetsSite(done) {
    //html
    compileSiteHtml();

    //Images/Css/Js
    gulp.src(['src/img/**/*', 'src_site/img/**/*']).pipe(gulp.dest(pathBuildSite+'/assets/img/'));

    // Assets Site into project
    var sourcesAsssetsSiteCss = gulp.src(arrFrameworkSiteCss)
        .pipe(production(concat('framework.min.css')))
        .pipe(gulp.dest(pathBuildSite+'/framework/css'));
    var sourcesAsssetsSiteJs = gulp.src(arrFrameworkSiteJs)
        .pipe(production(concat('framework.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(gulp.dest(pathBuildSite+'/framework/js'));

    gulp.src('src_site/site.html')
        .pipe(inject(series([sourcesAsssetsSiteCss,compileSiteCss()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsSiteJs,compileSiteJs()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(headerComment(textVersionS)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildSite));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildSite+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};
function createAssetsDashboard(done) {
    //html
    compileDashboardHtml();

    //Images/Css/Js
    gulp.src(['src/img/**/*', 'src_dashboard/img/**/*']).pipe(gulp.dest(pathBuildDashboard+'/assets/img/'));

    // Assets Dashboard into project
    var sourcesAsssetsDashboardCss = gulp.src(arrFrameworkDashboardCss)
        .pipe(production(concat('framework.min.css')))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/css'));
    var sourcesAsssetsDashboardJs = gulp.src(arrFrameworkDashboardJs)
        .pipe(production(concat('framework.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/js'));

    gulp.src('src_dashboard/dashboard.html')
        .pipe(inject(series([sourcesAsssetsDashboardCss,compileDashboardCss()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsDashboardJs,compileDashboardJs()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(headerComment(textVersionD)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildDashboard));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildDashboard+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};

// Connect server
function connectServer(done) {
  connect.server({
      root: pathBuildDashboard+'/',
      fallback: pathBuildDashboard+'/index.html',
      port: 8088,
      livereload: true
  });
  connect.server({
      root: pathBuildSite+'/',
      fallback: pathBuildSite+'/index.html',
      port: 8080,
      livereload: true
  });
  done();
};

function incrementVersion(type) {
  var fs = require('fs');
  var docString = fs.readFileSync('src_'+type+'/version.js', 'utf8');

  var versionNumPattern=/versionBuild = '(.*)';/;
  var vNumRexEx = new RegExp(versionNumPattern);
  var oldVersionNumber = (vNumRexEx.exec(docString))[1];

  var versionParts = oldVersionNumber.split('.');
  var vArray = {
      vMajor : versionParts[0],
      vMinor : versionParts[1],
      vPatch : versionParts[2]
  };

  vArray.vPatch = parseFloat(vArray.vPatch) + 1;
  var periodString = ".";

  var newVersionNumber = vArray.vMajor + periodString +
                         vArray.vMinor+ periodString +
                         vArray.vPatch;

  fs.writeFileSync('src_'+type+'/version.js', 'versionBuild = \''+newVersionNumber+'\';');
  return newVersionNumber;
}

function watchFiles() {
  gulp.watch([
    'src/**/*.scss',
    'src_dashboard/**/*.scss'
  ], gulp.series(compileDashboardCss));
  gulp.watch([
    'src/**/*.scss',
    'src_site/**/*.scss'
  ], gulp.series(compileSiteCss));
  gulp.watch([
    'src/**/*.js',
    'src_site/**/*.js'
  ], gulp.series(compileSiteJs, compilePartialSiteJs));
  gulp.watch([
    'src/**/*.js',
    'src_dashboard/**/*.js'
  ], gulp.series(compileDashboardJs, compilePartialDashboardJs));
  gulp.watch([
    'src/**/*.html',
    'src_site/**/*.html',
    'src_dashboard/**/*.html'
  ], gulp.series(createAssets));
  gulp.watch([
    'src/translations/*.json',
    'src_site/translations/*.json',
    'src_dashboard/translations/*.json'
  ], gulp.series(createTranslations));
};

// define complex tasks
const build = gulp.series(deleteBuild, createFramework, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets);
const buildSite = gulp.series(deleteBuildSite, createFrameworkSite, createTranslationsSite, compilePartialSiteJs, createAssetsSite);
const buildDashboard = gulp.series(deleteBuildDashboard, createFrameworkDashboard, createTranslationsDashboard, compilePartialDashboardJs, createAssetsDashboard);

const watch = gulp.parallel(watchFiles, connectServer);
const full = gulp.series(deleteBuild, createFramework, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets, connectServer);
const server = gulp.series(connectServer);

const buildWatch = gulp.series(deleteBuild, createFramework, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets, watch);

// export tasks
exports.build = build;
exports.buildSite = buildSite;
exports.buildDashboard = buildDashboard;
exports.watch = watch;
exports.full = full;
exports.server = server;
exports.default = (production())?build:buildWatch;
