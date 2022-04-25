var started=false;
export default function initGame(){
  // Constants for drawing the hexagonal grid
  const side = 10,      // Number of tiles along each edge
        tileSize = 33,  // Width of a tile in pixels
        r3_2 = 0.866,   // Trigonometry constant, asin(60deg)
        p = 0.185;      // Proportion of the grid that should be bees

  // Constant strings for classes added to tiles to track game states
  const revealed = 'revealed',
        dotRevealed = `.${revealed}`,
        notRevealed = `:not(.${revealed})`,
        flag = 'flag',
        dotFlag = `.${flag}`,
        notFlag = `:not(.${flag})`,
        bee = 'bee',
        dotBee = `.${bee}`,
        notBee = `:not(.${bee})`,
        missed = 'missed',
        num = 'num',
        dotNum = `.${num}`,
        hover = 'hover',
        cheat = 'cheat',
        victory = 'victory',
        defeat = 'defeat',
        neighbourClasses = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6'];


  // Wrapper div to generate the tiles in
  var $hive = $('#hive');

  // Variable to hold a tile click handler function.
  // The action required depends on if the game is just initialised
  // or mid-game, or for resetting
  var state = init;

  // Array of timeout handles for delayed animations. This is kept global as
  // each change of state will clear timeouts
  var timeouts = [];

  // List of valid hexagon coordinate class labels for row and column indices
  var selectors = [];

  // Time that the current board was started
  var startTime;



  /*** Create the hexagonal grid ***/


  // Draw each row. There will be an odd number of rows based on side
  
    $hive = $('#hive');
  if(!started){
  for (let row = 0; row < 2 * side - 1; row++) {
    // Draw each tile. The row always starts with column 0, which moves leftwards
    // The number of tiles per row increases by on each row, until it goes past the
    // middle row where tiles are instead lost from the left
    for (let col = Math.max(0, row - side + 1); col < side + Math.min(row, side - 1); col++) {
      // Append new tiles to the hive wrapper.
      // Tiles are labelled with classes for their row and column indices
      $hive.append(
        $('<div>')
          .addClass(`hexagon r${row} c${col}`)
          .css({
            // Each row moves down by sqrt(3)/2 of a tile
            top: row * r3_2 * tileSize + 90,
            // Each row starts half tile to left of the previous.
            // Tile 0,0 is actually roughly 1/4 of the way across the whole width
            left: (col - 0.5 * row + 0.5 * r3_2 * (side + 1.5)) * tileSize
          })
          .append($('<div>').addClass(num))
      );
      selectors.push(`.r${row}.c${col}`);
    }
  }
}
 started=true; 


  /*** Assign a click event handler to the newly created tiles ***/


  var $tiles = $hive.children(),
      beeCount = p * $tiles.length | 0,
      scoreLimit = $tiles.length - beeCount;


  // Main click handler. Mousedown allows for other mouse buttons
  $tiles.mousedown(e => {
    //console.log(state.name, e.which, e.currentTarget);

    // Whatever the state, pass the event into it
    state(e);

    // Update scoreboard if the game is still going
    if (state !== reset) {
      updateScoreboard();
    }
  });

  // Cheat mode
  $tiles.mouseup(e => { $hive.removeClass(cheat); });

  // Prevent right-click context menu from appearing
  $tiles.bind('contextmenu', e => false);



  /*** Click handlers for each state ***/


  /**
   * Handler for the first tile to be clicked.
   * This function randomly assigns the locations of bees,
   * then changes the state to play.
   * The first tile clicked will never be a bee.
   * @param {event} e Click event object
   */
  function init(e) {
    let $clickedTile = $(e.currentTarget);

    // Generate random bees
    addBees($clickedTile);

    // Add text for the number of neighbouring bees to non-bbe tiles
    addNeighbouringBeeCounts();

    // Reveal the starting tile
    reveal($clickedTile);

    // Begin the game
    state = play;

    // Note the time that the game started
    startTime =  new Date();
  }

  /**
   * Sets a proportion of the tiles to be bees randomly.
   * Pass in the clicked tile to avoid setting it or its neighbours as bees.
   * @param {jQuery} $clickedTile The clicked tile
   */
  function addBees($clickedTile) {
    // Start by getting a copy of the list of labels
    let available = selectors.slice();

    // Remove the clicked on tile from the list
    let selector = $clickedTile.attr('class')
      .replace(/^.*\b(r\d+)\s(c\d+)\b.*$/, '.$1.$2');

    available.splice(available.indexOf(selector), 1);

    // Also remove the clicked on tile's neighbours from the pool of
    // tiles available to become bees
    forEachNeighbour($clickedTile, ($neighbour, row, col) => {
      available.splice(available.indexOf(`.r${row}.c${col}`), 1);
    });

    // Generate the required number of bees
    for (let i = 0; i < beeCount; i++) {
      // Choose a random tile
      let r = available.length * Math.random() | 0;

      // Remove it from the list of available labels
      let label = available.splice(r, 1)[0];

      // Set the tile to be a bee
      $hive.children(label).addClass(bee);
    }
  }

  /**
   * Sets the text of non-bee tiles to a count of the neighbouring bees
   */
  function addNeighbouringBeeCounts() {
    // For all the non-bee tiles
    $hive.children(notBee).each(function (i) {
      let $this = $(this);

      // Count each tile's neighbouring bees
      let neighbours = 0;
      forEachNeighbour($this, $neighbour => {
        if ($neighbour.hasClass(bee)) {
          neighbours++;
        }
      });

      // Add a class to the tile for its number of neighbours.
      // This is useful for retrieving it later, and for CSS.
      $this.addClass(neighbourClasses[neighbours]);

      // Update the text of the tile to reflect on its neighbour count
      $this.children(dotNum).text(neighbours || '');
    });
  }


  /**
   * Handler for tile clicks, midgame.
   * This will reveal tiles with left-click or place flags with right-click.
   * If a bee tile is clicked, the state move to reset.
   * @param {event} e Click event object
   */
  function play(e) {
    let $clickedTile = $(e.currentTarget);

    switch (e.which) {
      case 1:
        // For left-click, reveal the tile, unless flagged
        if (!$clickedTile.hasClass(flag)) {
          reveal($clickedTile);
        }
        break;

      case 2:
        // For middle-click, allow a glimpse of where the bees
        $hive.addClass(cheat);
        break;

      case 3:
        // For right-click, toggle flag if not already revealed
        if (!$clickedTile.hasClass(revealed)) {
          $clickedTile.toggleClass(flag);
        }
        break;
    }
  }


  /**
   * Handler for tile clicks after a game over has occured.
   * Bee states, flags, and reveals will all be cleared.
   * Then the state will move back to init for a new game.
   * @param {event} e Click event object
   */
  function reset(e) {
    // Clear any still animating timeouts
    timeouts.forEach(t => {
      clearTimeout(t);
    });

    // Clear up the additional classes and text
    $tiles.removeClass([bee, flag, revealed, missed]
                       .concat(neighbourClasses).join(' '));
    $(dotNum).text('');
    $hive.removeClass([victory, defeat].join(' '));

    // Set state to initialise the game once cleared up
    state = init;
  }



  /*** Utility functions for revealing tiles ***/


  /**
   * Reveals a tile. If it's a bee, revealBee will be called.
   * Otherwise, revealHoney will be called.
   * @param {jQuery} $tile jQuery object of the tile to be revealed.
   */
  function reveal($tile) {
    if ($tile.hasClass(bee)) {
      revealBee($tile);
    } else {
      revealHoney($tile);
    }
  }

  /**
   * Handles a game over when a bee is revealed.
   * Reveals the clicked tile as a bee and then the rest of the board as game
   * over. Also sets the state for the next click to reset.
   * @param {jQuery} $tile jQuery object of the tile to be revealed.
   */
  function revealBee($tile) {
    // Game over
    let missClasses = [revealed, missed].join(' ');
    $tile.addClass(missClasses);
    $hive.addClass(defeat);

    // Reveal whole board with a slight random delay to reduce load
    $hive.children(notRevealed).each((i, e) => {
      timeouts.push(setTimeout(() => {
        $(e).addClass(missClasses);
      }, 300 + 1200 * Math.random()));
    });

    // Next click will reset
    state = reset;
  }

  /**
   * Reveals the clicked on tile.
   * If the tile had no neighbouring bees, all of its neighbours will also be
   * revealed, recursively with a small delay to animate a flood fill effect.
   * @param {jQuery} $tile jQuery object of the tile to be revealed.
   */
  function revealHoney($tile) {
    // Exit early if the tile was already revealed
    if ($tile.hasClass('revealed')) {
      return;
    }

    // Reveal this tile with a count of its neighbouring bees
    $tile.addClass(revealed);

    // If the tile has no neighbouring bees, also reveal
    // neighbouring tiles, recursively
    if ($tile.hasClass(neighbourClasses[0])) {
      timeouts.push(setTimeout(() => {
        forEachNeighbour($tile, $neighbour => {
          // Make sure the tile isn't already revealed to reduce recursion.
          // Make sure the tile isn't incorrectly flagged, or it will become
          // impossible to unflag.
          if (!$neighbour.hasClass(revealed) &&
              !$neighbour.hasClass(flag)) {
            revealHoney($neighbour);
          }
        });
        updateScoreboard();
      }, 100));
    }
  }


  /**
   * Callback for forEachNeighbour
   * @callback forEachNeighbourCallback
   * @param {jQuery} neighbour A jQuery object for one of the tile's neighbours
   * @param {number} row       The row index of the neighbour
   * @param {number} col       The column index of the neighbour
   */

  /**
   * Function that allows iteration over neighbouring tiles through a callback.
   * @param {jQuery}                   $tile    A jQuery object of the tile
   *                                            whose neighbours are to be
   *                                            iterated over
   * @param {forEachNeighbourCallback} callback A callback function to be
   *                                            called on each of the tile's
   *                                            neighbours in turn, with args
   *                                            (neighbour, row, col)
   */
  function forEachNeighbour($tile, callback) {
    // There are 6 possible neighbours with the following coordinate offsets
    const neighbourOffsets = [
      [-1, -1],
      [+1, +1],
      [-1,  0],
      [+1,  0],
      [ 0, -1],
      [ 0, +1]
    ];

    // Retrieve row and column classes from tile
    let matches = $tile.attr('class').match(/\br(\d+)\sc(\d+)\b/);

    // Parse the row and column indices
    if (matches && matches.length === 3) {
      let row = parseInt(matches[1], 10),
          col = parseInt(matches[2], 10);

      // Iterate over each offset
      neighbourOffsets.forEach(offset => {
        // Find the neighbour with the given indices
        let r = row + offset[0],
            c = col + offset[1],
            $neighbour = $(`#hive .hexagon.r${r}.c${c}`);

        // If it exists, call the callback function on it
        if ($neighbour && typeof callback === 'function') {
          callback($neighbour, r, c);
        }
      });
    }
  }



  /*** Scoreboard functions ***/


  /**
   * Updates the scoreboard div with the game's current progress.
   * This will be a string in one of the following formats:
   *   Honey Gathered: AAA/BBB | Bees Remaining CC/DD
   *   Completed in AA minute(s) BB second(s)
   *   Completed!
   */
  function updateScoreboard() {
    // Count number of bees remaining and revealed tiles
    let remainingCount = beeCount - $hive.children(dotFlag).length,
        revealedCount = $hive.children(dotRevealed).length,
        score = $('#score');

    // The game is won when all bee tile are flagged and all non-bees are revealed
    // The game must also still be in play (not game over full reveal).
    if (state === play && revealedCount === scoreLimit) {
      // Victory

      // Get time in seconds since start
      let time = (new Date() - startTime) / 1000 | 0;

      // Print the time to complete the game if it was less than an hour
      if (time < 3600) {
        var mins = time / 60 | 0,
            secs = time % 60;

        score.text(
          `Completed in ${mins} minute${mins === 1 ? '' : 's'} ${secs} second${secs === 1 ? '' : 's'}`);
      } else {
        score.text('Completed!');
      }
      $hive.addClass(victory);
      state = reset;
    } else {
      // Display current progress the board
      score.text(
        `Honey Gathered: ${revealedCount}/${scoreLimit} | Bees Remaining: ${remainingCount}/${beeCount}`);
    }
  }

}