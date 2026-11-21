"""AFTER ZERO — Episode 001 — WHAT IF YOU WERE THE LAST HUMAN ON EARTH?

Full shooting script. One beat = one shot.
Each beat: (speaker, text, visual, params)

speaker: N = narrator, NOAH, RADIO (unknown voice through radio), CARTER (Dr. Elena
Carter, recorded video), SIS (Noah's sister through radio), "-" = no speech
(params["dur"] gives the length). The shot lasts as long as its line (+ padding).
visual: name of a set in animation/src/sets/*.tsx; params customise it.
"""

CHAPTERS = [
    "THE FIRST MORNING", "SOMETHING IS WRONG", "THE EMPTY CITY", "THE FIRST NIGHT",
    "THE NEW REALITY", "THE STRANGE SIGNAL", "THE JOURNEY", "THE OBSERVATORY",
    "THE DISCOVERY", "THE FINAL MESSAGE", "THE TWIST", "THE NEXT MORNING",
]

S = []  # list of scenes, each a list of beats


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 01 THE FIRST MORNING
scene(
    ("-", "", "city", {"time": "dawn", "dur": 4.6, "sfx": "city"}),
    ("-", "", "clock", {"dur": 2.6, "sfx": "silence"}),
    ("N", "Imagine waking up tomorrow morning... and discovering that you are the only person left on Earth.", "bedroom", {"noah": "lying", "wake": True}),
    ("N", "No messages. No phone calls. No traffic.", "phone", {"screen": "lock"}),
    ("N", "No voices coming from the apartment next door.", "hallway", {}),
    ("N", "At first, you might think something unusual happened overnight. Maybe it's a holiday. Maybe there's a power outage. Maybe everyone is simply somewhere else.", "bedroom", {"noah": "sitting", "call": True}),
    ("N", "But then... you look outside.", "livingWalk", {}),
    ("N", "And you realize that something is terribly wrong.", "windowBack", {"time": "dawn"}),
    ("N", "Every street is empty.", "street", {"time": "dawn"}),
    ("N", "Every building is silent.", "trafficLight", {}),
    ("N", "And somewhere between yesterday and today... humanity disappeared.", "aerial", {"time": "day", "impact": 0.75}),
    ("N", "This is the story of Noah.", "profile", {"time": "dawn"}),
    ("N", "And this is what could happen... if you were the last human on Earth.", "title", {"tail": 4.5}),
)

# ------------------------------------------------------------- 02 SOMETHING IS WRONG
scene(
    ("N", "Noah was twenty-seven years old. He lived on the ninth floor of an old apartment building, in the middle of a city that never really slept.", "city", {"time": "day", "seed": 2}),
    ("N", "Every morning began the same way. The rumble of buses. Construction drills. A neighbor's radio playing through the wall. Someone, somewhere, always arguing on the street below.", "windowBack", {"time": "day"}),
    ("N", "Silence was something he had only ever heard in the middle of the night. And even then, never completely.", "bedroom", {"noah": "sitting"}),
    ("N", "But this morning... there was nothing.", "profile", {"time": "day"}),
    ("NOAH", "Hello?", "windowBack", {"time": "day", "echo": True}),
    ("N", "His voice bounced between the buildings and came back to him, smaller. Nobody answered.", "aerial", {"time": "day", "seed": 7}),
    ("N", "He checked his phone again. No new messages. The last one was from his sister, sent at eleven forty the night before.", "phone", {"screen": "msg"}),
    ("N", "Call me tomorrow, it said. I have news.", "phone", {"screen": "msg", "zoom": True}),
    ("N", "His sister was three years older than him. She was the one who always called first. On birthdays. After bad days. After every storm, just to check that he was okay.", "profile", {"time": "day", "seed": 4}),
    ("N", "He had meant to call her back last night. He had been too tired. He had told himself there would be time in the morning.", "bedroom", {"noah": "sitting"}),
    ("N", "He called her. The phone rang once... and then the call simply dropped.", "phone", {"screen": "calls"}),
    ("NOAH", "Come on... pick up. Pick up.", "bedroom", {"noah": "sitting", "call": True}),
    ("N", "He opened social media. The last posts were all from the night before. Photos of dinners. Jokes. A video of someone's dog chasing its own tail.", "phone", {"screen": "social"}),
    ("N", "And then, at eight seventeen in the morning... nothing. Not a single new post. Anywhere in the world.", "phone", {"screen": "social", "end": True}),
    ("N", "At first, Noah laughed. A short, nervous laugh. The kind you make when something doesn't make sense yet.", "profile", {"time": "day", "seed": 2}),
    ("N", "Maybe the network was down. Maybe there had been some kind of emergency, and everyone had been evacuated while he slept.", "hallway", {"seed": 2}),
    ("N", "So he got dressed, grabbed his green jacket and his backpack, and walked down nine flights of stairs.", "stairs", {}),
    ("N", "When he pushed open the front door of the building, the street was waiting for him.", "street", {"time": "day", "seed": 3}),
    ("N", "Cars stood in the middle of the road, some with their doors still open. A bicycle lay on its side on the sidewalk. A coffee cup sat on a bench, still half full.", "street", {"time": "day", "seed": 4}),
    ("N", "It looked as if everyone had vanished in the middle of their lives. Mid-step. Mid-sentence.", "noahStreet", {"time": "day"}),
    ("NOAH", "Where is everybody?", "profile", {"time": "day", "outfit": "out"}),
)

# ------------------------------------------------------------- 03 THE EMPTY CITY
scene(
    ("N", "Noah spent the next several hours searching. For someone. For anyone.", "noahStreet", {"time": "day", "seed": 5}),
    ("N", "He walked down the main avenue, where on any other morning thousands of people would have been rushing to work.", "streetWide", {"time": "day"}),
    ("N", "The traffic lights still changed. Green. Yellow. Red. For no one.", "trafficLight", {"cycle": True}),
    ("N", "He went into the supermarket on the corner. The automatic doors slid open to greet him, as if nothing had happened.", "supermarket", {}),
    ("N", "Music was still playing quietly from the ceiling speakers. Fruit sat in neat, colorful piles. A shopping cart stood in the middle of an aisle, half full, waiting for someone to come back for it.", "supermarket", {"cart": True}),
    ("N", "Three blocks away, he visited the hospital. The corridors were bright and clean. Monitors beeped softly beside empty beds.", "hospital", {}),
    ("NOAH", "Is anyone here? Anyone? I need... I just need to talk to someone.", "hospital", {"noah": True}),
    ("N", "He went down into the subway. A train was waiting at the platform with its doors wide open... and every seat empty.", "subway", {}),
    ("N", "He even checked the police station. Phones were ringing on the desks. Computers were still on. A half-eaten sandwich sat beside a keyboard.", "police", {}),
    ("N", "On the way back, he passed a car stopped at a green light. The engine was still running. The radio was still on, playing to an empty seat. Noah reached in and turned it off. He couldn't explain why. It just felt wrong to leave it singing to no one.", "street", {"time": "day", "seed": 6}),
    ("N", "The world hadn't been destroyed. The buildings were still standing. The electricity was still working. The trains were still waiting at their stations.", "aerial", {"time": "day", "seed": 3}),
    ("N", "Everything looked exactly as it should.", "city", {"time": "day", "seed": 4}),
    ("N", "Except for one detail.", "profile", {"time": "day", "outfit": "out", "seed": 3}),
    ("N", "There was nobody in it.", "streetWide", {"time": "day", "seed": 2, "tiny": True}),
    ("N", "As the sun went down, Noah walked home through streets that seemed to grow larger with every step.", "noahStreet", {"time": "dusk"}),
    ("N", "And for the first time in his life, he understood how loud silence can be.", "windowBack", {"time": "dusk"}),
    ("-", "", "city", {"time": "dusk", "dur": 3.5, "seed": 5}),
)

# ------------------------------------------------------------- 04 THE FIRST NIGHT
scene(
    ("N", "That night, Noah barely slept.", "bedroom", {"noah": "sitting", "time": "night"}),
    ("N", "He kept checking his phone. He refreshed the same pages. He called the same numbers. Again. And again.", "phone", {"screen": "calls", "night": True}),
    ("N", "Nothing changed.", "profile", {"time": "night"}),
    ("N", "And then something happened that he didn't expect. He started talking to himself.", "tableSit", {}),
    ("NOAH", "Okay. Okay, Noah. Think. There has to be an explanation. People don't just... disappear.", "tableSit", {"seed": 2}),
    ("N", "Not because he was losing his mind. But because hearing a voice... even his own... made the apartment feel a little less empty.", "tableSit", {"seed": 3}),
    ("N", "He turned on the television.", "tv", {"state": "on"}),
    ("N", "Every single channel showed the same thing. An emergency broadcast. A government announcement, interrupted halfway through a sentence.", "tv", {"state": "broadcast"}),
    ("-", "", "tv", {"state": "static", "dur": 2.5, "sfx": "static"}),
    ("N", "Then static.", "tv", {"state": "static"}),
    ("N", "Noah stared at the screen for a long time.", "profile", {"time": "tv"}),
    ("N", "Outside, one by one, the streetlights flickered and went dark, across entire neighborhoods.", "windowNight", {"phase": "dimming"}),
    ("N", "From far away, his apartment must have looked like a single tiny window of light, in an ocean of darkness.", "windowNight", {"phase": "zoomout"}),
    ("N", "And for the first time, Noah understood that this might not end tomorrow.", "windowNight", {"phase": "hold"}),
)

# ------------------------------------------------------------- 05 THE NEW REALITY
scene(
    ("N", "Three days passed.", "tally", {"n": 3}),
    ("N", "Then five.", "tally", {"n": 5}),
    ("N", "Then seven.", "tally", {"n": 7}),
    ("N", "Noah began recording voice memos on his phone. A kind of diary. Proof, maybe, that he was still here.", "phone", {"screen": "memo"}),
    ("NOAH", "Day seven. Still nobody. I went to the library today. Didn't take anything. I just... sat there for a while. It felt good to be around books. They're the closest thing to voices I've got left.", "tableSit", {"time": "day", "phone": True}),
    ("N", "He understood that he couldn't spend the rest of his life waiting for someone to come back.", "city", {"time": "day", "seed": 6}),
    ("N", "The world had changed. And he had to change with it.", "noahStreet", {"time": "day", "seed": 6}),
    ("N", "He learned which stores still had bottled water. He collected batteries, flashlights, and a small camping stove. He learned to cook on a balcony, nine floors above an empty street.", "supermarket", {"noah": True}),
    ("N", "The city that once felt crowded now felt enormous. A simple walk to the end of the block became an experience of complete isolation.", "streetWide", {"time": "day", "seed": 4, "tiny": True}),
    ("N", "On the fourth day, it rained. He watched the water run across the windshields of a thousand abandoned cars.", "street", {"time": "rain", "seed": 8}),
    ("N", "Without other people, even the most ordinary moments became strange. Eating alone.", "tableSit", {"time": "day", "seed": 4}),
    ("N", "Watching the sunset alone.", "rooftop", {}),
    ("N", "Celebrating... nothing.", "rooftop", {"seed": 2}),
    ("N", "At night, the city was completely dark. And without its lights, something strange happened above it. The stars came back. Thousands of them. Noah had lived his whole life under that sky, and he had never really seen it.", "campfire", {"stars": True, "roof": True}),
    ("NOAH", "Day eight. There are so many stars. I didn't know there were this many. Mom used to say they're just people who left a light on for us. I never understood what she meant... until now.", "rooftop", {"seed": 4, "time": "dusk"}),
    ("N", "There was nobody to tell about a discovery. Nobody to share a joke with. Nobody to ask whether tomorrow would be better.", "profile", {"time": "dusk"}),
    ("NOAH", "Day nine. I caught myself saying good morning to the coffee machine today. So... yeah. That's where we are.", "tableSit", {"time": "day", "phone": True, "seed": 5}),
    ("N", "And perhaps the hardest part wasn't being physically alone. It was having nobody left who remembered the same world he did.", "rooftop", {"seed": 3, "time": "dusk"}),
)

# ------------------------------------------------------------- 06 THE STRANGE SIGNAL
scene(
    ("N", "On the tenth day, Noah went looking for something he should have looked for at the very beginning. A radio.", "noahStreet", {"time": "day", "seed": 7}),
    ("N", "If anyone else had survived, they might be trying to reach others the old way. Without the internet. Without phones.", "electronics", {}),
    ("N", "The electronics store on Fifth Street was dark and dusty. Rows of televisions stared down from the walls like empty eyes.", "electronics", {"seed": 2}),
    ("N", "He found a battery-powered emergency radio, the kind people keep for storms. He turned the dial slowly, through the static.", "radioClose", {"state": "search"}),
    ("-", "", "radioClose", {"state": "search", "dur": 3.0, "sfx": "static"}),
    ("N", "Nothing. Just white noise, frequency after frequency.", "radioClose", {"state": "search"}),
    ("N", "He was about to give up... when a small red light began to blink.", "radioClose", {"state": "led"}),
    ("RADIO", "...is anyone... receiving this transmission...?", "radioClose", {"state": "voice"}),
    ("N", "Noah froze.", "profile", {"time": "store", "outfit": "out"}),
    ("NOAH", "Hello? Hello! Yes! I can hear you! Can you hear me?", "radioClose", {"state": "led"}),
    ("RADIO", "...if anyone is listening... please... respond...", "radioClose", {"state": "voice"}),
    ("N", "For the first time in ten days, Noah heard another human voice. Weak. Distorted. But unmistakably human.", "electronics", {"seed": 3, "noah": True}),
    ("N", "He held the radio with shaking hands and pressed every button he could find. And then the signal disappeared.", "radioClose", {"state": "dead"}),
    ("NOAH", "No, no, no. Come back. Please. Please come back.", "radioClose", {"state": "dead"}),
    ("-", "", "radioClose", {"state": "search", "dur": 2.6, "sfx": "static"}),
    ("RADIO", "If you can hear me... go to the old observatory.", "radioClose", {"state": "voice"}),
    ("-", "", "radioClose", {"state": "voice", "dur": 1.4, "sfx": "static"}),
    ("RADIO", "Look at the sky.", "radioClose", {"state": "voice"}),
    ("N", "And the transmission ended.", "radioClose", {"state": "dead"}),
    ("N", "Noah stood completely still in the dark store. He had spent ten days believing he was the last person on Earth. And now, someone was telling him otherwise.", "profile", {"time": "store", "outfit": "out", "seed": 2}),
)

# ------------------------------------------------------------- 07 THE JOURNEY
scene(
    ("N", "The old observatory sat on top of Mount Hollis, more than sixty miles north of the city. Noah had been there once, on a school trip, when he was eleven years old.", "map", {}),
    ("N", "He didn't know who had sent the message. He didn't know whether it was real... or just a recording, looping for days to no one.", "map", {"route": True}),
    ("N", "But he knew one thing. He couldn't ignore the possibility that someone else had survived.", "profile", {"time": "day", "outfit": "out", "seed": 4}),
    ("N", "He packed what he could carry. Water. Food. A flashlight. The radio. And he left at sunrise.", "journey", {"stage": "cityEdge"}),
    ("N", "As he walked, the city slowly fell away behind him. Towers became shapes. Shapes became shadows on the horizon.", "journey", {"stage": "cityEdge", "seed": 2}),
    ("N", "The highway out of town was full of cars, frozen in a traffic jam that would never move again.", "journey", {"stage": "highway"}),
    ("N", "By the second day, the road had started to disappear beneath grass and wildflowers. Nature wasn't waiting for permission.", "journey", {"stage": "fields"}),
    ("N", "The sounds of the city were replaced by wind, by rain... and by birds. So many birds.", "journey", {"stage": "fields", "seed": 2, "birds": True}),
    ("NOAH", "Day twelve. Walked maybe twenty miles. My feet hate me. But I saw deer on the highway this morning. Five of them. They just stood there and watched me... like I was the strange one.", "campfire", {}),
    ("N", "That night, he slept beside a small fire, under more stars than he had ever seen. Without the glow of the cities, the sky was overwhelming.", "campfire", {"stars": True}),
    ("N", "For the first time, Noah saw the world without the constant noise of humanity.", "journey", {"stage": "forest"}),
    ("N", "And it was both beautiful... and terrifying.", "journey", {"stage": "forest", "seed": 2}),
    ("N", "In the afternoon, a storm rolled in from the west. Noah sheltered under a highway bridge while the rain hammered the road for hours.", "journey", {"stage": "forest", "time": "rain", "seed": 3}),
    ("NOAH", "What if there's nobody there? What if I walk sixty miles... and it's just a machine, playing the same message over and over? Then what?", "campfire", {"seed": 2}),
    ("N", "Nobody answered. But in the morning, the rain had stopped. And Noah kept walking.", "journey", {"stage": "fields", "seed": 3}),
    ("N", "On the third day, the road began to climb. Pine trees. Cold air. Clouds drifting below him, in the valleys.", "journey", {"stage": "mountain"}),
    ("N", "The planet was still alive. Even if its cities were empty.", "journey", {"stage": "mountain", "seed": 2}),
    ("N", "And then, through the fog, he saw it.", "journey", {"stage": "mountain", "fog": True}),
    ("-", "", "obsExt", {"time": "dusk", "dur": 3.5, "reveal": True}),
)

# ------------------------------------------------------------- 08 THE OBSERVATORY
scene(
    ("N", "The observatory was enormous. A white dome against a grey sky, its metal panels streaked with years of rain.", "obsExt", {"time": "dusk"}),
    ("N", "The front gate was open. And inside, behind one of the high windows, a small light was glowing.", "obsExt", {"time": "dusk", "light": True, "noah": True}),
    ("NOAH", "Hello? Is anyone here? I heard your message!", "obsInt", {"noah": True}),
    ("N", "No answer. Just the echo of his own voice, rising into the dome.", "obsInt", {"seed": 2}),
    ("N", "Inside, he found computers, old star charts, and rows of screens. Coffee cups. Notes scribbled in a hurry. A coat, still hanging on the back of a chair.", "obsInt", {"seed": 3, "noah": True}),
    ("N", "Most of the screens were dark. But one monitor was still on. On it, a single word was blinking.", "monitor", {"mode": "play"}),
    ("N", "Recording. Noah pressed play.", "monitor", {"mode": "play", "press": True}),
    ("CARTER", "If you're watching this... then the transmission worked.", "monitor", {"mode": "carter"}),
    ("N", "A woman appeared on the screen. She looked tired. Pale. She was speaking quickly, as if she didn't have much time.", "monitor", {"mode": "carter", "seed": 2}),
    ("CARTER", "My name is Doctor Elena Carter. I'm an astrophysicist here at the Hollis Observatory. I don't know if anyone else is still out there.", "monitor", {"mode": "carter", "close": True}),
    ("N", "She looked directly into the camera. Directly at him.", "monitor", {"mode": "carter", "close": True, "seed": 2}),
    ("CARTER", "We've been monitoring the disappearance for several days now. But there is something you need to understand.", "monitor", {"mode": "carter"}),
    ("N", "Noah leaned closer to the screen.", "profile", {"time": "monitor", "outfit": "out"}),
    ("CARTER", "The disappearance... wasn't random.", "monitor", {"mode": "carter", "close": True, "glitch": True}),
    ("N", "The image froze. Pixels scattered across her face. And the screen went black.", "monitor", {"mode": "glitch"}),
    ("-", "", "black", {"dur": 2.2}),
)

# ------------------------------------------------------------- 09 THE DISCOVERY
scene(
    ("N", "Noah searched the observatory for hours.", "obsInt", {"seed": 4, "noah": True}),
    ("N", "He found dozens of recordings, carefully labeled by date. And photographs of the night sky, pinned to every wall, covered in circles and handwritten notes.", "pinboard", {}),
    ("N", "One of the notes was underlined three times. It said: The pattern is not natural. Someone is counting down.", "pinboard", {"note": True}),
    ("N", "Each recording documented the same strange event. At exactly eight seventeen in the morning, a massive electromagnetic disturbance swept across the entire planet.", "dataScreen", {"kind": "spike"}),
    ("N", "In less than a second, every human signal on Earth disappeared. Phones. Heart monitors. Car radios. Billions of voices. Gone.", "dataScreen", {"kind": "world"}),
    ("N", "But something else caught his attention.", "profile", {"time": "monitor", "outfit": "out", "seed": 2}),
    ("N", "The observatory had been receiving another signal. A faint, repeating pattern, picked up by the radio telescope on the roof.", "dataScreen", {"kind": "wave"}),
    ("N", "And according to the logs... that signal had started eleven days before humanity vanished.", "dataScreen", {"kind": "text", "text": "FIRST DETECTION: T-MINUS 11 DAYS"}),
    ("NOAH", "Eleven days before... They knew. They knew something was coming.", "obsInt", {"noah": True, "seed": 5}),
    ("N", "He found one last recording. It was dated the morning of the disappearance.", "monitor", {"mode": "play", "seed": 2}),
    ("CARTER", "We thought we were searching for another civilization. Somewhere out there... among the stars.", "monitor", {"mode": "carter", "seed": 3}),
    ("N", "She paused for a long time.", "monitor", {"mode": "carter", "close": True, "seed": 3}),
    ("CARTER", "But the signal isn't coming from somewhere far away.", "monitor", {"mode": "carter", "close": True}),
    ("N", "She looked frightened.", "monitor", {"mode": "carter", "close": True, "seed": 4}),
    ("CARTER", "It's coming from Earth.", "monitor", {"mode": "carter", "close": True, "impact": 0.2}),
    ("N", "Noah stepped back from the screen.", "obsInt", {"noah": True, "seed": 6}),
    ("N", "Below her frozen face, a final line of text appeared.", "dataScreen", {"kind": "text", "text": "SIGNAL SOURCE: UNKNOWN"}),
    ("N", "Signal source... unknown.", "dataScreen", {"kind": "text", "text": "SIGNAL SOURCE: UNKNOWN", "seed": 2}),
    ("N", "And for the first time, Noah realized that the disappearance might not be the end of the story. It might be the beginning of something much bigger.", "obsExt", {"time": "night", "light": True}),
)

# ------------------------------------------------------------- 10 THE FINAL MESSAGE
scene(
    ("N", "Night fell over the mountain.", "obsExt", {"time": "night", "light": True, "seed": 2}),
    ("N", "Noah sat among the screens, trying to understand what he had seen. And then, the lights began to flicker.", "obsInt", {"flicker": True, "noah": True}),
    ("N", "The radio in his backpack turned on by itself.", "radioClose", {"state": "led"}),
    ("SIS", "Noah...", "radioClose", {"state": "voice"}),
    ("N", "He froze.", "profile", {"time": "monitor", "outfit": "out", "seed": 5}),
    ("NOAH", "Who said that?", "profile", {"time": "monitor", "outfit": "out", "seed": 6}),
    ("SIS", "Noah... if you can hear this...", "radioClose", {"state": "voice"}),
    ("N", "The voice was familiar. He would have known it anywhere. It was his sister.", "profile", {"time": "monitor", "outfit": "out", "seed": 7}),
    ("N", "The sister who always called first. The call he never returned.", "radioClose", {"state": "led", "seed": 2}),
    ("SIS", "I'm sorry we couldn't reach you.", "radioClose", {"state": "voice"}),
    ("NOAH", "Where are you? Are you okay? Are you... alive?", "radioClose", {"state": "led"}),
    ("-", "", "radioClose", {"state": "led", "dur": 2.6}),
    ("SIS", "Look outside.", "radioClose", {"state": "voice"}),
    ("N", "Noah turned toward the observatory window. The clouds were beginning to separate.", "obsWindow", {}),
    ("SIS", "You were never supposed to be alone.", "skyRing", {"phase": "start"}),
    ("N", "And the transmission cut out.", "skyRing", {"phase": "start", "seed": 2}),
)

# ------------------------------------------------------------- 11 THE TWIST
scene(
    ("N", "Noah walked outside, into the cold.", "obsExt", {"time": "night", "ring": True}),
    ("N", "Above the mountains, a strange pattern of lights was appearing across the sky. Slowly. Silently. One by one, the lights moved into place... until they formed a gigantic circle.", "skyRing", {"phase": "form"}),
    ("N", "He didn't understand what he was seeing. But he couldn't look away.", "skyRing", {"phase": "full", "noah": True}),
    ("N", "Then, behind him, every screen inside the observatory turned on at once.", "screensAll", {"text": ""}),
    ("N", "The same message appeared on all of them.", "screensAll", {"text": "HUMANITY: TEMPORARILY DISCONNECTED"}),
    ("N", "Humanity. Temporarily disconnected.", "dataScreen", {"kind": "text", "text": "HUMANITY: TEMPORARILY DISCONNECTED"}),
    ("N", "Then another line appeared beneath it.", "dataScreen", {"kind": "text", "text": "HUMANITY: TEMPORARILY DISCONNECTED", "text2": "RESTORATION: PENDING"}),
    ("N", "Restoration. Pending.", "dataScreen", {"kind": "text", "text": "HUMANITY: TEMPORARILY DISCONNECTED", "text2": "RESTORATION: PENDING", "seed": 2}),
    ("N", "Noah read the words again and again.", "profile", {"time": "monitor", "outfit": "out", "seed": 8}),
    ("N", "And for the first time since that morning... he smiled.", "profile", {"time": "monitor", "outfit": "out", "smile": True}),
    ("N", "Maybe there was still hope. Maybe humanity wasn't gone forever. Maybe someone, somewhere, knew exactly what had happened... and how to undo it.", "skyRing", {"phase": "full", "seed": 2}),
    ("N", "But before he could understand the message... the entire observatory went dark.", "obsExt", {"time": "night", "ring": True, "blackout": True}),
    ("-", "", "black", {"dur": 2.0}),
    ("RADIO", "Phase two begins tomorrow.", "black", {"led": True, "impact": 0.9}),
    ("-", "", "black", {"dur": 2.8}),
)

# ------------------------------------------------------------- 12 AFTER ZERO (ending)
scene(
    ("-", "", "sunriseEnding", {"dur": 3.5}),
    ("N", "The sun rose over the mountains the next morning... the way it always had.", "sunriseEnding", {"seed": 2}),
    ("N", "Far below, the empty city caught the first light. And in its silent streets, the birds had returned.", "city", {"time": "dawn", "seed": 9}),
    ("N", "Imagine living in a world where every familiar voice has disappeared. Where every street tells the story of a life that suddenly stopped.", "streetWide", {"time": "dawn"}),
    ("N", "Where the only thing you can do... is keep moving forward.", "journey", {"stage": "mountain", "time": "dawn", "seed": 3}),
    ("N", "Noah doesn't know what tomorrow will bring. He doesn't know who sent the signal. And he doesn't know whether the people he lost will ever return.", "sunriseEnding", {"seed": 3}),
    ("N", "But one thing has changed.", "profile", {"time": "dawn", "outfit": "out", "seed": 9}),
    ("N", "He takes out the radio and sets it on a rock beside him, turned all the way up. Just in case someone calls first.", "sunriseEnding", {"seed": 5}),
    ("N", "He is no longer simply waiting for the world to become what it was. He is trying to understand what it has become.", "sunriseEnding", {"seed": 4}),
    ("N", "Because sometimes, the end of everything... is only the beginning of a completely different story.", "aerial", {"time": "dawn"}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "What would you do if you were the last human on Earth? Would you keep searching for someone? Or would you accept that the world had changed forever?", "endCard", {"question": True}),
    ("N", "Let us know in the comments. And remember... this is only the beginning.", "endCard", {"question": True, "tail": 4.0}),
)
