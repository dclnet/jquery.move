/**
 * jQuery.move is a jQuery plugin for move elements; Using the transition in modern browsers to move elements, and still use jQuery's animation in the browser that doesn't support the CSS3 transition.
 *
 * @name jquery.move
 * @version 1.0.1
 * @requires jQuery v1.3+
 * @author dclnet
 * @homepage https://github.com/dclnet/jquery.move
 *
 * Copyright (c) 2018-, dclnet (dclnet [at] qq [*dot*] com)
 */
;(function($, window) {
    Array.prototype.indexOf || (Array.prototype.indexOf = function(index) {
        var len = this.length;
        for(var i = 0; i < len; i++) {
            if (this[i] === index) return i;
        }
        return -1;
    })
    function speed(speed) {
        var speeds = {
            slow: 1500,
            normal: 1000,
            fast: 500
        };
        if (typeof speed === "number") return speed;
        if (speed in speeds) {
            return speeds[speed];
        }
        return speeds["normal"];
    }
    var registered = [];
    function init($e, regEvent) {
        var sel = $e.attr("id") || $e.attr("class");
        if (!registered[sel]) {
            registered[sel] = {
                fn: null
            }
            if (regEvent && window.addEventListener) {
                var events = [
                    "webkitTransitionEnd",
                    "oTransitionEnd",
                    "otransitionend",
                    "transitionend"
                ];
                var len = events.length;
                for(var i = 0; i < len; i++) {
                    $e[0].addEventListener(events[i], function(){
                        init($e).fn();
                    }, false);
                }
            }
        }
        return registered[sel];
    }
    /*
    * ele: element
    * mode: transition or step
    * direction: left or top
    */
    function currentPos(ele, mode, direction) {
        var pos = 0;
        direction || (direction = "left");
        if (["left", "top"].indexOf(direction) === -1) return 0;
        if (mode === "transition" && ele.style.transform) {
            pos = ele.style.transform.match(/\((-?\d+)px\)/i);
            return (pos && pos.length >= 2) ? parseInt(pos[1]) : 0;
        }
        if (mode === "step") {
            return parseInt(ele.style[direction] === "" ? 0 : ele.style[direction]);
        }
        return 0;
    }

    function transition(option) {
        var ms = speed(option.speed);
        if (option.ele.style.transition === "") {
            if (option.haveTransform) {
                option.ele.style.transition = "transform "+ms+"ms";
            } else {
                option.ele.style.transition = option.dir+" "+ms+"ms";
                if (option.ele.style[option.dir] === "") {
                    option.ele.style[option.dir] = "0px";
                }
            }
            window.setTimeout(function(){
                if (option.haveTransform) {
                    option.ele.style.transform = "translate"+option.transformDir+"(" + (option.translatePos + option.distance) + "px)";
                } else {
                    option.ele.style[option.dir] = (option.stepPos + option.distance) + "px";
                }
            }, 17);
        } else {
            if (option.haveTransform) {
                option.ele.style.transform = "translate"+option.transformDir+"(" + (option.translatePos + option.distance) + "px)";
            } else {
                option.ele.style[dir] = (option.stepPos + option.distance) + "px";
            }
        }    
    }
    function step($e, option) {
        var fn = option.fn || function(){};
        var params = {};
        params[option.dir] = (option.stepPos + option.distance) + "px";
        $e.animate(params, option.speed, "linear", fn);
    }
    
    /**
     * move element
     * option: {
     *   left: 100,         // left or top, move 100px every time
     *   speed: 800,        // speed time(ms)
     *   fn: function(){},  // after animation callback
     *   mode: "auto"       // auto/transition/step, default auto
     * }
     * @param {object} option
     * @returns this
     */
    $.fn.move = function(option) {
        option.mode || (option.mode = "auto");
        option.haveTransform = document.body && "transform" in document.body.style;
        option.haveTransition = document.body && "transition" in document.body.style;
        option.translatePos = 0;
        option.stepPos = 0;
        option.dir = "left" in option ? "left" : "top";
        option.transformDir = option.dir === "left" ? "X" : "Y";
        option.distance = option[option.dir];
        option.ele = this[0];
        option.fn || (option.fn = function(){});

        if (option.mode === "auto") {
            option.translatePos = currentPos(option.ele, "transition", option.dir);
            option.stepPos = currentPos(option.ele, "step", option.dir);
        } else if (option.mode === "transition") {
            option.translatePos = currentPos(option.ele, "transition", option.dir);
        } else if (option.mode === "step") {
            option.stepPos = currentPos(option.ele, "step", option.dir);
        }

        if (["auto", "transition"].indexOf(option.mode) !== -1 && option.haveTransition) {
            var instance = init(this, true);
            instance.fn = option.fn || function(){};
            transition(option);
        } else if (["auto", "step"].indexOf(option.mode) !== -1) {
            step(this, option);
        } else {
            console && console.log && console.log("The browser does not support it.");
        }
        return this;
    }
})(jQuery, window);