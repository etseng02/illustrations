// new word generator using Sentencer library
var Sentencer = require('sentencer');

Sentencer.configure({
  // the list of nouns to use.
  nounList: ['cat', 'dog', 'mouse', 'horse', 'racecar', 'ghost', 'cow', 'insect', 'sock', 'snake', 'skateboard', 'apple', 'cheese',
  'beer', 'grandmother', 'bacon', 'starfish', 'cake', 'slime', 'snowflake', 
  'motorcycle', 'tomato', 'jaguar', 'bat', 'swordfish', 'hero', 'ninja', 'spaghetti', 'ramen', 'explorer',
  'swordsman', 'curry', 'chicken nugget', 'french fries', 'gangster', 'basketball', 'boxer', 'bubble tea', 'carrot', 'monkey', 'martial artist', 'dragon', 'rapper', 'boiled egg', 'knight', 'cyborg', 'criminal', 'muffin', 'farmer', 'pig', 'salad', 'billionaire', 'dancer', 'break dancer', 'gummy bear', 'hipster', 'wrestler', 'nerd', 'lion', 'dragonball', 'alien', 'snob', 'pizza', 'panda', 'teddy-bear', 'minion', 'whale', 'octopus', 'warrior', 'king', 'queen', 'prince', 'joker', 'peasant', 'astronaut', 'golem', 'teapot', 'wizard', 'frog', 'chef', 'emoji', 'submarine', 'dinosaur'],
  // the list of adjectives to use.
  adjectiveList: ['slimy', 'furry', 'scaley', 'anxious', 'sorry', 'famous', 'serious', 'unhappy', 'terrible', 'embarrassed',
  'powerful', 'serious', 'pleasant', 'poor', 'boring', 'superstar', 'lucky', 'basic', 'old', 'electronic', 
  'strong', 'angry', 'dangerous', 'hungry', 'sleepy', 'massive', 'bonkers', 'cute', 'useless', 'confused',
  'pale', 'metal', 'super', 'fire-breathing', 'savage', 'blushing', 'apologetic', 'legendary', 'unimpressed', 'evil', 'toxic', 'singing', 'water-bending', 'alpha', 'perfect', 'greedy', 'fabulous', 'flying', 'expressionless', 'hipster', 'wild', 'yapping', 'bearded', 'misunderstood', 'radioactive'],
  actions: {
    my_action: function(){
      return "something";
    }
  }
});


function prompt () {
  var noun = Sentencer.make("{{ noun }}");
  var adjective = Sentencer.make("{{ adjective }}");
  return adjective + " " + noun;
}

module.exports = prompt;