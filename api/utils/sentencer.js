// new word generator using Sentencer library
var Sentencer = require('sentencer');

Sentencer.configure({
  // the list of nouns to use.
  nounList: ['cat', 'dog', 'mouse', 'horse', 'car', 'ghost', 'cow', 'bug', 'sock', 'snake', 'skateboard', 'apple', 'drum', 'cup', 'house', 'cheese',
  'beer', 'ability', 'village', 'tea', 'grandmother', 'historian', 'desk', 'bacon', 'living beverage', 'starfish', 'shoe', 'cake', 'slime', 'snowflake', 
  'motorcycle', 'tomato', 'jaguar'],
  // the list of adjectives to use.
  adjectiveList: ['slimy', 'furry', 'scaley', 'sore', 'anxious', 'sorry', 'famous', 'serious', 'educational', 'unhappy', 'terrible', 'embarrassed',
  'environmental', 'powerful', 'historical', 'serious', 'pleasant', 'poor', 'boring', 'remarkable', 'important', 'lucky', 'basic', 'old', 'electronic', 
  'strong', 'mad', 'dangerous'],
  actions: {
    my_action: function(){
      return "something";
    }
  }
});


function prompt () {
  var noun = Sentencer.make("{{ noun }}");
  var adjective = Sentencer.make("{{ an_adjective }}");
  return adjective + " " + noun;
}

module.exports = prompt;