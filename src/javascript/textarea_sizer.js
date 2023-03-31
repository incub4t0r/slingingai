// $('#user_request').on('input', function () {
//     // this.style.height = 'auto';
//     this.style.height = (this.scrollHeight)+ 6 + 'px';
// });

// on window load set height of textarea to scrollHeight
// $(window).on('load', 'textarea[data-at-expandable]', function() {
//     this.style.height = (this.scrollHeight+2) + 'px';
// });

$('body').on('keydown input', 'textarea[data-at-expandable]', function() {
    //Auto-expanding textarea
    this.style.removeProperty('height');
    this.style.height = (this.scrollHeight+3) + 'px';
})
.on('mousedown', 'textarea[data-at-expandable]', function() {
    //Do this on focus, to allow textarea to animate to height...
    this.style.removeProperty('height');
    this.style.height = (this.scrollHeight+3) + 'px';
});

// remove height on focusout and set to default height
$('body').on('focusout', 'textarea[data-at-expandable]', function() {
    this.style.removeProperty('height');
    this.style.height = 'auto';
});