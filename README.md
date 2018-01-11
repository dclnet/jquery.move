# jquery.move
move element by css3 transition or $.animate

jQuery.move is a jQuery plugin for move elements; Using the transition in modern browsers to move elements, and still use jQuery's animation in the browser that doesn't support the CSS3 transition.


### example
```javascript
$("#box").move({
    left: -100,                     // left move 100px
    speed: 800,                     // time micro sec
    fn: function() {                // after callback
        console.log("move end.");
    }
})

$("#box").move({
    top: -100,                     // top move 100px
    speed: 800,
    fn: function() {
        console.log("move end.");
    }
})
```