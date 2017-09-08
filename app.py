from flask import Flask, request, redirect
from twilio.twiml import Response


player_two_numbers = ['+14154032748', '+441618505031']
buttons = ['a', 'b', 'x', 'y', 'left', 'right', 'up', 'down', 'start', 'select']
digit_to_button = {
    '1': 'A',
    '2': 'up',
    '3': 'X',
    '4': 'left',
    '5': 'start',
    '6': 'right',
    '7': 'B',
    '8': 'down',
    '9': 'Y',
    '0': 'select'
}

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def brainwaves():
    '''This function is called for using the Muse Headband'''


    with open('p2.txt', 'r') as f:
        file_contents = f.read()

    with open('p2.txt', 'w') as f:
        if file_contents == 'hadouken':
            print('Hadouken')
            f.write('nothing')
        else:
            print('NOTHING')
            f.write('hadouken')
    return 'hadouken'


@app.route("/voice", methods=['GET', 'POST'])
def voice():
    """Respond to incoming requests."""
    resp = Response()
    # resp.say("Dial VG. Press 5 to shoot and 9 to jump. Press two, four, six or eight to move. 3 is start.")

    # Say a command, and listen for the caller to press a key. When they press
    # a key, redirect them to /handle-key.
    resp.gather(numDigits=1, action="/handle-key", method="POST", timeout=1000)
    return str(resp)


@app.route("/handle-key", methods=['GET', 'POST'])
def handle_key():
    """Handle key press from a user."""

    # Get the digit pressed by the user
    digit_pressed = request.values.get('Digits', None)
    button_file = 'p1.txt'

    if request.form['Called'] in player_two_buttons:
        button_file = 'p2.txt'

    with open(button_file, 'w') as f:
        f.write(digit_to_button[digit_pressed])

    return redirect("/voice")


@app.route('/sms', methods=['POST'])
def sms_reply():
    # Retrieve the body of the text message.
    message_body = request.form['Body'].lower()

    # Create a TwiML response object to respond to the text message.
    resp = Response()
    message_response = 'Thanks for playing :) Hit up @Sagnewshreds on Twitter for questions.'.format(buttons)
    error_message = 'Please enter a valid Gameboy button: {}'.format(buttons)

    # Create a list of all words in the message body.
    message_list = message_body.split(' ')

    # See if the message was a valid button.
    if message_body in buttons:

        # Make sure the button is uppercase for the emulator's API.
        if message_body in ['a', 'b', 'x', 'y']:
            message_body = message_body.upper()

        # Initialize the file we are going to write to.
        button_file = 'p1.txt'

        # Determine which player is pressing this button.
        if request.form['From'] in player_two_numbers:
            button_file = 'p2.txt'

        with open(button_file, 'w') as f:
            f.write(message_body)
    else:
        message_response = error_message

    resp.message(message_response)
    return str(resp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
