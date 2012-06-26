bootstrap-congress
==================

A jQuery plugin for Twitter Bootstrap providing US Congress-related widget(s).

This plugin uses the (Sunlight Labs Congress API)[http://services.sunlightlabs.com/docs/Sunlight_Congress_API/] for its queries.

## Dependencies

This plugin depends on the following libraries:

* jQuery
* [Twitter Bootstrap (including responsive)](http://twitter.github.com/bootstrap/)
* [Font-Awesome](http://fortawesome.github.com/Font-Awesome/) - an extended icon library over the default one in Bootstrap
* [jsonp-sunlight](https://github.com/mfansler/jsonp-sunlightapi) - a JSONP-based client library for the Sunlight Labs Congress API

The latter three are all included as submodules of this repo in the `/lib` directory.  (However, I should note that in the tests, the Twitter Bootstrap libraries all come from http://bootstrapcdn.com)

## Setup

Assuming you have the dependencies loaded, just add the `bootstrap-congress.js` library to your page:

``` html
<script src="../js/bootstrap-congress.js"></script>
```

## Basic (HTML-only) Usage

### ZIP Code Congress Lookup

The code below will magically turn into a fully functional congress lookup.

``` html
<form class="congress" data-target="#myCongress" data-alert="#myAlerts" data-sunlight-apikey="YOUR_API_KEY">
  <input type="text" class="zip-code">
  <button type="submit" class="btn btn-info">Find</button>
</form>
<div id="myAlerts"></div>
<div id="myCongress"></div>
```

Okay, it's not really magically. 

The ZIP Code Congress Lookup widget has three components:

1. a `form` to submit a ZIP code
2. a `div` in which to display results
3. a `div` in which to display alerts (optional)

#### ZIP Code Form

The ZIP code `form` needs to have:

* `class="congress"` - the plugin uses this in the selector to find the form
* an `<input>` element with `class="zip-code"` - the plugin uses this for it's query
* a `<button>` to submit the form - the plugin listens for the submit event
* the following attributes:
  * **data-sunlight-apikey** - your Sunlight Labs API key ([get one](http://services.sunlightlabs.com/accounts/register/))
  * **data-target** - the selector for the `div` to display results in
  * **data-alert** - the selector for the `div` to display alerts in (optional)

#### Customizing Results Fields

The results will display in the `div` specified by the selector in the **data-target** attribute of the form.

By specifying field names in the **data-fields** attribute of the target div, the fields, and their order can be customized.

``` html
<div id="myCongress" data-fields="name phone"></div>
```

The fields must be space-separated in the attribute.  The following are the valid fields:

* **contact** - webform, twitter, and facebook
* **district** - state (+ CD if house)
* **name** - title + first + last
* **phone** - uh...

## Advanced (JavaScript) Usage

Bother me and I'll write it up in more detail. :D

In a nutshell, you don't need the form, you really just need a target div.  For example:

``` js
$('<div>').attr({id: "myCongress"}).congress({
    sunlightApikey: "YOUR_API_KEY"
  , alert: "#myAlerts"
  , zipCode: "90210"
}).appendTo('body')
```

Obviously, this might be useful in the case where you might acquire location data from the user by other means.

By including the **zipCode** in the initial setup, it automatically runs the query, but one could leave it out, and just do the query later.  For example:

``` js
$('#myCongress').data('congress').allForZip("44444")
```
