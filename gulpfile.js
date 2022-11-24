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

sass.compiler = require('node-sass');

let development = environments.development;
let production = environments.production;
if (production()) {
  var now = new Date();
  var valVersion = incrementVersion();
  var textVersionD = 'version: '+valVersion+'\ngenerated: '+dateFormat(now, "dd/mm/yyyy h:MM:ss");
}

let pathBuild = '_build';

const versionConfig = {
  'value': '%TS%',
  'append': {
    'key': 'v',
    'to': ['js','css'],
  },
};

var arrFrameworkCss = [
  'framework/addons/toastr/toastr.min.css'
];
var arrFrameworkJs = [
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
    return del([pathBuild], {force: true});
};

function createFramework (done) {
    //base
    gulp.src(['files_base/**/*']).pipe(gulp.dest(pathBuild+'/'));
    //framework assets
    gulp.src(['assets/**/*']).pipe(gulp.dest(pathBuild+'/assets/'));
    done();
};

function createTranslations (done) {
    //translations
    gulp.src([
        'src/translations/locate-*.json',
      ])
      .pipe(gulp.dest(pathBuild+'/translations/'));
    done();
};

function compileCss () {
    return gulp.src([
        'src/**/*.scss'
    ])
        .pipe(production(concat('assets.min.css')))
        .pipe(plumber())
        .pipe(sass())
        //.pipe(production(cleanCSS({compatibility: 'ie8'})))
        .pipe(production(headerComment(textVersionD)))
        .pipe(gulp.dest(pathBuild+'/assets/css'));
};

function compileJs() {
  return gulp.src(development() ? [
      'src/**/*.js',
      '!src/**/*.prod.js',
      '!src/**/@*.js'
  ] : [
      'src/**/*.js',
      '!src/**/*.dev.js',
      '!src/**/@*.js'
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
    .pipe(gulp.dest(pathBuild+'/assets/js'));
};

function compilePartialJs(done) {
  gulp.src([
      'src/partials/**/@*.js'
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
    .pipe(gulp.dest(pathBuild+'/assets/js/partials'));
    done();
};

function compileHtml() {
  return gulp.src([
    'src/**/*.html'
  ])
    .pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuild+"/templates"));
};

function createAssets(done) {
    //html
    compileHtml();

    //Images/Css/Js
    gulp.src(['src/img/**/*']).pipe(gulp.dest(pathBuild+'/assets/img/'));

    var transformTagCSS = function (filepath, file, i, length) {
      return '<link async rel="stylesheet" href="' + filepath + '">';
    };

    // Assets into project
    var sourcesAsssetsCss = gulp.src(arrFrameworkCss)
        .pipe(production(concat('framework.min.css')))
        .pipe(gulp.dest(pathBuild+'/framework/css'));
    var sourcesAsssetsJs = gulp.src(arrFrameworkJs)
        .pipe(production(concat('framework.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(gulp.dest(pathBuild+'/framework/js'));

    gulp.src('src/dashboard.html')
        .pipe(inject(series([sourcesAsssetsCss,compileCss()]), {ignorePath: pathBuild, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsJs,compileJs()]), {ignorePath: pathBuild, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(headerComment(textVersionD)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuild));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuild+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};

// Connect server
function connectServer(done) {
  connect.server({
      root: pathBuild+'/',
      fallback: pathBuild+'/index.html',
      port: 8080,
      livereload: true
  });
  done();
};

function incrementVersion() {
  var fs = require('fs');
  var docString = fs.readFileSync('src/version.js', 'utf8');

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

  fs.writeFileSync('src/version.js', 'versionBuild = \''+newVersionNumber+'\';');
  return newVersionNumber;
}

function watchFiles() {
  gulp.watch([
    'src/**/*.scss',
  ], gulp.series(compileCss));
  gulp.watch([
    'src/**/*.js',
  ], gulp.series(compileJs, compilePartialJs));
  gulp.watch([
    'src/**/*.html'
  ], gulp.series(createAssets));
  gulp.watch([
    'src/translations/*.json'
  ], gulp.series(createTranslations));
};

// define complex tasks
const build = gulp.series(deleteBuild, createFramework, createTranslations, compilePartialJs, createAssets);

const watch = gulp.parallel(watchFiles, connectServer);
const full = gulp.series(deleteBuild, createFramework, createTranslations, compilePartialJs, createAssets, connectServer);
const server = gulp.series(connectServer);
const buildWatch = gulp.series(deleteBuild, createFramework, compilePartialJs, createTranslations, createAssets, watch);

// export tasks
exports.build = build;
exports.watch = watch;
exports.full = full;
exports.server = server;
exports.default = (production())?build:buildWatch;
