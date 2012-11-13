/* ============================================================
 * bootstrap-congress.js v0.1.2
 * ============================================================
 * Copyright 2012 Mervin Fansler
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
 
!function ($) {
  "use strict"; // jshint ;_;
  
 /* CONGRESS CLASS DEFINITION
  * ========================= */
  
  var Congress = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.congress.defaults, options)
    this.sunlightClient = new SunlightClient(options.sunlightApikey)
  }
  
  Congress.prototype = {
    constructor: Congress

  , allForZip: function (zipCode) {
      if (/(^\d{5}$)/.test(zipCode)) {
        this.sunlightClient.legislators.allForZip(zipCode, allForZipCallback(this))
      } else {
        this.clearResults()
        this.displayAlert(this.alertInvalidZip())
      }
    }
  
  , alertInvalidZip: function () {
      return '<div class="alert alert-error">'
        + '<a class="close" data-dismiss="alert" href="#">×</a>'
        + '<h4 class="alert-heading">Oops!</h4>'
        + '<p>Please input a valid ZIP code.</p>'
        + '</div>'
    }
  
  , alertNoResults: function () {
      return '<div class="alert alert-error">'
        + '<a class="close" data-dismiss="alert" href="#">×</a>'
        + '<h4 class="alert-heading">Oops!</h4>'
        + '<p>No results were found.</p>'
        + '</div>'
    }
  
  , alertTooManyResults: function () {
      return '<div class="alert alert-info">'
        + '<a class="close" data-dismiss="alert" href="#">×</a>'
        + '<h4 class="alert-heading">Why So Many Results?</h4>'
        + '<p>Unfortunately, ZIP codes don\'t perfectly match Congressional '
        + 'Districts, so you might see additional names listed.  It '
        + 'shouldn\'t be too hard to sort out, but if you do need help, '
        + 'you can always call the <strong>Congressional Switchboard at '
        + '(202)224-3121</strong>.'
    }
  
  , clearAlerts: function () {
      $(this.options.alert).empty()
    }
    
  , clearResults: function () {
      this.$element.empty()
    }
    
  , displayZipResults: function (legislators) {
      this.clearResults()
      this.clearAlerts()
      this.styleZipResults(legislators)
        .appendTo(this.$element)
    }
    
  , displayAlert: function ($alert) {
      if (this.options.alert) {
        this.clearAlerts()
        $(this.options.alert).append($alert)
      }
    }
    
 /* STYLING METHODS
  * =============== */

  , styleZipResults: function (legislators) {
      var $topRow = $('<tr>')
        , $t = $('<table class="table table-striped">')
          .append($('<thead>')
            .append($topRow)
          )
        , $tbody = $('<tbody>').appendTo($t)
        , that = this
      
      // Add Column Heading Text
      $.each(that.options.fields, function (i, field) {
        var heading = ''
        
        switch(field) {
          case "contact":
            heading = '<th colspan="3">Contact</th>'
            break
          case "district":
            heading = '<th>District</th>'
            break
          case "name":
            heading = '<th>Name</th>'
            break
          case "phone":
            heading = '<th>Phone</th>'
            break
        }
        
        heading && $topRow.append(heading)
      })
    
      // Add Rows
      $.each(legislators, function (i, legislator) {
        var tRow = '<tr>'
        
        $.each(that.options.fields, function (k, field) {
          switch(field) {
            case "contact":
              tRow += that.styleContact(legislator)
              break
            case "district":
              tRow += that.styleDistrict(legislator)
              break
            case "name":
              tRow += that.styleName(legislator)
              break
            case "phone":
              tRow += that.stylePhone(legislator)
              break
          }
        })
        
        $tbody.append(tRow + '</tr>')
      })
      
      return $t
    }
    
  , styleContact: function (legislator) {
      return this.styleWebform(legislator)
        + this.styleTwitter(legislator)
        + this.styleFacebook(legislator)
    }
    
  , styleDistrict: function (legislator) {
      return '<td>'
        + legislator.state
        + (legislator.chamber === 'house' ? '-' + legislator.district : '')
        + '</td>'
    }
    
  , styleName: function (legislator) {
      return '<td>'
        + [ legislator.title
          , legislator.firstname
          , legislator.lastname
          ].join(' ')
        + '</td>'
    }
    
  , stylePhone: function (legislator) {
      return '<td>'
        + '<a class="visible-phone" href="tel:'
        + legislator.phone.split('-').join('')
        + '"><i class="icon-phone"></i></a>'
        + '<p class="hidden-phone">'
        + legislator.phone
        + '</p></td>'
    }
    
  , styleFacebook: function (legislator) {
      var fb = ''
      
      if (legislator.facebook_id) {
        fb = '<a target="_blank" '
          + 'href="http://facebook.com/'
          + legislator.facebook_id
          + '"><i class="icon-facebook"></i></a>'
      }
      
      return '<td>' + fb + '</td>'
    }
    
  , styleTwitter: function (legislator) {
      var tw = ''
      
      if (legislator.twitter_id) {
        tw = '<a target="_blank" '
          + 'href="http://twitter.com/'
          + legislator.twitter_id
          + '"><i class="icon-twitter"></i></a>'
      }
      
      return '<td>' + tw + '</td>'
    }
    
  , styleWebform: function (legislator) {
      var wf = ''
      
      if (legislator.webform) {
        wf = '<a target="_blank" '
          + 'href="'
          + legislator.webform
          + '"><i class="icon-envelope-alt"></i></a>'
      }
      
      return '<td>' + wf + '</td>'
    }
    
  }
  
 /* PRIVATE METHODS
  * =============== */
  
  function allForZipCallback(that) {
    return function (data) {
        
      var legislators = conformZipResult(data)
      
      if (legislators) {
        that.displayZipResults(legislators)
        legislators.length > 3 && that.displayAlert(that.alertTooManyResults())
      } else that.displayAlert(that.alertNoResults())
    }
  }

  function conformZipResult(data) {
    var results = ''
    if (data && data.response && data.response.legislators
      && data.response.legislators.length > 0) {
        results = $.map(data.response.legislators
        , function(n, i) {
            return n.legislator
          }
        )
    }
    
    return results
  }
  
 /* CONGRESS PLUGIN DEFINITION
  * ========================== */

  $.fn.congress = function (option) {
    return this.each(function () {
      
      var $this = $(this)
        , data = $this.data('congress')
        , options = $.extend({}, $.fn.congress.defaults, $this.data()
            , typeof option == 'object' && option
          )
      
      if (typeof options.fields == 'string') {
        options.fields = options.fields.split(' ')
      }
      
      if (!data) $this.data('congress', (data = new Congress(this, options)))
      
      if (typeof option == 'string') data[option]()
      else options.zipCode && data.allForZip(options.zipCode)
    })
  }

  $.fn.congress.defaults = {
      fields: ["district","name","phone","contact"]
  }

  $.fn.congress.Constructor = Congress

 /* CONGRESS DATA-API
  * ================= */

  $(function () {
    $('body').on('submit.congress.data-api'
      , 'form.congress[data-sunlight-apikey]'
      , function ( e ) {
          var $this = $(this), href
            , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            , zipVal = $this.children('.zip-code').val()
            , option = $.extend({}, $target.data(), $this.data(), {"zipCode": zipVal})
          
          e.preventDefault()
          $target.congress(option)
        })
  })
  
}(window.jQuery);