import GameController from './classes/controllers/GameController.js';
import Game from './classes/models/Game.js';
import GameView from './classes/views/GameView.js';




let $game = $('.root');

let game = new Game();
let gameView = new GameView($game, game);

let gameController = new GameController(gameView, game);



$(window).resize(updatePageScale);
updatePageScale();

function updatePageScale() {
    let $container = $('.page-container');
    let scale = $container.parent().outerHeight() / $container.outerHeight();
    $container.css('transform', 'scale(' + scale + ')');
}



window.flyAway = function ($from, $to) {
    let $container = $('<div class="fly-away-container">');
    let imgSrc = $from.attr('src') || $from.css('background-image').slice(4, -1).replace(/['"]/g, "");
    let startPos = $from.offset();
    let endPos = $to.offset();
    let duration = 1000;
    let opacityDuration = duration + 1000;

    $container.css({
        position: 'absolute',
        overflow: 'visible',
        opacity: '1',
        'z-index': '1000',
        'margin-top': '-4px',
        'box-shadow': '0 0 40px rgba(0, 0, 0, 0)',
        left: startPos.left + 'px',
        top: startPos.top + 'px',
        transition: `all ${duration}ms, opacity ${opacityDuration}ms`,
    });

    $container.append($(`<img src="${imgSrc}" />`));

    $(document.body).append($container);

    setTimeout(() => {
        $container.css({
            left: endPos.left + 'px',
            top: endPos.top + 'px',
            opacity: 0,
        });
        setTimeout(() => {
            $container.remove();
        }, 1000);
    }, 50);
}