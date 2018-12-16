Drupal.behaviors.registrationForm = function(context){
  "use strict";

  var formObj = $("form.s-user-new-registration-form", context);
  var sRegistrationInstructorCodeWrapper = $('.s-registration-instructor-code', formObj);
  var mainFormSignUp = $("#main-content #sign-up-selector");
  var registerContainer = $("#main-content .registration-container");

  registerContainer.removeAttr("tabindex");
  if (mainFormSignUp.length) {
    registerContainer.attr("tabindex", 0);
    registerContainer.focus();
  }

  if (formObj.hasClass('registrationForm-processed')) {
    return;
  }

  // Track beginning of user registration. Completed registration will be tracked as goal ID:1
  if(typeof piwikTracker != 'undefined') {
    piwikTracker.trackGoal(2);
  }

  formObj.addClass('registrationForm-processed').ajaxForm({
    beforeSubmit: function(arr, $form, options){
      options.url += '&ajax'; // indicate ajax request, so that we can get JSON back

      var thickbox = formObj.closest("#TB_ajaxContent");
      if (thickbox.length) {
        // Progress overlay
        var width = thickbox.width();
        var height = thickbox.height();
        var overlay = $('<div id="ajax-form-overlay"></div>');
        overlay.css({
          'height': height + 'px',
          'width': width + 'px',
          'background-color': 'white',
          'opacity': '.4',
          'position': 'absolute'
        });
        thickbox.prepend(overlay);
      }
    },
    success: function( response , statusText, xhr){
      var accessCodeInput;
      var errorMessage = $(response.output).find('.message-text').text().trim();

      if (response.redirect) {
        window.location = response.redirect;
      } else {
        var output = $(response.output);
        Drupal.attachBehaviors(output);
        $("#registration-form-wrapper").empty().append(output.children());
        if(!Modernizr.input.placeholder) {
          $('input[placeholder],textarea[placeholder]','#s-user-new-registration-form').placeHolder();
        }
        $("#ajax-form-overlay").remove();
      }

      // Resize the thickbox popup
      var thickbox = $("#TB_ajaxContent");
      var wrapper = $('#registration-form-wrapper');
      thickbox.css({
        'height': (wrapper.height() + 28) + 'px' // 28 for title
      });

      accessCodeInput = $('#edit-code');
      accessCodeInput.attr('aria-label', errorMessage);
      $("#registration-form-wrapper").find('input').eq(0).focus();
      $(".message-text").focus();
    }
  });

  if(sRegistrationInstructorCodeWrapper.length === 1) {
    $('#faculty-code-help-link', formObj).click(function(){
      $('#admin-info', formObj).toggle();
    });
    $('#edit-login', formObj).blur(function(){
      var loginField = $(this);
      var loginDomain = loginField.val().split('@')[1];

      if(loginDomain === '' || loginDomain == undefined) {
        return;
      }

      sRegistrationInstructorCodeWrapper.addClass('hidden');
      $('.access-code-loader', formObj).remove();
      $('<img src="/sites/all/themes/schoology_theme/images/ajax-loader.gif" ' +
        'class="loading-image access-code-loader" width="30" height="8" alt="' +
        Drupal.t('Content is loading. Please wait.') + '" />')
          .insertBefore(sRegistrationInstructorCodeWrapper);

      $.ajax('/registration_login_domain', {
        type: 'POST',
        data: {domain: loginDomain},
        success: function(data){
          if(data.is_claimed) {
            $('#admin-info', formObj).html( data.output );
            sRegistrationInstructorCodeWrapper.removeClass('hidden');
          }
        },
        complete: function(){
          $('.access-code-loader', formObj).remove();
        }
      });
    });
    sRegistrationInstructorCodeWrapper.attr("aria-hidden", true);
  }
  formObj.find('input').eq(0).focus();
};

//From date.module date.js
/**
 * Set the client's system time zone as default values of form fields.
 */
function setDefaultTimezone() {
  var dateString = Date();
  // In some client environments, date strings include a time zone
  // abbreviation which can be interpreted by PHP.
  var matches = Date().match(/\(([A-Z]{3,5})\)/);
  var abbreviation = matches ? matches[1] : 0;

  // For all other client environments, the abbreviation is set to "0"
  // and the current offset from UTC and daylight saving time status are
  // used to guess the time zone.
  var dateNow = new Date();
  var offsetNow = dateNow.getTimezoneOffset() * -60;

  // Use January 1 and July 1 as test dates for determining daylight
  // saving time status by comparing their offsets.
  var dateJan = new Date(dateNow.getFullYear(), 0, 1, 12, 0, 0, 0);
  var dateJul = new Date(dateNow.getFullYear(), 6, 1, 12, 0, 0, 0);
  var offsetJan = dateJan.getTimezoneOffset() * -60;
  var offsetJul = dateJul.getTimezoneOffset() * -60;

  // If the offset from UTC is identical on January 1 and July 1,
  // assume daylight saving time is not used in this time zone.
  if (offsetJan == offsetJul) {
    var isDaylightSavingTime = '';
  }
  // If the maximum annual offset is equivalent to the current offset,
  // assume daylight saving time is in effect.
  else if (Math.max(offsetJan, offsetJul) == offsetNow) {
    var isDaylightSavingTime = 1;
  }
  // Otherwise, assume daylight saving time is not in effect.
  else {
    var isDaylightSavingTime = 0;
  }

  // Submit request to the user/timezone callback and set the form field
  // to the response time zone.
  var path = '/user/timezone/' + abbreviation + '/' + offsetNow + '/' + isDaylightSavingTime;
  $.getJSON(path, { date: dateString }, function (data) {
    if (data) {
      $("#edit-timezone-name").val(data);
    }
  });
}
