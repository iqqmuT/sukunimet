var pieChart;

function drawPie(data) {
  var initialData = {
    labels: ['Valitut', 'Muut'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(2, 117, 235, 1)',
      ],
      borderWidth: 0,
    }],
  };

  var ctx = $('#pieChart');
  var options = {
    legend: {
      display: false,
    },
  };

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: initialData,
    options: options,
  });
}

function handleClick(idx) {
  var i = 0;
  $('.list-group-item').removeClass('selected');
  $('.list-group-item').each(function(item) {
    if (i <= idx) {
      $(this).addClass('selected');
    }
    i++;
  });

  if (nameData) {
    var sum = 0;
    for (var i = 0; i < nameData.length && i <= idx; i++) {
      sum += nameData[i].per;
    }

    pieChart.data.datasets.forEach(function(dataset) {
      dataset.data = [sum, 100 - sum];
    });
    pieChart.update();
  }
}

function renderNames() {
  if (nameData) {
    var nameList = $('#name-list');
    for (var i = 0; i < nameData.length; i++) {
      var entry = nameData[i];
      var precision = entry.per < 0.1 ? 1000 : 100;
      var num = '' + Math.round(entry.per * precision) / precision;
      if (entry.per < 0.001) {
        num = '<0,001';
      }
      var text = '<span class="idx">' + (i + 1) + '</span>';
      text += '<span class="name">' + entry.start + '</span> <span class="percentage">' + num.replace('.', ',') + '&nbsp;%</span>';
      var newItem = $('<a href="#" class="list-group-item list-group-item-action" data-idx="' + i + '">' + text + '</a>');
      nameList.append(newItem);
    }
  }

  $('.list-group-item').on('click', function() {
    var idx = $(this).data('idx');
    handleClick(idx);
    return false;
  });
}


$(document).ready(function() {
  renderNames();
  drawPie();
});
