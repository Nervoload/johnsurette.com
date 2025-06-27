Let's analysis the updated codebase, and build the files, and identify what needs to change in the project to make the clean, 3D animations that we need. You are a exceptional, Senior Software Engineer, and you are masterful in Webapp Development, particularly in building animated, interactive, web apps.

Maybe it would be better to use a blender animations or imported 3d assets?

What's the best approach for the following description? Can my current libraries and architecture handle this? Analyze my codebase, and determine other methods to make it work:

The animations are not working as intended, and we aren't seeing the animations in the right order or time. 

LOGICAL CONTEXT FOR THE FEATURES:::

It should be that, on loading the page, the deck first shuffles from the back (where two cards at a time peak out from under the top card, exit the deck, and is shuffled.  First the deck is on the front card in the same plane as the viewport (x-y/2d looking), then the deck rotates as it shuffles to the x-y-z plane. The Deck is shuffled in a deck of cards that is rotated to look like a 3D block (which is the deck of cards stacked on eachother) and then cards fly out of the deck to do a spread reveal o fn cards in a regular polygon/circular fashion with the bottom of the card along the edge of a circle/rotating about an axis with a radius from the center and equidistant between every card around the axis.

The back texture of the cards are shown, and then after the shuffle animation occurs (which is automatically progressed, but can be re-wounded by scrolling in reverse), the cards are spread in a circular fashion, where the front of the cards are flipped upon exiting the deck.

 The flip itself is a 3D rotation of the 3D cards (Card3D), and then they are spread (SpreadReveal) (like in the image above). 

Then, the autoscroll/autoprogress of the animation stops (After the spread reveal, where they are like in the image above), and then you can scroll to then have more cards fly from the distance to fill in the bottom of the page like a v-stack, where only the back of the card is showing until the following:

You scroll passed the Card's midpoint (the midpoint of the card passes the midpoint of the viewport or something similar)
OR
You click to flip the card, which shows the ProjectCardInfo.

So, considering that, can you analyse my project files/codebase, and identify where the animations currently exist, and whether or not the features are implemented as I wish to implement. 

Then, add the changes to the files and/or make new files for new animations, assets, features, etc.

Thank you!
