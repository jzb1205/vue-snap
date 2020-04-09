// Generated by CoffeeScript 1.10.0

/*
jQuery SVG Pan Zoom v1.0.2, June 2015
Author: Daniel Hoffmann Bernardes (daniel.hoffmann.bernardes@gmail.com)
Repository: https://github.com/DanielHoffmann/jquery-svg-pan-zoom/
jQuery plugin to enable pan and zoom in SVG images either programmatically or through mouse/touch events.
[Demo page](http://danielhoffmann.github.io/jquery-svg-pan-zoom/)
 * Features
 - Programmatically manipulate the SVG viewBox
 - Mouse and touch events to pan the SVG viewBox
 - Mousewheel events to zoom in or out the SVG viewBox
 - Animations
 - Mousewheel zooming keeps the cursor over the same coordinates relative to the image (A.K.A. GoogleMaps-like zoom)
 - Limiting the navigable area
 * Requirements
jQuery
SVG-enabled browser (does not work with SVG work-arounds that use Flash)
 * The viewBox
The viewBox is an attribute of SVG images that defines the area of the SVG that is visible, it is defined by 4 numbers: X, Y, Width, Height. These numbers together specify the visible area. This plugin works by manipulating these four numbers. For example, moving the image to the right alters the X value while zooming in reduces Width and Height.
 * Usage

var svgPanZoom= $("svg").svgPanZoom(options)

If the selection has more than one element `svgPanZoom` will return an array with a SvgPanZoom object for each image in the same order of the selection. If only one element is selected then the return is a single SvgPanZoom object. If no elements are selected the above call returns `null`
The returned SvgPanZoom object contains all options, these options can be overriden at any time directly, for example to disable mouseWheel events simply:

svgPanZoom.events.mouseWheel= false

the SvgPanZoom object also has methods for manipulating the viewBox programmatically. For example:

svgPanZoom.zoomIn()

will zoomIn the image using options.zoomFactor.
 * Building
This project requires coffeescript to be installed in order to build.
 `coffee -m --compile --output compiled/ src/`
 * Options

Options:
{
    events: {
        mouseWheel: boolean (true), // enables mouse wheel zooming events
        doubleClick: boolean (true), // enables double-click to zoom-in events
        drag: boolean (true), // enables drag and drop to move the SVG events
        dragCursor: string "move" // cursor to use while dragging the SVG
    },
    animationTime: number (300), // time in milliseconds to use as default for animations. Set 0 to remove the animation
    zoomFactor: number (0.25), // how much to zoom-in or zoom-out
    maxZoom: number (3), //maximum zoom in, must be a number bigger than 1
    panFactor: (number (100), // how much to move the viewBox when calling .panDirection() methods
    initialViewBox: { // the initial viewBox, if null or undefined will try to use the viewBox set in the svg tag. Also accepts string in the format "X Y Width Height"
        x: number (0) // the top-left corner X coordinate
        y: number (0) // the top-left corner Y coordinate
        width: number (1000) // the width of the viewBox
        height: number (1000) // the height of the viewBox
    },
    limits: { // the limits in which the image can be moved. If null or undefined will use the initialViewBox plus 15% in each direction
        x: number (-150)
        y: number (-150)
        x2: number (1150)
        y2: number (1150)
    }
}

 * Methods
 - pan

svgPanZoom.panLeft(amount, animationTime)
svgPanZoom.panRight(amount, animationTime)
svgPanZoom.panUp(amount, animationTime)
svgPanZoom.panDown(amount, animationTime)

Moves the SVG viewBox in the specified direction. Parameters:
 - amount: Number, optional. How much to move the viewBox, defaults to options.panFactor.
 - animationTime: Number, optional. How long the animation should last, defaults to options.animationTime.
 - zoom

svgPanZoom.zoomIn(animationTime)
svgPanZoom.zoomOut(animationTime)

Zooms the viewBox. Parameters:
 - animationTime: Number, optional. How long the animation should last, defaults to options.animationTime.
 - reset

svgPanZoom.reset()

Resets the SVG to options.initialViewBox values.
 - getViewBox

svgPanZoom.getViewBox()

Returns the viewbox in this format:

{
    x: number
    y: number
    width: number
    height: number
}

 - setViewBox

svgPanZoom.setViewBox(x, y, width, height, animationTime)

Changes the viewBox to the specified coordinates. Will respect the `options.limits` adapting the viewBox if needed (moving or reducing it to fit into `options.limits`
 - x: Number, the new x coodinate of the top-left corner
 - y: Number, the new y coodinate of the top-left corner
 - width: Number, the new width of the viewBox
 - height: Number, the new height of the viewBox
 - animationTime: Number, optional. How long the animation should last, defaults to options.animationTime.
 - setCenter

svgPanZoom.setCenter(x, y, animationTime)

Sets the center of the SVG. Parameters:
 - x: Number, the new x coordinate of the center
 - y: Number, the new y coordinate of the center
 - animationTime: Number, optional. How long the animation should last, defaults to options.animationTime.
 * Notes:
 - Only works in SVGs inlined in the HTML. You can use $.load() to load the SVG image in the page using AJAX and call $().svgPanZoom() in the callback
 - Touch pinch events to zoom not yet supported
 - This plugin does not create any controls (like arrows to move the image) on top of the SVG. These controls are simple to create manually and they can call the methods to move the image.
 - Do not manipulate the SVG viewBox attribute manually, use SvgPanZoom.setViewBox() instead
Copyright (C) 2014 Daniel Hoffmann Bernardes, Ícaro Technologies
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
  var hasProp = {}.hasOwnProperty;

  (function($) {
    var checkLimits, defaultOptions, defaultViewBox, getViewBoxCoordinatesFromEvent, parseViewBoxString;
    defaultOptions = {
      events: {
        mouseWheel: true,
        doubleClick: true,
        drag: true,
        dragCursor: "move"
      },
      animationTime: 300,
      zoomFactor: 0.25,
      maxZoom: 3,
      panFactor: 100,
      initialViewBox: null,
      limits: null
    };
    defaultViewBox = {
      x: 0,
      y: 0,
      width: 1000,
      height: 1000
    };

    /**
     * Check the limits of the view box, return a new viewBox that respects the limits while keeping
     * the original view box size if possible. If the view box needs to be reduced, the returned view
     * box will keep the aspect ratio of the original view box.
     *
     * @param {Object} viewBox
     *   The original view box. Takes numbers, in the format `{x, y, width, height}`.
     *
     * @param {Object} limits
     *   Extents which can be shown, in the view box coordinate system. Takes numbers in the format
     *   `{x, y, x2, y2}`.
     *
     * @return {Object} viewBox
     *   A new view box object, squeezed into the limits. Contains numbers, in the format `{x, y,
     *   width, height}`.
     */
    checkLimits = function(viewBox, limits) {
      var limitsHeight, limitsWidth, reductionFactor, vb;
      vb = $.extend({}, viewBox);
      limitsWidth = Math.abs(limits.x2 - limits.x);
      limitsHeight = Math.abs(limits.y2 - limits.y);
      if (vb.width > limitsWidth) {
        if (vb.height > limitsHeight) {
          if (limitsWidth > limitsHeight) {
            reductionFactor = limitsHeight / vb.height;
            vb.height = limitsHeight;
            vb.width = vb.width * reductionFactor;
          } else {
            reductionFactor = limitsWidth / vb.width;
            vb.width = limitsWidth;
            vb.height = vb.height * reductionFactor;
          }
        } else {
          reductionFactor = limitsWidth / vb.width;
          vb.width = limitsWidth;
          vb.height = vb.height * reductionFactor;
        }
      } else if (vb.height > limitsHeight) {
        reductionFactor = limitsHeight / vb.height;
        vb.height = limitsHeight;
        vb.width = vb.width * reductionFactor;
      }
      if (vb.x < limits.x) {
        vb.x = limits.x;
      }
      if (vb.y < limits.y) {
        vb.y = limits.y;
      }
      if (vb.x + vb.width > limits.x2) {
        vb.x = limits.x2 - vb.width;
      }
      if (vb.y + vb.height > limits.y2) {
        vb.y = limits.y2 - vb.height;
      }
      return vb;
    };

    /**
     * Parse the viewbox string as defined in the spec for the svg tag.
     *
     * @param {String} viewBoxString
     *   A valid value of the `viewBox` attribute.
     *
     * @return {Object} viewBox
     *   A view box object. Contains numbers, in the format `{x, y, width, height}`.
     */
    parseViewBoxString = function(string) {
      var vb;
      vb = string.replace("\s+", " ").split(" ");
      return vb = {
        x: parseFloat(vb[0]),
        y: parseFloat(vb[1]),
        width: parseFloat(vb[2]),
        height: parseFloat(vb[3])
      };
    };

    /**
     * Get the mouse or first touch position from the `event`, relative to the SVG viewBox.
     *
     * @param {SVGElement} svgRoot
     *   The `<svg>` DOM object
     *
     * @param {MouseEvent|TouchEvent|jQueryEvent} event
     *   The DOM or jQuery event.
     *
     * @return {Object}
     *   Coordinates of the event. Contains numbers, in the format `{x, y}`.
     */
    getViewBoxCoordinatesFromEvent = function(svgRoot, event) {
      var ctm, foo, pos;
      foo = {
        x: null,
        y: null
      };
      if (event.type === "touchstart" || event.type === "touchmove") {
        if ((event.originalEvent != null) && (event.touches == null)) {
          foo.x = event.originalEvent.touches[0].clientX;
          foo.y = event.originalEvent.touches[0].clientY;
        } else {
          foo.x = event.touches[0].clientX;
          foo.y = event.touches[0].clientY;
        }
      } else {
        if (event.clientX != null) {
          foo.x = event.clientX;
          foo.y = event.clientY;
        } else {
          foo.x = event.originalEvent.clientX;
          foo.y = event.originalEvent.clientY;
        }
      }
      pos = svgRoot.createSVGPoint();
      pos.x = parseInt(foo.x, 10);
      pos.y = parseInt(foo.y, 10);
      ctm = svgRoot.getScreenCTM();
      ctm = ctm.inverse();
      pos = pos.matrixTransform(ctm);
      return pos;
    };
    return $.fn.svgPanZoom = function(options) {
      var ret;
      ret = [];
      this.each(function() {
        var $animationDiv, dragStarted, horizontalSizeIncrement, key, opts, preventClick, value, vb, verticalSizeIncrement, viewBox;
        opts = $.extend(true, {}, defaultOptions, options);
        opts.$svg = $(this);
        if (opts.animationTime == null) {
          opts.animationTime = 0;
        }
        opts.$svg[0].setAttribute("preserveAspectRatio", "xMidYMid meet");
        vb = $.extend({}, this.viewBox.baseVal);
        if (vb.x == null) {
          vb.x = 0;
        }
        if (vb.y == null) {
          vb.y = 0;
        }
        if (vb.width == null) {
          vb.width = 0;
        }
        if (vb.height == null) {
          vb.height = 0;
        }
        if (opts.initialViewBox != null) {
          if (typeof opts.initialViewBox === "string") {
            vb = parseViewBoxString(opts.initialViewBox);
          } else if (typeof opts.initialViewBox === "object") {
            vb = $.extend({}, defaultViewBox, opts.initialViewBox);
          } else {
            throw "initialViewBox is of invalid type";
          }
        } else if (vb.x === 0 && vb.y === 0 && vb.width === 0 && vb.height === 0) {
          vb = defaultViewBox;
        }
        viewBox = vb;
        opts.initialViewBox = $.extend({}, viewBox);
        if (opts.limits == null) {
          horizontalSizeIncrement = viewBox.width * 0.15;
          verticalSizeIncrement = viewBox.height * 0.15;
          opts.limits = {
            x: viewBox.x - horizontalSizeIncrement,
            y: viewBox.y - verticalSizeIncrement,
            x2: viewBox.x + viewBox.width + horizontalSizeIncrement,
            y2: viewBox.y + viewBox.height + verticalSizeIncrement
          };
        }
        opts.reset = function() {
          var inivb;
          inivb = this.initialViewBox;
          this.setViewBox(inivb.x, inivb.y, inivb.width, inivb.height, 0);
        };
        opts.getViewBox = function() {
          return $.extend({}, viewBox);
        };
        $animationDiv = $("<div></div>");
        opts.setViewBox = function(x, y, width, height, animationTime) {
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          if (animationTime > 0) {
            $animationDiv.css({
              left: viewBox.x + "px",
              top: viewBox.y + "px",
              width: viewBox.width + "px",
              height: viewBox.height + "px"
            });
          }
          viewBox = {
            x: x != null ? x : viewBox.x,
            y: y != null ? y : viewBox.y,
            width: width ? width : viewBox.width,
            height: height ? height : viewBox.height
          };
          viewBox = checkLimits(viewBox, this.limits);
          if (animationTime > 0) {
            $animationDiv.stop().animate({
              left: viewBox.x,
              top: viewBox.y,
              width: viewBox.width,
              height: viewBox.height
            }, {
              duration: animationTime,
              easing: "linear",
              step: (function(value, properties) {
                var $div;
                $div = $animationDiv;
                this.$svg[0].setAttribute("viewBox", ($div.css("left").slice(0, -2)) + " " + ($div.css("top").slice(0, -2)) + " " + ($div.css("width").slice(0, -2)) + " " + ($div.css("height").slice(0, -2)));
              }).bind(this)
            });
          } else {
            this.$svg[0].setAttribute("viewBox", viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height);
          }
        };
        opts.panLeft = function(amount, animationTime) {
          if (amount == null) {
            amount = this.panFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.panRight(-amount, animationTime);
        };
        opts.panRight = function(amount, animationTime) {
          if (amount == null) {
            amount = this.panFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.setViewBox(viewBox.x + amount, null, null, null, animationTime);
        };
        opts.panUp = function(amount, animationTime) {
          if (amount == null) {
            amount = this.panFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.panDown(-amount, animationTime);
        };
        opts.panDown = function(amount, animationTime) {
          if (amount == null) {
            amount = this.panFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.setViewBox(null, viewBox.y + amount, null, null, animationTime);
        };
        opts.zoomIn = function(amount, animationTime) {
          if (amount == null) {
            amount = this.zoomFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.zoomOut(-amount, animationTime);
        };
        opts.zoomOut = function(amount, animationTime) {
          var center, newHeight, newWidth;
          if (amount == null) {
            amount = this.zoomFactor;
          }
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          if (amount === 0) {
            return;
          } else if (amount < 0) {
            amount = Math.abs(amount);
            newWidth = viewBox.width / (1 + amount);
            newHeight = viewBox.height / (1 + amount);
          } else {
            newWidth = viewBox.width * (1 + amount);
            newHeight = viewBox.height * (1 + amount);
          }
          center = {
            x: viewBox.x + viewBox.width / 2,
            y: viewBox.y + viewBox.height / 2
          };
          this.setViewBox(center.x - newWidth / 2, center.y - newWidth / 2, newWidth, newHeight, animationTime);
        };
        opts.setCenter = function(x, y, animationTime) {
          if (animationTime == null) {
            animationTime = this.animationTime;
          }
          this.setViewBox(x - viewBox.width / 2, y - viewBox.height / 2, viewBox.width, viewBox.height, animationTime);
        };
        for (key in opts) {
          if (!hasProp.call(opts, key)) continue;
          value = opts[key];
          if (typeof value === "function") {
            opts.key = value.bind(opts);
          }
        }
        opts.$svg.on("mousewheel DOMMouseScroll MozMousePixelScroll", (function(ev) {
          var delta, minHeight, minWidth, newMousePosition, newViewBox, newcenter, oldDistanceFromCenter, oldMousePosition, oldViewBox, oldcenter, reductionFactor;
          delta = parseInt(ev.originalEvent.wheelDelta || -ev.originalEvent.detail);
          if (delta === 0 || opts.events.mouseWheel !== true) {
            return;
          }
          oldViewBox = this.getViewBox();
          ev.preventDefault();
          ev.stopPropagation();
          oldMousePosition = getViewBoxCoordinatesFromEvent(this.$svg[0], ev);
          oldcenter = {
            x: viewBox.x + viewBox.width / 2,
            y: viewBox.y + viewBox.height / 2
          };
          oldDistanceFromCenter = {
            x: oldcenter.x - oldMousePosition.x,
            y: oldcenter.y - oldMousePosition.y
          };
          if (delta > 0) {
            this.zoomIn(void 0, 0);
            minWidth = this.initialViewBox.width / this.maxZoom;
            minHeight = this.initialViewBox.height / this.maxZoom;
            if (viewBox.width < minWidth) {
              reductionFactor = minWidth / viewBox.width;
              viewBox.width = minWidth;
              viewBox.height = viewBox.height * reductionFactor;
            }
            if (viewBox.height < minHeight) {
              reductionFactor = minHeight / viewBox.height;
              viewBox.height = minHeight;
              viewBox.width = viewBox.width * reductionFactor;
            }
          } else {
            this.zoomOut(void 0, 0);
          }
          newMousePosition = getViewBoxCoordinatesFromEvent(this.$svg[0], ev);
          newcenter = {
            x: oldcenter.x + (oldMousePosition.x - newMousePosition.x),
            y: oldcenter.y + (oldMousePosition.y - newMousePosition.y)
          };
          this.setCenter(newcenter.x, newcenter.y, 0);
          newViewBox = this.getViewBox();
          this.setViewBox(oldViewBox.x, oldViewBox.y, oldViewBox.width, oldViewBox.height, 0);
          this.setViewBox(newViewBox.x, newViewBox.y, newViewBox.width, newViewBox.height);
        }).bind(opts));
        opts.$svg.dblclick((function(ev) {
          if (opts.events.doubleClick !== true) {
            return;
          }
          ev.preventDefault();
          ev.stopPropagation();
          return this.zoomIn();
        }).bind(opts));
        opts.$svg[0].addEventListener("click", function(ev) {
          var preventClick;
          if (preventClick) {
            preventClick = false;
            ev.stopPropagation();
            return ev.preventDefault();
          }
        }, true);
        dragStarted = false;
        preventClick = false;
        opts.$svg.on("mousedown touchstart", (function(ev) {
          var $body, domBody, initialViewBox, mouseMoveCallback, mouseUpCallback, oldCursor;
          if (dragStarted) {
            return;
          }
          if (opts.events.drag !== true || (ev.type === "mousedown" && ev.which !== 1)) {
            return;
          }
          dragStarted = true;
          preventClick = false;
          ev.preventDefault();
          ev.stopPropagation();
          initialViewBox = $.extend({}, viewBox);
          $body = $(window.document.body);
          domBody = $body[0];
          oldCursor = $body.css("cursor");
          if (this.events.dragCursor != null) {
            $body.css("cursor", this.events.dragCursor);
          }
          mouseMoveCallback = (function(ev2) {
            var currentMousePosition, initialMousePosition;
            ev2.preventDefault();
            ev2.stopPropagation();
            initialMousePosition = getViewBoxCoordinatesFromEvent(this.$svg[0], ev);
            currentMousePosition = getViewBoxCoordinatesFromEvent(this.$svg[0], ev2);
            if (Math.sqrt(Math.pow(ev.pageX + ev2.pageX, 2) + Math.pow(ev.pageY + ev2.pageY, 2)) > 3) {
              preventClick = true;
            }
            this.setViewBox(initialViewBox.x + initialMousePosition.x - currentMousePosition.x, initialViewBox.y + initialMousePosition.y - currentMousePosition.y, null, null, 0);
          }).bind(opts);
          mouseUpCallback = (function(ev2) {
            if (ev2.type === "mouseout" && ev2.target !== ev2.currentTarget) {
              return;
            }
            ev2.preventDefault();
            ev2.stopPropagation();
            domBody.removeEventListener("mousemove", mouseMoveCallback, true);
            domBody.removeEventListener("touchmove", mouseMoveCallback, true);
            domBody.removeEventListener("mouseup", mouseUpCallback, true);
            domBody.removeEventListener("touchend", mouseUpCallback, true);
            domBody.removeEventListener("touchcancel", mouseUpCallback, true);
            domBody.removeEventListener("mouseout", mouseUpCallback, true);
            if (this.events.dragCursor != null) {
              $body.css("cursor", oldCursor);
            }
            dragStarted = false;
          }).bind(opts);
          domBody.addEventListener("mousemove", mouseMoveCallback, true);
          domBody.addEventListener("touchmove", mouseMoveCallback, true);
          domBody.addEventListener("mouseup", mouseUpCallback, true);
          domBody.addEventListener("touchend", mouseUpCallback, true);
          domBody.addEventListener("touchcancel", mouseUpCallback, true);
          domBody.addEventListener("mouseout", mouseUpCallback, true);
        }).bind(opts));
        opts.setViewBox(vb.x, vb.y, vb.width, vb.height, 0);
        ret.push(opts);
      });
      if (ret.length === 0) {
        return null;
      }
      if (ret.length === 1) {
        return ret[0];
      } else {
        return ret;
      }
    };
  })(jQuery);

}).call(this);

//# sourceMappingURL=jquery.svg.pan.zoom.js.map
