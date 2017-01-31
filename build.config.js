/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      

     'vendor/jquery/dist/jquery.min.js',//old
     //'vendor/jquery/dist/jquery-3.1.1.min.js',
     
     'vendor/datatables/media/js/jquery.dataTables.min.js',//old
    // 'vendor/datatables/media/js/jquery.dataTables-1-10-2.js',
     'vendor/angular/angular.js',//old
     //'vendor/angular/angular1-4-0.js',
     
      //'vendor/angular/angular.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      //'vendor/jquery/dist/jquery.js',

      
      'vendor/Auth/auth.js',
      'vendor/Auth/underscore.js',
      
      'vendor/datatables/media/js/angular-datatables.min.js',//old

      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/ui-utils.js',
      'vendor/ngstorage/ngStorage.min.js',
      'vendor/angular-translate/angular-translate.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',

      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-aria/angular-aria.js',
      //'vendor/angular-cookies/angular-cookies.js',
      'vendor/angular/angular-cookies.min.js',
      'vendor/pagination/dir-pagination.js',
      //
      'vendor/angular-messages/angular-messages.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-sanitize/angular-sanitize.js',
      'vendor/angular-touch/angular-touch.js',
      'vendor/ui-mask/ui-mask.js',
      //"vendor/picklist/fxpicklist.js",
      'vendor/ui-load.js',
      'vendor/ui-jq.js',
      "vendor/angular-ui-select/dist/select.js",
      "vendor/angular-ui-select/dist/select.min.js",
      "vendor/moment/moment.js",
      "vendor/fileupload/angular-file-upload.js",
      "custom-vendors/picklist/fxpicklist.js"
      
      


      
      /*'vendor/directives/setnganimate.js',
      'vendor/directives/ui-butterbar.js',
      'vendor/directives/ui-focus.js',
      'vendor/directives/ui-fullscreen.js',
      'vendor/directives/ui-jq.js',
      'vendor/directives/ui-module.js',
      'vendor/directives/ui-module.js',
      'vendor/directives/ui-module.js',
      'vendor/directives/ui-nav.js',
      'vendor/directives/ui-scroll.js',
      'vendor/directives/ui-shift.js',
      'vendor/directives/ui-toggleclass.js',*/

      //'vendor/wijmo-angular/Dist/controls/wijmo.min.js',
          //  'vendor/wijmo-angular/Dist/controls/wijmo.input.min.js',
           // 'vendor/wijmo-angular/Dist/controls/wijmo.gauge.min.js',
           // 'vendor/wijmo-angular/Dist/interop/angular/wijmo.angular.min.js',

    ],
    css: [
    'vendor/datatables/media/css/jquery.dataTables.css',
    "vendor/angular-ui-select/dist/select.min.css",
    "vendor/angular-ui-select/dist/select.css",
    "vendor/angular-ui-select/dist/select.min.css",
    
    //'vendor/datatables/media/css/bootstrap.min.css',
    'vendor/datatables/media/css/datatables.bootstrap.css'
    
    
    
    
          //  "vendor/vendorcss/select2.css",
           // "vendor/vendorcss/select2-bootstrap.css",
           // "vendor/wijmo-angular/Dist/styles/wijmo.min.css",
           // "vendor/angular/datePicker.css",
           // "vendor/vendorcss/fullcalendar.css",
           // "vendor/vendorcss/mapbox.css"
    ],
    assets: [
    ]
  },
};
