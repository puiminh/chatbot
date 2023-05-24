function message_probability(user_message, recognised_words, single_response=false, required_words=[]) {
    let message_certainty = 0;
    let has_required_words = true;

    // Counts how many words are present in each predefined message
    for (let word of user_message) {
        if (recognised_words.includes(word)) {
            message_certainty += 1;
        }
    }

    // Calculates the percent of recognised words in a user message
    let percentage = parseFloat(message_certainty) / parseFloat(recognised_words.length);

    // Checks that the required words are in the string
    for (let word of required_words) {
        if (!user_message.includes(word)) {
            has_required_words = false;
            break;
        }
    }

    // Must either have the required words, or be a single response
    if (has_required_words || single_response) {
        return parseInt(percentage * 100);
    } else {
        return 0;
    }
}

function check_all_messages(message) {
    let highest_prob_list = {};

    // Simplifies response creation / adds it to the dict
    function response(bot_response, list_of_words, single_response=false, required_words=[]) {
        highest_prob_list[bot_response] = message_probability(message, list_of_words, single_response, required_words);
    }

    // Responses -------------------------------------------------------------------------------------------------------
    response('Hello!', ['hello', 'hi', 'hey', 'sup', 'heyo'], true);
    response('See you!', ['bye', 'goodbye'], true);
    response('I\'m doing fine, and you?', ['how', 'are', 'you', 'doing'], false, ['how']);
    response('You\'re welcome!', ['thank', 'thanks'], true);
    response('Thank you!', ['i', 'love', 'code', 'palace'], false, ['code', 'palace']);


    let best_match = Object.keys(highest_prob_list).reduce(function(a, b){ return highest_prob_list[a] > highest_prob_list[b] ? a : b });

    return highest_prob_list[best_match] < 1 ? long.unknown() : best_match;
}

// Used to get the response
function get_response(user_input) {
    let split_message = user_input.toLowerCase().split(/[\s,;?!.-]+/);
    let response = check_all_messages(split_message);
    return response;
}
