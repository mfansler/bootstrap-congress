/* ============================================================
 * bootstrap-congress.js v1.0.0
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
    this.$element = $(element);
    this.options = $.extend({}, $.fn.congress.defaults, options);
    this.sunlightClient = new SunlightClient(options.sunlightApikey);
  }
  
  Congress.prototype = {
    constructor: Congress
    
  , allForZip: function (zipCode) {
      if (zipCode && zipCode.match(/(^\d{5}$)/)) {
        this.sunlightClient.legislators.allForZip(zipCode, allForZipCallback(this))
      } else {
		this.clearResults()
        this.displayAlert(this.alertInvalidZip())
	  }
    }
    
  , alertInvalidZip: function () {
      return $('<div>')
        .addClass('alert alert-block')
        .append(
          $('<a>')
            .addClass('close')
            .attr({'data-dismiss': 'alert',href: '#'})
            .text('×'),
          $('<h4>')
            .addClass('alert-heading')
            .text('Oops!'),
          $('<p>')
            .text('Please input a valid ZIP code.')
        )
    }
	
  , alertNoResults: function () {
      return $('<div>')
        .addClass('alert alert-error')
        .append(
          $('<a>')
            .addClass('close')
            .attr({'data-dismiss': 'alert',href: '#'})
            .text('×')
        , $('<h4>')
            .addClass('alert-heading')
            .text('Oops!')
        , $('<p>')
            .text('No results were found.')
        )
    }
	
  , alertTooManyResults: function () {
      return $('<div>')
        .addClass('alert alert-info')
		.append(
		  $('<a>')
		    .addClass('close')
		    .attr({'data-dismiss': 'alert',href: '#'})
		    .text('×')
		, $('<h4>')
		    .addClass('alert-heading')
		    .text('Why So Many Results?')
		, $('<p>')
		    .append("Unfortunately, ZIP codes don't perfectly match Congressional Districts, so you might see additional names listed.  It shouldn't be too hard to sort out, but if you do need help, you can always call the <strong>Congressional Switchboard at (202)224-3121</strong>.")
		)
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
        , $t = $('<table>')
          .addClass('table table-striped')
          .append($('<thead>')
            .append($topRow)
          )
        , $tbody = $('<tbody>').appendTo($t)
        , that = this
    
      // Add Column Heading Text
      $.each(that.options.fields, function (i, field) {
        var $th = $('<th>')
        
        switch(field) {
          case "contact":
            $th.text('Contact').attr({colspan: 3})
            break
          case "district":
            $th.text('District')
            break
          case "name":
            $th.text('Name')
            break
          case "phone":
            $th.text('Phone')
            break
        }
        
        $th.text() && $topRow.append($th)
      })
    
      // Add Rows
      $.each(legislators, function (i, legislator) {
      
        var $tr = $('<tr>')
      
        $.each(that.options.fields, function (k, field) {
          switch(field) {
            case "contact":
              $tr.append(that.styleContact(legislator))
              break
            case "district":
              $tr.append(that.styleDistrict(legislator))
              break
            case "name":
              $tr.append(that.styleName(legislator))
              break
            case "phone":
              $tr.append(that.stylePhone(legislator))
              break
          }
        })
      
        $tr.appendTo($tbody)
      })
      
      return $t
    }
    
  , styleContact: function (legislator) {
      return $([this.styleWebform(legislator)[0]
             , this.styleTwitter(legislator)[0]
             , this.styleFacebook(legislator)[0]
             ])
    }
    
  , styleDistrict: function (legislator) {
      return $('<td>').text(
          legislator.state
        + (legislator.chamber === 'house' ? '-' + legislator.district : '')
        )
    }
    
  , styleName: function (legislator) {
      return $('<td>').text(
        [ legislator.title
        , legislator.firstname
        , legislator.lastname
        ].join(' ')
      )
    }
    
  , stylePhone: function (legislator) {
      return $('<td>').append(
          $('<a>')
            .attr({
                href: "tel:" + legislator.phone.split("-").join("")
              , class: "visible-phone"
            })
            .append(
              $('<i>').addClass("icon-phone")
            )
        , $('<p>')
            .addClass("hidden-phone")
            .text(legislator.phone)
        )
    }
    
  , styleFacebook: function (legislator) {
      var $td = $('<td>')
      
      legislator.facebook_id && $td.append(
          $('<a>').attr({
            href: legislator.facebook_id
          , target: '_blank'
          })
          .append(
            $('<i>')
            .addClass('icon-facebook')
          )
        )
      
      return $td
    }
    
  , styleTwitter: function (legislator) {
      var $td = $('<td>')
      
      legislator.twitter_id && $td.append(
          $('<a>').attr({
            href: 'http://twitter.com/' + legislator.twitter_id
          , target: '_blank'
          })
          .append(
            $('<i>')
            .addClass('icon-twitter')
          )
        )
      
      return $td
    }
    
  , styleWebform: function (legislator) {
      var $td = $('<td>')
      
      legislator.webform && $td.append(
          $('<a>').attr({
            href: legislator.webform
          , target: '_blank'
          })
          .append(
            $('<i>')
            .addClass('icon-envelope-alt')
          )
        )
      
      return $td
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
	  }
      else that.displayAlert(that.alertNoResults())
    }
  }

  function conformZipResult(data) {
    var results = ''
    if (data && data.response && data.response.legislators && data.response.legislators.length > 0) {
      results = jQuery.map(data.response.legislators
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
        , options = $.extend({}, $.fn.congress.defaults, $this.data(), typeof option == 'object' && option)
      
      if (typeof options.fields == 'string') options.fields = options.fields.split(' ')
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
    $('body').on('submit.congress.data-api', 'form.congress[data-sunlight-apikey]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , zipVal = $this.children('.zip-code').val()
        , option = $.extend({}, $target.data(), $this.data(), {"zipCode": zipVal})
      
      e.preventDefault()
      $target.congress(option)
    })
  })
  
}(window.jQuery);