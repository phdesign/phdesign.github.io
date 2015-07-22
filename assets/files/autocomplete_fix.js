/*
Author:     Paul Heasley
Date:       15.04.2010
Version:    0.1
Description:
IE and safari do not trigger the onchange events for textboxes when using autocomplete,
so validation events don't trigger. The blur event does trigger however so this script
checks to see if the value has changed (by saving the value on focus) and manually 
calling onchange.
*/

// Closure to avoid naming issues
(function() {

/*
Cross browser event listener registration by John Resig.
http://ejohn.org/blog/flexible-javascript-events/
http://particletree.com/files/designersguide/AddEventHistory.pdf
*/
function addEvent(obj, type, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
		return true;
	} else if (obj.attachEvent) {
		obj['e'+type+fn] = fn;
		obj[type+fn] = function() { obj['e'+type+fn]( window.event );}
		var r = obj.attachEvent('on'+type, obj[type+fn]);
		return r;
	} else {
		obj['on'+type] = fn;
		return true;
	}
}

function onChangeFix() {
	var previousValue = [];
	// Get all input elements
	var inputs = document.getElementsByTagName('input');
	
	for (var i = 0; i < inputs.length; i++) {
		var elt = inputs[i];
		
		// Only update text boxes. Depending on your application you
		// may also need to fix text areas.
		if (elt.type.toLowerCase() == "text")
		{
		    // Save old value.
		    addEvent(elt, 'focus', function() {
				previousValue[this] = this.value;
			});
			
			// Compare to old value, do we need to trigger an onchange event?
			addEvent(elt, 'blur', function() {
				if (previousValue[this] != this.value)
				{
					if (this.onchange)
						this.onchange();
				}
			});
			
			// Set old value = new value to stop the blur event triggering 
			// another onchange.
			addEvent(elt, 'change', function() {
				previousValue[this] = this.value;
			});
		}
	}
}

// Can't access DOM until page is loaded.
addEvent(window, 'load', onChangeFix);

})();