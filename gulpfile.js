const { src, dest, watch, series } = require("gulp");
// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  // compilar sass
  // pasos: 1- Identificar archivo
  src("src/scss/app.scss")
  // Inicializar el sourcemaps
  .pipe(sourcemaps.init())
    // , 2. Compilarla
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    //  3. Guardar el css
    .pipe(dest("build/css"));

  done();
}

function imagenes(done) {
  src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));

  done();
}

function imagenWebp() {
  // Se utiliza return para no usar done
  return src("src/img/**/*{png,jpg}").pipe(webp()).pipe(dest("build/img"));
}

function imagenAvif() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.imagenWebp = imagenWebp;
exports.imagenAvif = imagenAvif;
exports.default = series(imagenes, imagenWebp, imagenAvif, css, dev);
