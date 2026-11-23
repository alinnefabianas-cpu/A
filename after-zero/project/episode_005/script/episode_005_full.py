"""AFTER ZERO — Episode 005 — THE LAST HUMAN ON EARTH: PHASE TWO

Sequel to episode 001. Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · MIA (Noah's sister, in person) · CARTER (Dr. Elena Carter) · RADIO (the system's voice)
"""

TITLE = "THE LAST HUMAN ON EARTH: PHASE TWO"
QUESTION = "If the world came back tomorrow,<br />would <i>you</i> tell anyone?"

CHAPTERS = [
    "PREVIOUSLY", "PHASE TWO", "THE LAST FILE", "THE WARNING", "THE STORM", "THE SHIELD",
    "THE RETURN", "ONE SECOND", "MIA", "DR. CARTER", "THE OBSERVER", "AFTER ZERO",
]
MOOD_MAP = [3, 7, 8, 5, 5, 10, 11, 2, 9, 8, 7, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 PREVIOUSLY (recap + hook)
scene(
    ("-", "", "clock", {"dur": 2.6}),
    ("N", "Three weeks ago, at exactly eight seventeen in the morning, every human being on Earth disappeared.", "streetWide", {"time": "dawn", "tiny": True}),
    ("N", "Every human being... except one.", "profile", {"time": "dawn", "outfit": "out"}),
    ("N", "Noah spent ten days alone in an empty city. Then a radio led him to an old observatory in the mountains, and to the recordings of a scientist named Elena Carter.", "obsExt", {"time": "dusk", "light": True}),
    ("CARTER", "The disappearance... wasn't random.", "monitor", {"mode": "carter", "close": True}),
    ("N", "He learned that a mysterious signal had been coming from Earth itself. He heard his missing sister's voice. And he watched a ring of light form in the sky above the mountains.", "skyRing", {"phase": "full", "noah": True}),
    ("N", "Then every screen in the observatory displayed the same message.", "dataScreen", {"kind": "text", "text": "HUMANITY: TEMPORARILY DISCONNECTED", "text2": "RESTORATION: PENDING", "seed": 2}),
    ("RADIO", "Phase two begins tomorrow.", "black", {"led": True}),
    ("N", "This is what happened... the next day.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 PHASE TWO
scene(
    ("N", "Noah woke on the floor of the observatory, curled up beside a dead radio, with the first light of morning coming through the high windows.", "obsInt", {"noah": True, "seed": 7}),
    ("N", "For a moment, he didn't remember where he was. Then he remembered everything at once.", "profile", {"time": "monitor", "outfit": "out", "seed": 11}),
    ("N", "The power had come back during the night. One by one, every screen in the room flickered to life. And on every one of them, a single line of text.", "screensAll", {"text": "", "seed": 2}),
    ("N", "Phase two. Then a number. Counting down.", "countdown", {"from": "23:59:41"}),
    ("NOAH", "Twenty-four hours. Something is happening in twenty-four hours. But what?", "profile", {"time": "monitor", "outfit": "out", "seed": 12}),
    ("N", "A darker thought crept in. What if phase two was not a return... but an ending? What if whatever had taken eight billion people was coming back, this time for the last one?", "profile", {"time": "monitor", "outfit": "out", "seed": 22}),
    ("N", "He went outside. The ring of lights was gone. The sky above the mountains was clear, blue, and ordinary. As if nothing had happened at all.", "obsExt", {"time": "day"}),
    ("N", "But something was different. The birds were silent. Not one was singing. And the wind carried a strange metallic smell, like the air before a thunderstorm.", "iceVista", {"time": "twilight", "seed": 6}),
    ("N", "Noah went back inside. If the answer existed anywhere, it was in Dr. Carter's files.", "obsInt", {"noah": True, "seed": 8}),
    ("N", "On her desk, beside a cold cup of coffee, he found a page of handwritten notes. Equations. Dates. And one sentence, written in the margin and circled twice. It's not taking them. It's hiding them.", "pinboard", {"note": True, "seed": 2, "lines": ["It's not taking them.", "It's hiding them."]}),
)

# ------------------------------------------------------------- 02 THE LAST FILE
scene(
    ("N", "He had watched every recording on the main computer. But there was one folder he hadn't been able to open. It was locked. And it had a strange name.", "dataScreen", {"kind": "text", "text": "FOLDER: FOR THE ONE WHO STAYS"}),
    ("N", "The password hint was a single question. What did the signal say first?", "dataScreen", {"kind": "text", "text": "HINT: WHAT DID THE SIGNAL SAY FIRST?", "seed": 2}),
    ("N", "Noah thought about it for a long time. Then he remembered the radio in the electronics store. The very first words he had heard, after ten days of silence.", "radioClose", {"state": "voice", "seed": 3}),
    ("N", "He tried everything. Restoration. Disconnected. Phase two. Look at the sky. Every attempt ended with the same red message. Access denied.", "dataScreen", {"kind": "text", "text": "ACCESS DENIED", "seed": 5}),
    ("RADIO", "...is anyone receiving this transmission...?", "radioClose", {"state": "voice", "seed": 4}),
    ("N", "He typed them in, one letter at a time. Is anyone receiving.", "keyboard", {"text": "IS ANYONE RECEIVING"}),
    ("N", "The folder opened.", "dataScreen", {"kind": "text", "text": "ACCESS GRANTED", "seed": 3}),
    ("N", "Inside was a single video file. Recorded at eight sixteen in the morning. One minute before the disappearance.", "monitor", {"mode": "play", "seed": 3}),
    ("CARTER", "If you're watching this, then you're the one who stayed. I'm sorry. I'm so sorry. I didn't choose you. But I think I understand why it happened. And you deserve to know.", "monitor", {"mode": "carter", "seed": 5}),
    ("N", "Dr. Carter looked exhausted. Behind her, a window showed the same mountains Noah could see outside. The same sky. Three weeks earlier.", "monitor", {"mode": "carter", "close": True, "seed": 5}),
    ("CARTER", "I have a son. He's nine. He's at school right now, in the city. I keep telling myself that wherever they're going, he'll be safe. I have to believe that. Otherwise I couldn't do this.", "monitor", {"mode": "carter", "seed": 9}),
)

# ------------------------------------------------------------- 03 THE WARNING
scene(
    ("CARTER", "The signal we found isn't a message from aliens. It isn't a weapon. It's an alarm. A very, very old alarm.", "monitor", {"mode": "carter", "seed": 6}),
    ("N", "Dr. Carter's team had traced the signal to the planet's core. Somewhere deep beneath the crust, something had been listening to the Sun for longer than humans had existed. And eleven days before the disappearance, it had started to count.", "earthCore", {}),
    ("CARTER", "We checked the solar observatories. All of them. There is a flare coming. Bigger than anything in recorded history. Big enough to strip the atmosphere off the day side of the planet for a few hours. Nothing exposed on the surface would survive.", "monitor", {"mode": "carter", "close": True, "seed": 6}),
    ("N", "Noah stopped the video. He played that part again. And then a third time.", "profile", {"time": "monitor", "outfit": "out", "seed": 13}),
    ("N", "He went to the main telescope, fitted the solar filter Dr. Carter had left beside it, and pointed it at the Sun. On its surface was a dark scar, a sunspot so enormous that the whole Earth could have fallen into it a dozen times.", "solarStorm", {"phase": "start", "seed": 3}),
    ("CARTER", "I think whatever is down there was built to protect life on this planet. All of it. And at eight seventeen, it's going to move us. Somewhere safe. Out of phase. Out of time. Temporarily disconnected.", "monitor", {"mode": "carter", "seed": 7}),
    ("N", "Humanity hadn't been taken. Humanity had been evacuated. Hidden, the way you might lift a child out of the path of a car.", "earthOrbit", {"ring": False}),
    ("CARTER", "If my calculations are right, when it's over, it will put everyone back. Exactly where they were. Exactly when they were. For us, it will feel like nothing happened at all.", "monitor", {"mode": "carter", "seed": 8}),
    ("CARTER", "But I don't understand one thing. In every simulation, it leaves one person behind. Just one. As if someone has to stay... and watch.", "monitor", {"mode": "carter", "close": True, "seed": 7}),
    ("N", "The video ended.", "monitor", {"mode": "glitch", "seed": 2}),
    ("N", "Noah looked at the countdown on the screen beside him. Phase two wasn't the end of the evacuation. Phase two was the storm.", "countdown", {"from": "21:12:08", "seed": 2}),
)

# ------------------------------------------------------------- 04 THE STORM
scene(
    ("N", "Dr. Carter had left instructions at the end of the file. The observatory had a basement, built in the nineteen sixties to protect the telescopes' instruments. Thick concrete. Deep underground.", "blastDoor", {"seed": 3}),
    ("N", "Noah filled it with everything he could carry. Water. Blankets. Food. The radio. And then he waited.", "corridor", {"light": "on", "seed": 9, "noah": True}),
    ("NOAH", "If anyone ever hears this. It's the last day before... whatever this is. I'm not scared. That's a lie. I'm terrified. But I'm still here. I'm still here.", "profile", {"time": "bunker", "outfit": "out", "seed": 2}),
    ("N", "That evening, he watched what might be the last sunset of the old world, sitting on the steps of the observatory. The sky turned gold, then red, then purple. The first stars came out over the valley, one by one.", "sunriseEnding", {"seed": 6}),
    ("N", "Then he wrote a letter to his sister, on the back of one of Dr. Carter's star charts. He wrote about the empty city, the radio, the mountains. He wrote that he was sorry he hadn't called back. He folded it into his jacket pocket, over his heart.", "desk", {"book": "noah", "noah": True, "seed": 6}),
    ("N", "At two minutes past eight the next morning, he climbed the stairs one last time to look outside.", "obsExt", {"time": "day", "seed": 3}),
    ("N", "The sky was changing color. The blue drained away to white, then to a deep, shimmering violet. The sun was too bright to look at, even through closed eyes.", "solarStorm", {"phase": "start"}),
    ("N", "And then, across the entire sky, the aurora appeared. Not at night. In the middle of the day. Curtains of red and green and violet light, from one horizon to the other, rippling like an ocean upside down.", "solarStorm", {"phase": "aurora"}),
    ("N", "Every electrical line in the valley began to hum. Sparks jumped from the metal railings. His hair stood on end.", "solarStorm", {"phase": "sparks"}),
    ("N", "Noah ran down the stairs, slammed the basement door behind him, and spun the wheel until it locked.", "blastDoor", {"seed": 4, "noah": True, "turning": True}),
    ("-", "", "black", {"dur": 2.4}),
)

# ------------------------------------------------------------- 05 THE SHIELD
scene(
    ("N", "What happened on the surface over the next four hours, Noah would only ever see from the observatory's automatic cameras.", "earthOrbit", {"ring": True, "flare": True}),
    ("N", "A wave of solar fire, larger than the Earth itself, erupted from the Sun and crossed a hundred and fifty million kilometers of space in less than a day.", "earthOrbit", {"ring": True, "flare": True, "seed": 2}),
    ("N", "And as it reached the planet, the ring appeared again. Not one ring this time. Thousands of them. Glowing lines of light, wrapping the entire Earth like the threads of a cocoon.", "earthOrbit", {"ring": True, "cocoon": True}),
    ("N", "The storm hit the shield... and bent around it, the way a river bends around a stone.", "earthOrbit", {"ring": True, "cocoon": True, "flare": True, "seed": 3}),
    ("N", "In the basement, the lights flickered. The floor trembled. A deep, low hum came through the concrete, so powerful that Noah felt it in his teeth.", "corridor", {"light": "dark", "flashOn": True, "rumble": True, "seed": 10}),
    ("N", "He sat with his back against the wall and talked to his sister. Out loud. About everything. About their parents' rooftop, and the stars, and the phone call he never returned.", "profile", {"time": "dark", "outfit": "out", "seed": 3}),
    ("N", "He wondered where they all were, right at that moment. Eight billion people, hidden somewhere outside of time. Were they dreaming? Did they feel anything at all? Or were they simply paused, like a song between two notes?", "earthOrbit", {"ring": True, "cocoon": True, "seed": 5}),
    ("N", "And then, after four hours... the hum stopped.", "corridor", {"light": "dark", "flashOn": True, "seed": 11}),
    ("-", "", "black", {"dur": 3.0}),
    ("N", "When Noah opened the door and climbed into the daylight, the sky was blue again. Birds were singing. The forest on the mountainside was green, and whole, and untouched.", "obsExt", {"time": "day", "seed": 4, "noah": True}),
    ("N", "On every screen inside, the countdown had been replaced by a new message.", "dataScreen", {"kind": "text", "text": "THREAT: PASSED", "text2": "RESTORATION: TOMORROW 08:17"}),
)

# ------------------------------------------------------------- 06 THE RETURN
scene(
    ("N", "Noah drove back to the city through the night, in a car he had found by the side of the road. He wanted to be home. Whatever happened next, he wanted to see it there.", "noahStreet", {"time": "dusk", "seed": 8}),
    ("N", "He drove slowly through the empty streets one last time. Past the supermarket with the music still playing. Past the hospital. Past the electronics store where the radio had first spoken. He realized, with surprise, that a small part of him would miss this. The silence. The stars. The feeling of having the whole world to himself.", "city", {"time": "night", "seed": 21}),
    ("N", "At eight o'clock the next morning, he stood in the middle of the main avenue, where he had stood alone so many times before.", "streetWide", {"time": "dawn", "seed": 3}),
    ("N", "Eight fifteen. Eight sixteen.", "clock", {"dur": 0}),
    ("N", "His hands were shaking. What if it didn't work? What if Dr. Carter had been wrong? What if, at eight seventeen, nothing happened at all, and he stayed alone in this silence forever?", "profile", {"time": "dawn", "outfit": "out", "seed": 23}),
    ("N", "At eight seventeen, the air in front of him shimmered, like heat above a road in summer.", "crowd", {"phase": "shimmer"}),
    ("N", "And then, all at once, they were there.", "crowd", {"phase": "appear"}),
    ("-", "", "crowd", {"phase": "full", "dur": 3.0}),
    ("N", "Thousands of people. Mid-step. Mid-sentence. A man finishing a yawn. A woman laughing into her phone. A child reaching for a pigeon that, three weeks earlier, had been sitting on that exact spot.", "crowd", {"phase": "full", "seed": 2}),
    ("N", "Cars that had stood still for twenty-one days lurched forward. Horns sounded. A bus pulled away from its stop. The city roared back to life in a single breath.", "city", {"time": "day", "seed": 18, "traffic": True}),
    ("N", "Noah stood in the middle of the crowd, and he couldn't stop crying. People walked around him. A few stared. A woman asked if he was okay.", "crowd", {"phase": "full", "seed": 3, "noah": True}),
    ("NOAH", "You're back. You're all back. You're back.", "profile", {"time": "day", "outfit": "out", "seed": 14, "smile": True}),
)

# ------------------------------------------------------------- 07 ONE SECOND
scene(
    ("N", "But nobody else understood what had happened. Because for them... nothing had.", "crowd", {"phase": "full", "seed": 4}),
    ("N", "For eight billion people, the disappearance had lasted less than a second. A strange shiver in the air. A flicker of the lights. A moment of dizziness, gone before they could even name it.", "tv", {"state": "news", "text": "WORLDWIDE 1-SECOND BLACKOUT AT 8:17"}),
    ("N", "Their phones, connected to the network again, insisted that three weeks had passed. Scientists on television argued about clock errors and satellite glitches. Nobody could explain it.", "phone", {"screen": "dateJump"}),
    ("N", "And the plants were taller. And the food in their refrigerators had spoiled. And the streets were covered in leaves that hadn't been there the day before.", "street", {"time": "day", "seed": 9}),
    ("N", "In Noah's apartment, everything was exactly as he had left it. Except for one thing. The small plant on his windowsill, the one he had watered every single day for three weeks, had grown a new flower.", "bedroom", {"noah": "sitting", "seed": 5}),
    ("N", "Noah tried to tell people the truth. A neighbor. A police officer. A reporter. They listened politely, and then they looked at him the way you look at someone who hasn't slept in a very long time.", "profile", {"time": "day", "outfit": "out", "seed": 15}),
    ("N", "His boss called that afternoon, furious, asking why he hadn't shown up for work in three weeks. Noah laughed so hard that his boss hung up on him.", "phone", {"screen": "calls", "seed": 2}),
    ("NOAH", "I was alone. For three weeks. The whole planet. I walked to the mountains. I saw the storm. I'm not crazy.", "profile", {"time": "day", "outfit": "out", "seed": 16}),
    ("N", "And maybe the hardest part of being the last human on Earth... was being the only one who remembered it.", "windowBack", {"time": "dusk"}),
)

# ------------------------------------------------------------- 08 MIA
scene(
    ("N", "There was only one person Noah truly needed to see.", "noahStreet", {"time": "day", "seed": 9}),
    ("N", "His sister, Mia, lived across the river, in a small apartment with a red door. He ran the whole way. Fourteen blocks. He didn't stop once.", "door", {}),
    ("N", "She opened the door in her pajamas, with a cup of coffee in her hand, and a confused smile on her face.", "sister", {"mode": "door"}),
    ("MIA", "Noah? What are you doing here? It's eight in the morning. You look terrible. Are you okay?", "sister", {"mode": "door", "seed": 2}),
    ("N", "He didn't answer. He just hugged her. For so long that her coffee went cold.", "hug", {}),
    ("N", "Then he took a folded piece of paper out of his jacket pocket, the back of a star chart, covered in his handwriting, and gave it to her without a word.", "desk", {"book": "noah", "seed": 7}),
    ("N", "Mia read it twice. When she looked up, her eyes were wet. She didn't understand most of it. But she understood enough.", "sister", {"mode": "kitchen", "seed": 7}),
    ("N", "Later, sitting at her kitchen table, she finally gave him her news. The reason for the message. Call me tomorrow. I have news.", "sister", {"mode": "kitchen"}),
    ("MIA", "I'm going to have a baby. You're going to be an uncle. I wanted to tell you first. Before anyone.", "sister", {"mode": "kitchen", "smile": True, "seed": 2}),
    ("N", "Noah laughed and cried at the same time. Again.", "profile", {"time": "day", "outfit": "out", "seed": 17, "smile": True}),
    ("N", "Then Mia went quiet, and looked at him strangely.", "sister", {"mode": "kitchen", "seed": 3}),
    ("MIA", "This is going to sound crazy. Last night I had the longest dream. I was calling you. Over and over. On a radio, I think. And you couldn't hear me. I kept telling you... look outside.", "sister", {"mode": "kitchen", "seed": 4}),
    ("N", "Noah said nothing. He just held his sister's hand, and didn't let go.", "sister", {"mode": "kitchen", "seed": 5, "smile": True}),
)

# ------------------------------------------------------------- 09 DR. CARTER
scene(
    ("N", "A week later, Noah drove back to the mountains.", "journey", {"stage": "mountain", "seed": 4}),
    ("N", "The observatory was full of people again. Scientists, technicians, students. Nobody knew why the main computer's clock was three weeks ahead, or why the basement was full of blankets and canned food.", "obsExt", {"time": "day", "seed": 5}),
    ("N", "And there, in the control room, was a tired-looking woman with grey eyes and her hair pulled back. Exactly as he remembered her from the screen.", "carterRoom", {}),
    ("CARTER", "Can I help you? This area is restricted.", "carterRoom", {"seed": 2}),
    ("NOAH", "Dr. Carter. My name is Noah. You don't know me. But you left me a message.", "profile", {"time": "monitor", "outfit": "out", "seed": 14}),
    ("N", "She didn't believe him. Of course she didn't. Not until he asked her to open a folder called For the one who stays.", "dataScreen", {"kind": "text", "text": "FOLDER: FOR THE ONE WHO STAYS", "seed": 2}),
    ("N", "She watched her own face on the screen, saying words she didn't remember saying. When the video ended, she sat in silence for a long time.", "carterRoom", {"watching": True}),
    ("CARTER", "I don't remember recording this. But that's my voice. Those are my words. And that is exactly what I would have said.", "carterRoom", {"seed": 3}),
    ("NOAH", "Should we tell people? Everyone?", "profile", {"time": "monitor", "outfit": "out", "seed": 15}),
    ("CARTER", "Tell them what? That something under our feet has been protecting us for millions of years, and nobody noticed? They'll laugh. Or they'll panic. Or they'll try to dig it up. No. First, we understand it. Then we decide.", "carterRoom", {"seed": 4}),
    ("N", "Together, they pulled the data from every solar observatory on the planet. It was all there. A flare that should have been catastrophic. And at the exact same moment, a shield of energy around the Earth that no instrument could explain.", "earthOrbit", {"ring": True, "cocoon": True, "seed": 4}),
)

# ------------------------------------------------------------- 10 THE OBSERVER
scene(
    ("N", "There was still one question left. The one Dr. Carter had asked in her video. Why leave one person behind?", "profile", {"time": "monitor", "outfit": "out", "seed": 18}),
    ("N", "That night, alone in the control room, Noah turned on the old radio one last time, and turned the dial to the frequency where it had all begun.", "radioClose", {"state": "search", "seed": 5}),
    ("-", "", "radioClose", {"state": "search", "dur": 3.0, "seed": 6}),
    ("N", "For a long time, there was only static. And then a voice. Not his sister's. Not Dr. Carter's. A voice that seemed to be made of all the voices he had ever heard.", "radioClose", {"state": "voice", "seed": 7}),
    ("RADIO", "Observer. Thank you.", "radioClose", {"state": "voice", "seed": 8}),
    ("NOAH", "Why me? Why did you leave me behind?", "profile", {"time": "monitor", "outfit": "out", "seed": 19}),
    ("RADIO", "Someone must remain. Someone must see that the world continues. Someone must decide that it is worth returning to.", "radioClose", {"state": "voice", "seed": 9}),
    ("NOAH", "Will it happen again?", "profile", {"time": "monitor", "outfit": "out", "seed": 24}),
    ("RADIO", "Only if it must. We have been here for a very long time. We will be here for a very long time after.", "radioClose", {"state": "voice", "seed": 10}),
    ("N", "Noah thought about the empty city. The silent streets. The stars over the mountains. The fox and the deer on the highway. The world, alive and beautiful, even without anyone to see it.", "aerial", {"time": "dawn", "seed": 5}),
    ("NOAH", "It is. It's worth it. Every part of it.", "profile", {"time": "monitor", "outfit": "out", "seed": 20, "smile": True}),
    ("N", "The radio fell silent. On the screen beside it, a final message appeared... and then faded away.", "dataScreen", {"kind": "text", "text": "OBSERVER STATUS: COMPLETE", "seed": 4}),
)

# ------------------------------------------------------------- 11 AFTER ZERO
scene(
    ("N", "Noah never told the story publicly. Only Mia, Dr. Carter, and a handful of scientists know what really happened during those three weeks.", "city", {"time": "dusk", "seed": 19}),
    ("N", "Five months later, Mia had a baby girl. She asked Noah to choose her middle name.", "sister", {"mode": "kitchen", "smile": True, "seed": 6}),
    ("N", "Every year, on the anniversary of the disappearance, Noah drives up to the observatory. He and Dr. Carter sit on the steps with two cups of coffee and watch the sky. They don't talk much. They don't need to.", "obsExt", {"time": "dusk", "seed": 6, "light": True}),
    ("N", "He chose Aurora.", "solarStorm", {"phase": "aurora", "seed": 2, "calm": True}),
    ("N", "On clear nights, when she was old enough, he would take her up to the roof and show her the stars. The same ones Mia had shown him when they were kids. And he would tell her that the sky is always there. Even when you can't see it.", "campfire", {"stars": True, "roof": True, "seed": 3}),
    ("N", "Sometimes, early in the morning, Noah walks through the city before it wakes up. The streets are almost empty. Almost.", "streetWide", {"time": "dawn", "seed": 5, "tiny": True}),
    ("N", "And he listens to the sounds that most people never notice. Footsteps. Voices. A bus in the distance. A neighbor's radio through a wall. The noise of eight billion people, living their lives.", "city", {"time": "dawn", "seed": 20, "traffic": True}),
    ("N", "It's the most beautiful sound he has ever heard.", "profile", {"time": "dawn", "outfit": "out", "seed": 21, "smile": True}),
    ("N", "Because he knows what the world sounds like... without it.", "aerial", {"time": "dawn", "seed": 6}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were the only person who remembered something like this... would you tell anyone? Or would you keep it to yourself? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
