// Titleclick
$(`.typewriter`).on('click', () => {
  window.location.href = '/signIn';
})
// Login Page Controller
let working = false;
$('#login').on('submit', function (e) {
  e.preventDefault();
  if (working) return;
  working = true;
  var $this = $(this),
  $state = $this.find('button > .state');
  $this.addClass('loading');
  $.ajax({
    type: 'POST',
    url: '/signIn',
    data: $(this).serialize(),
    success: function (response) {
      if (response.success) {
        $this.removeClass('loading');
        working = false;
        document.getElementById('login').reset()
        alert(response.message);
        $state.html('Log in');
        window.location.href = response.redirect;
      } else {
        working = false;
        $this.removeClass('loading');
        document.getElementById('login').reset()
      }
    },
    error: function (xhr, status, error) {
      $this.removeClass('loading');
      working = false;
      document.getElementById('login').reset()
      $state.html('Log in');
      let response = JSON.parse(xhr.responseText);
      alert(response.error);
    }
  })
})
//  forget password
let resetFormWorking = false;
$('#forgotPassword').on('submit', function (e) {
  e.preventDefault();
  if (resetFormWorking) return;
  resetFormWorking = true;
  var $this = $(this),
  $state = $this.find('button > .state');
  $this.addClass('loading');

  $.ajax({
    type: 'POST',
    url: '/forgotPassword',
    data: $(this).serialize(),
    success: function (response) {
      if (response.success) {
        $this.removeClass('loading');
        resetFormWorking = false;
        document.getElementById('forgotPassword').reset()
        alert(response.message);
        $state.html('Reset');
        window.location.href = '/signIn';
      } else {
        resetFormWorking = false;
        $this.removeClass('loading');
        document.getElementById('forgotPassword').reset()
      }
    },
    error: function (xhr, status, error) {
      $this.removeClass('loading');
      resetFormWorking = false;
      document.getElementById('forgotPassword').reset();
      $state.html('Reset');
      let response = JSON.parse(xhr.responseText);
      alert(response.error);
    }
  })
})
// submit review
$('#sub_rev').on('click', function (e) {
  e.preventDefault();
  let p_review = $('#p_review').val();
  if (p_review.trim().length === 0) {
    return alert("Review can't be empty")
  }
  let userid = $('#userid').val();
  let requestData = {
    p_review: p_review,
    userid: userid
  };
  $.ajax({
  url: '/admin/performance',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(requestData), 
  success: function (response) {
  if (response.success) {
    alert(response.message);
    window.location.href = '/admin/employees';
  }
    },
  error: function (xhr) {
    let response = JSON.parse(xhr.responseText);
    alert(response.error);
    }
  });
});
// submit feedback
$('#fed_btn').on('click', function (e) {
  e.preventDefault();
  let p_feed = $('#p_feed').val();
  if (p_feed.trim().length === 0) {
    return alert("Feedback can't be empty")
  }
  let perf_id = $('#perf_id').val();
  let requestData = {
    p_feed: p_feed,
    perf_id:perf_id
  };
  $.ajax({
  url: '/employee/feedback',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(requestData), 
  success: function (response) {
  if (response.success) {
    alert(response.message);
    window.location.href = '/employee/pendingfeedbacks';
  }
    },
  error: function (xhr) {
    let response = JSON.parse(xhr.responseText);
    alert(response.error);
    window.location.href = '/employee/pendingfeedbacks';
    }
  });
});
// submit edited revies
$('#sub_updated_rev').on('click', function (e) {
  e.preventDefault();
  let p_review = $('#p_review').val();
  if (p_review.trim().length === 0) {
    return alert("Review can't be empty")
  }
  let perf_id = $('#perf_id').val();
  let requestData = {
    p_review: p_review,
    perf_id: perf_id
  };
  $.ajax({
  url: '/admin/editperformance',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(requestData), 
  success: function (response) {
  if (response.success) {
    alert(response.message);
    window.location.href = '/admin/employees';
  }
    },
  error: function (xhr) {
    let response = JSON.parse(xhr.responseText);
    alert(response.error);
    }
  });
});
// control submit button on edit review page
$('#edit_rev').on('click', function (e) {
  e.preventDefault();
  $(this).prop('disabled', true);
  $('#sub_updated_rev').prop('disabled', false);
  $('#p_review').prop('disabled', false);
});
// restrict multiselect
$('#multiselect').on('change', function () {
  var selectedOptions = $(this).val();
  $('#multiselect option').prop('disabled', false);
  if (selectedOptions && selectedOptions.length > 2) {
    $('#multiselect').val([])
    alert("Only two options can be selected")
  }
});
// validate and allocate performance
$('#sub_allocation').on('click', function (e) {
  e.preventDefault();
  console.log("Clicked")
  var $dropdown = $('#dropdown');
  var $multiselect = $('#multiselect');
  var selectedOption = $dropdown.val();
  var options = $multiselect.val();
  if (options.includes(selectedOption)) {
      alert('Allocated to is present in allocated.');
  } else {
  var selectedOptions = $('#multiselect').find('option:selected');
  var allocToValue = selectedOptions.map(function() {
    var option = $(this);
    return {
        alloc: option.data("alloc")
    };
}).get();
  var allocatedValue = $dropdown.find('option:selected').data("alloc_to");
  var requestData = {
      dropdown: allocatedValue,
      multiselect: allocToValue
  };
  $.ajax({
      url: '/admin/allocparticipation',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    success: function (response) {
          if (response.success) {
              alert(response.message);
              window.location.href = '/admin/employees';
          }
      },
    error: function (xhr) {
          let response = JSON.parse(xhr.responseText);
          alert(response.error);
      }
  });
}
});
// On dropdoen change in peformance participation page
let $dropdown = $('#dropdown');
let $multiselect = $('#multiselect');
$dropdown.on('change', function () {
    var selectedOption = $(this).val();
    var options = $multiselect.val();
    if (options.includes(selectedOption)) {
        alert('Allocated to is present in allocated.');
    }
});