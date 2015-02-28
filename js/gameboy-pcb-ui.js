(function() {
  function requestFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  var module = {};
  var Connection = function(id, name) {
    this.id = id;
    this.name = name;
    this.selected = false;
    this.hovering = false;
  };
  function make_connections(names) {
    var result = {};
    _.forEach(names, function(name) {
      var id = 'pcb-' + name.toLowerCase();
      result[id] = new Connection(id, name);
    });
    return result;
  }
  module.cartridge_connections =
    ['VCC', 'CLK', 'WR', 'RD', 'MREQ'].concat(
      // A0 - A15
      _.range(16).map(function(n) { return 'A' + n; }),
      // D0 - D7
      _.range(8).map(function(n) { return 'D' + n; }),
      ['RS', 'VIN', 'GND']
    );

  module.initialize = function(connection_names, svgs) {
    var connections = make_connections(connection_names);
    var svg_containers = [];

    _.each(connections, function(connection) {
      $('<div></div>')
      .appendTo('#pcb-ui-connections')
      .attr('data-id', connection.id)
      .text(connection.name)
      .on('click', function() { on_click(connection.id); })
      .hover(function() { on_hover(connection.id, true); },
             function() { on_hover(connection.id, false); });
    });

    function find_control(connection) {
      return $('#pcb-ui-connections').find('div[data-id="' + connection.id + '"]');
    }

    function apply_size(size) {
      $('#pcb-ui').attr('class', 'pcb-ui-' + size);
    }

    var controls = $('#pcb-ui-controls');
    controls.find('input[type=radio]').on('change', function() { apply_size(this.value); });
    controls.find('input[type=radio]:checked').each(function() { apply_size(this.value); });

    function set_attrs(id, attrs) {
      return function(svgContainer) {
        var elements = svgContainer.children('#' + id);
        svgContainer.children('#' + id).attr(attrs);
      };
    }

    function on_hover(id, hovering) {
      var connection = connections[id];
      if (!connection)
        throw 'No connection with id=' + id;
      connection.hovering = hovering;
      redraw(connection);
    }

    function redraw(connection) {
      if (connection.selected) {
        var color = (connection.hovering) ? '#000080' : '#0000FF';
        _.each(svg_containers, set_attrs(connection.id, {
          opacity: 0.4,
          fill: color
        }));
      } else {
        var opacity = (connection.hovering) ? 0.4 : 0;
        _.each(svg_containers, set_attrs(connection.id, {
          opacity: opacity,
          fill: '#FF00FF'
        }));
      }
      find_control(connection)
      .toggleClass('hovering', connection.hovering)
      .toggleClass('selected', connection.selected);
    }

    function on_click(id) {
      var connection = connections[id];
      if (!connection)
        throw 'No connection with id=' + id;
      connection.selected = !connection.selected;
      redraw(connection);
    }

    _.forOwn(svgs, function(url, selector) {
      $('<div class="pcb-ui-svg"></div>')
      .appendTo($('#pcb-ui-images'))
      .load(url, function() {
        var container = $(this).find('#pcb-connections');
        container.attr('opacity', null);
        svg_containers.push(container);

        _.each(connections, function(connection) {
          set_attrs(connection.id, {
            title: connection.name
          })(container);
        });

        $(this).find('#pcb-connections > g')
        .attr('opacity', 0)
        .hover(function() { on_hover(this.id, true); },
               function() { on_hover(this.id, false); })
        .on('click', function() { on_click(this.id); });
      });
    });
  };

  module.plant_button = function(connections, svgs) {
    $('<button>Load interactive PCB visualization</button>')
    .appendTo('#pcb-ui')
    .on('click', function() {
      $(this).remove();
      $('#pcb-ui-images').empty();
      $('#pcb-ui-controls').show();
      pcb_ui.initialize(connections, svgs);
    });
  };

  window.pcb_ui = module;
})();
