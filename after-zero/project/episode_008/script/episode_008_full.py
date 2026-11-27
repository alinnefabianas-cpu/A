"""AFTER ZERO — Episode 008 — WHAT IF YOU WERE STRANDED IN SPACE?

Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · VERA (station commander) · SOFIA (girl in Chile) · CONTROL (mission control)
"""

TITLE = "WHAT IF YOU WERE STRANDED IN SPACE?"
QUESTION = "Would <i>you</i> take<br />the spacewalk?"

CHAPTERS = [
    "STRANDED", "THE INVITATION", "LAUNCH", "MERIDIAN", "THE DEBRIS", "NO SIGNAL",
    "THE AIR", "THE SPACEWALK", "THE OLD RADIO", "THE GIRL IN THE DESERT", "THE LAST NIGHT", "THE RETURN",
]
MOOD_MAP = [3, 6, 10, 2, 5, 8, 7, 9, 5, 11, 8, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 STRANDED (cold open)
scene(
    ("-", "", "earth", {"view": "limb", "dur": 4.0, "station": True}),
    ("N", "Four hundred kilometers above your head, a small metal room is falling around the Earth at twenty-eight thousand kilometers per hour.", "meridian", {"phase": "orbit"}),
    ("N", "Inside it, the lights are dim. The air tastes like metal. And every breath you take leaves a little less oxygen for the next one.", "module", {"mode": "dim", "noah": True}),
    ("N", "The radio is dead. The ship that was supposed to bring you home is broken. And below you, eight billion people are going about their day, with no idea that you are up here.", "earth", {"view": "night", "seed": 2}),
    ("N", "This is the story of Noah. And of the eleven days he spent stranded in space.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE INVITATION
scene(
    ("N", "After the Sahara, Noah swore he would stay home for a while. No more deserts. No more oceans. No more adventures.", "city", {"time": "dusk", "seed": 41}),
    ("N", "That lasted exactly four months.", "profile", {"time": "dusk", "outfit": "out", "seed": 41, "smile": True}),
    ("N", "The email came from a private space company. They were sending a short mission to their new orbital station, Meridian. And for the first time, they wanted to send an artist. Someone to photograph the Earth, and tell ordinary people what it really feels like up there.", "phone", {"screen": "email", "from": "Meridian Orbital · Crew Office", "text": "We want you on board. Launch in six months."}),
    ("N", "They had read about the bunker, the Arctic, the Amazon, the ocean and the desert. Their message was simple. If anyone can stay calm when things go wrong, it's you.", "profile", {"time": "night", "outfit": "out", "seed": 42}),
    ("N", "His commander would be Vera Lindqvist. Fifty-four years old, from northern Sweden. Four missions, more than six hundred days in orbit. A woman who had once fixed a broken toilet in zero gravity with a spoon and a hair tie.", "vera", {"mode": "training"}),
    ("VERA", "Up there, Noah, there is no such thing as a small problem. A loose screw is a bullet. A drop of water is a fire hazard. And a mistake you make on Monday tries to kill you on Thursday. So we don't make mistakes. Understood?", "vera", {"mode": "training", "seed": 2}),
    ("N", "For six months, Noah trained. He spun in centrifuges until he blacked out. He floated in a giant pool in a spacesuit, practicing for a spacewalk he was told he would never have to do. Just in case.", "spacewalk", {"phase": "pool"}),
    ("NOAH", "Vera, be honest. Am I ever really going to need this?", "profile", {"time": "module", "outfit": "out", "seed": 43}),
    ("VERA", "I hope not. That's why we practice it.", "vera", {"mode": "training", "seed": 3, "smile": True}),
)

# ------------------------------------------------------------- 02 LAUNCH
scene(
    ("N", "The launch was scheduled for a cold morning in March. At dawn, the rocket stood on the pad, white and silent, breathing clouds of frozen vapor like a sleeping animal.", "rocket", {"phase": "pad"}),
    ("N", "Noah lay on his back in the capsule, strapped into a seat molded to the exact shape of his body. Above him, seventy meters of rocket. Below him, five hundred tons of fuel.", "profile", {"time": "capsule", "outfit": "out", "seed": 44}),
    ("CONTROL", "Ember, Control. All systems are go. Ten, nine, eight...", "control", {"mode": "launch"}),
    ("-", "", "rocket", {"phase": "launch", "dur": 3.0}),
    ("N", "The engines ignited with a roar that Noah felt in his teeth. The capsule shook so hard he couldn't read the screens. An invisible hand pressed him into his seat, heavier and heavier, until breathing itself was work.", "rocket", {"phase": "ascent"}),
    ("N", "Eight and a half minutes. That's all it took. The blue sky outside the window turned purple, then indigo, then black. The engines stopped. And suddenly the pressure was gone.", "rocket", {"phase": "space"}),
    ("N", "A pen floated up from Noah's pocket and drifted slowly past his face. He reached for it. And then he looked out the window. And forgot about the pen.", "earth", {"view": "limb", "seed": 3}),
    ("NOAH", "Oh my God. Vera. Look at it.", "profile", {"time": "cupola", "outfit": "out", "seed": 45}),
    ("N", "The Earth filled the window. Not a map. Not a photograph. A living thing. Swirling white clouds, deep blue oceans, the brown wrinkles of mountains. And around all of it, a line of light so thin it looked painted on. The atmosphere. Everything that keeps every human alive, thinner than the skin of an apple.", "earth", {"view": "full", "seed": 4}),
)

# ------------------------------------------------------------- 03 MERIDIAN
scene(
    ("N", "Six hours later, the capsule docked with Meridian. Four connected modules, two long golden wings of solar panels, and a large round window looking down at the Earth.", "meridian", {"phase": "approach"}),
    ("N", "For the next five days, Noah lived the strangest life of his own. He slept in a sleeping bag strapped to a wall. He drank coffee from a plastic pouch. When he spilled water, it didn't fall. It floated in trembling silver spheres that he had to catch with a towel.", "waterBlob", {}),
    ("N", "The station circled the Earth every ninety-two minutes. Which meant sixteen sunrises a day. Every hour and a half, a line of fire swept across the horizon, and the whole planet lit up in orange and gold.", "earth", {"view": "sunrise", "seed": 5}),
    ("N", "Noah spent hours at the big window, which the crew called the cupola. He photographed hurricanes from above. Lightning storms flickering over Africa like fireflies. The green curtains of the aurora dancing over Canada. And at night, cities shining like spilled gold.", "cupola", {"view": "night"}),
    ("NOAH", "You can't see any borders from up here. No countries. No lines. Just one place.", "profile", {"time": "cupola", "outfit": "out", "seed": 46, "smile": True}),
    ("VERA", "Every astronaut says that. And every astronaut forgets it, a few months after landing. Try to remember it longer than we did.", "vera", {"mode": "cupola", "seed": 4}),
    ("N", "On the sixth day, they were supposed to start preparing for the trip home. Instead, at four in the morning, an alarm went off.", "module", {"mode": "alarm"}),
)

# ------------------------------------------------------------- 04 THE DEBRIS
scene(
    ("CONTROL", "Meridian, Control. We have an urgent debris warning. An old weather satellite broke apart two hours ago. Thousands of fragments. Your orbit crosses the cloud in forty minutes. Get to the capsule and close the hatch.", "control", {"mode": "alarm"}),
    ("N", "Space around the Earth is not empty. There are more than a million pieces of junk up there. Dead satellites, old rocket parts, flakes of paint. Each moving ten times faster than a bullet. Even a fragment the size of a marble can punch through metal like paper.", "earth", {"view": "limb", "seed": 6, "debris": True}),
    ("N", "Vera and Noah floated into the capsule, sealed the hatch, and strapped in. If the station was destroyed, the capsule could still take them home. That was the plan.", "profile", {"time": "capsule", "outfit": "out", "seed": 47}),
    ("VERA", "Twenty seconds. Hold on to something. And whatever you hear, don't open that hatch.", "vera", {"mode": "alarm", "worried": True, "seed": 5}),
    ("N", "At first, there was nothing. Just silence, and the hum of fans. Then came a sound like gravel thrown against a tin roof. Then a bang so loud the whole capsule rang like a bell.", "meridian", {"phase": "debris"}),
    ("-", "", "meridian", {"phase": "hit", "dur": 2.5}),
    ("N", "Alarms. Red lights. A hiss somewhere behind the walls. The pressure inside the main station was dropping. Vera opened the hatch and launched herself into the module, Noah right behind her, hunting for the leak.", "module", {"mode": "alarm", "noah": True}),
    ("N", "They found it in the lab module. A hole the size of a coin, whistling as the station's air rushed out into space. There was no time to patch it. Vera pushed Noah back and slammed the hatch shut. The heavy door crushed her wrist against the frame.", "module", {"mode": "alarm", "hatch": True}),
    ("VERA", "Agh! It's fine. It's fine. Lock it. Turn the handle, Noah! All the way!", "vera", {"mode": "alarm", "worried": True, "seed": 6}),
    ("N", "The hissing stopped. They were alive. But when the alarms finally went quiet, and Vera started checking the systems with one hand, the silence that followed was worse than any alarm.", "module", {"mode": "dim"}),
)

# ------------------------------------------------------------- 05 NO SIGNAL
scene(
    ("N", "The damage report took three hours. The main antenna had been cut in half. The backup antenna was on the outside of the lab module, now sealed and airless. And the oxygen generator was inside it.", "meridian", {"phase": "damaged"}),
    ("VERA", "Control, Meridian. Control, Meridian, do you copy?", "vera", {"mode": "dim", "worried": True, "seed": 7}),
    ("N", "Nothing. Only static. For the first time since the beginning of the space age, nobody on Earth could hear them. And nobody on Earth knew if they were still alive.", "control", {"mode": "silent"}),
    ("N", "Then Vera went to check the capsule. She pointed a camera at its outer shell, and stared at the screen for a long time without saying anything.", "capsule", {"phase": "crack"}),
    ("VERA", "The heat shield is cracked. A fragment hit it. If we try to go home in this... we burn up on the way down.", "vera", {"mode": "dim", "seed": 8}),
    ("N", "Their ship home was broken. Their radio was dead. Noah floated in the middle of the module, looking at the blue planet through the window. So close he could see the waves on the ocean. And completely out of reach.", "cupola", {"view": "day"}),
    ("NOAH", "Okay. What do we have? Tell me what we have.", "profile", {"time": "dim", "outfit": "out", "seed": 48}),
    ("N", "They made a list. Food for a month. Water for three weeks. Emergency oxygen tanks, enough for maybe six days. And a problem nobody talks about in the movies. Carbon dioxide.", "gauge", {"label": "OXYGEN", "unit": "DAYS LEFT", "from": 6.0, "to": 6.0, "max": 10}),
)

# ------------------------------------------------------------- 06 THE AIR
scene(
    ("N", "Every time you breathe out, you release carbon dioxide. On Earth, plants and wind take care of it. In a sealed metal room, it builds up. First comes the headache. Then confusion. Then sleep. And you never wake up.", "gauge", {"label": "CO2", "unit": "PPM", "from": 3000, "to": 9000, "max": 20000, "danger": 15000}),
    ("N", "The station's main air scrubber was in the lab module, behind the sealed hatch. The capsule had its own, but it was built for short trips. Its filters were designed to last two days, not two weeks.", "module", {"mode": "dim", "seed": 2}),
    ("N", "By the second day, the headaches had begun. Noah's thoughts felt slow and sticky, like walking through mud. Vera's hand was swollen and purple. She had splinted her wrist with a ruler and tape.", "vera", {"mode": "dim", "seed": 9, "worried": True}),
    ("VERA", "The capsule filters. We can stretch them. If we pull air through them slower, with more surface, they last longer. We need a bigger box. Bags, tape, a fan. Anything.", "vera", {"mode": "dim", "seed": 10}),
    ("N", "So Noah built one. Out of storage bags, a hose from the vacuum cleaner, a computer fan, two spare filters and an entire roll of silver tape. It looked like a child's school project. It was ugly. And it was the most important thing he had ever made.", "scrubber", {"phase": "parts"}),
    ("N", "When he turned it on, the fan whirred, and the bags slowly puffed up like lungs. They watched the carbon dioxide meter for an hour, without speaking.", "scrubber", {"phase": "built"}),
    ("N", "The number stopped rising. And then, very slowly, it started to fall.", "gauge", {"label": "CO2", "unit": "PPM", "from": 9000, "to": 6000, "max": 20000, "danger": 15000}),
    ("NOAH", "Ha! It's working! Vera, it's working!", "profile", {"time": "dim", "outfit": "out", "seed": 49, "smile": True}),
    ("VERA", "It's buying time. Time is good. But time is not a way home. Someone has to know we're alive.", "vera", {"mode": "dim", "seed": 11}),
)

# ------------------------------------------------------------- 07 THE SPACEWALK
scene(
    ("N", "There was one way to talk to Earth again. The backup antenna. If someone went outside, unbolted it from the dead lab module, and connected it to a spare socket on the living one, they might be able to call home.", "antenna", {"state": "broken"}),
    ("N", "Vera was the expert. She had done eleven spacewalks. But nobody can work in a spacesuit with a broken wrist. There was only one other person on board.", "vera", {"mode": "dim", "seed": 12}),
    ("VERA", "I'll be in your ear the whole time. Every bolt, every move. You trained for this, Noah. Remember the pool.", "vera", {"mode": "dim", "seed": 13}),
    ("NOAH", "In the pool, if I let go, I just floated to the bottom.", "profile", {"time": "dim", "outfit": "out", "seed": 50}),
    ("N", "It took four hours to put on the suit and prepare. Then the outer hatch opened. And Noah pulled himself out into the void.", "spacewalk", {"phase": "exit"}),
    ("N", "There is no up or down outside a space station. Only the Earth, filling half of everything. Huge. Bright. Turning silently beneath his boots. And a thin steel cable, clipped to his belt, the only thing connecting him to the rest of humanity.", "spacewalk", {"phase": "climb"}),
    ("VERA", "Breathe, Noah. Slowly. One hand, then the other. Never let go with both.", "vera", {"mode": "station", "seed": 14}),
    ("N", "He crawled along the outside of the station, hand over hand, toward the antenna. It took him fifty minutes to move twenty meters. He unbolted the antenna, piece by piece, while sweat floated off his face inside his helmet.", "antenna", {"state": "work"}),
    ("N", "And then the sun went out. Orbital night. In less than ten seconds, the world went from blinding white to absolute black. Noah was alone in the dark, with only his helmet light, and the cities of Asia glowing far below.", "spacewalk", {"phase": "night"}),
    ("N", "As he turned to move back, his tether snagged on a broken edge of the solar panel. He pulled. It didn't move. He pulled harder. And the hook on his belt slipped open.", "spacewalk", {"phase": "drift"}),
    ("VERA", "Noah! Grab the rail! The rail on your left! Now!", "vera", {"mode": "station", "worried": True, "seed": 15}),
    ("N", "His glove closed around the metal rail with nothing but a few centimeters to spare. For a long moment, he just hung there, breathing. Between him and the endless black, there had been one second, and one hand.", "spacewalk", {"phase": "grab"}),
    ("N", "He clipped back in. He carried the antenna to the living module. He connected the cable, exactly as Vera told him. And when he finally floated back through the hatch, his legs were shaking so much he couldn't stand. Not that it mattered. There was nothing to stand on.", "antenna", {"state": "fixed"}),
    ("N", "Vera switched on the transmitter. A green light blinked. And then it died. The fragment that had cut the main antenna had also burned out the amplifier. The antenna was perfect. But there was nothing left to power it.", "module", {"mode": "dim", "panel": True}),
)

# ------------------------------------------------------------- 08 THE OLD RADIO
scene(
    ("N", "That night, neither of them slept. The oxygen gauge showed four days left. The nearest rescue was a world away, and the world didn't even know they needed one.", "gauge", {"label": "OXYGEN", "unit": "DAYS LEFT", "from": 4.2, "to": 4.0, "max": 10}),
    ("N", "Noah was floating near the storage lockers, unable to rest, when he saw it. A small yellow box with a label in Vera's handwriting. School contacts.", "module", {"mode": "dim", "box": True}),
    ("VERA", "The ham radio! I forgot. We brought it for the children. Schools around the world call the station with homemade antennas, and ask us questions. Do you sleep standing up. What do you eat.", "vera", {"mode": "dim", "seed": 16, "smile": True}),
    ("N", "It was a tiny amateur radio. Less powerful than a walkie-talkie. It didn't need the broken amplifier. But it had one huge limitation. It could only reach someone almost directly beneath them, during the ten minutes the station passed overhead.", "hamRadio", {"freq": "145.800", "rx": False}),
    ("N", "And most of the Earth is ocean. Most of the land is empty. Most of the time, there would be nobody below them listening.", "groundTrack", {"phase": "track"}),
    ("NOAH", "Then we call every pass. Every ninety-two minutes. Until someone answers.", "profile", {"time": "dim", "outfit": "out", "seed": 51}),
    ("N", "And so they did. Over the Pacific. Over Siberia. Over the Sahara, where Noah thought of Idris and his three glasses of tea. Over and over, the same words, into the static.", "earth", {"view": "night", "seed": 7, "station": True}),
    ("VERA", "CQ, CQ, this is space station Meridian. Emergency. Anyone who can hear us, please answer. Over.", "vera", {"mode": "dim", "seed": 17}),
    ("N", "Sixteen passes. Twenty. Twenty-five. Nothing but static. The carbon dioxide was rising again, as the last filters wore out. Noah's head was pounding. Vera's voice was getting slower.", "hamRadio", {"freq": "145.800", "rx": False, "static": True}),
    ("N", "On the second night, after the thirty-first call, Noah stopped speaking in the middle of the message. He just held the radio. And watched the dark curve of South America sliding past the window.", "cupola", {"view": "night", "seed": 2}),
)

# ------------------------------------------------------------- 09 THE GIRL IN THE DESERT
scene(
    ("N", "Twelve thousand kilometers away, and four hundred kilometers below, in a village at the edge of the Atacama Desert in Chile, a fifteen-year-old girl named Sofía was sitting on the roof of her house.", "atacama", {"time": "night", "house": True}),
    ("N", "The Atacama is the driest place on Earth. And it has the clearest skies. Sofía's grandfather had been an amateur radio operator for fifty years. Every clear night, they used to sit on this roof together, with his old radio, and listen to the space stations passing overhead.", "sofia", {"mode": "roof"}),
    ("N", "He had died the year before. Sofía still came up to the roof. Still turned on the radio. Mostly, she said, so that he wouldn't be the only one who stopped listening.", "sofia", {"mode": "roof", "seed": 2}),
    ("N", "That night, through the hiss of the speaker, she heard a voice. Broken. Tired. Speaking in English.", "hamRadio", {"freq": "145.800", "rx": True, "static": True}),
    ("VERA", "...Meridian... emergency... anyone who can hear us...", "hamRadio", {"freq": "145.800", "rx": True, "static": True, "seed": 2}),
    ("SOFIA", "Meridian, Meridian! I hear you! This is Sofía, in Chile! I hear you! Over!", "sofia", {"mode": "roof", "seed": 3, "worried": True}),
    ("N", "On the station, Noah almost dropped the radio. Vera grabbed his arm. They had eight minutes before the station disappeared over the horizon. Eight minutes to tell the entire story to a teenager on a rooftop.", "profile", {"time": "dim", "outfit": "out", "seed": 52, "smile": True}),
    ("NOAH", "Sofía, listen to me. Write this down. Two crew, alive. Antenna destroyed. Capsule heat shield damaged. Oxygen for three days. Please, call the space agency. Tell them Meridian is alive.", "profile", {"time": "dim", "outfit": "out", "seed": 53}),
    ("N", "Sofía wrote every word on the back of her chemistry homework. Then the voice faded into static, and the little moving star disappeared behind the mountains.", "atacama", {"time": "night", "iss": True}),
    ("N", "She called the police. They laughed. She called the radio club. Nobody answered at two in the morning. So she put on her jacket, took her grandfather's old bicycle, and rode eleven kilometers in the dark, up a dirt road, to the big astronomical observatory on the mountain.", "atacama", {"time": "night", "bike": True}),
    ("N", "The guard at the gate didn't want to let her in. But an astronomer working the night shift heard the shouting, came out, and read the homework page. And then she looked at the orbit tracker on her phone. Meridian had passed directly over this valley, at exactly the time Sofía said.", "groundTrack", {"phase": "chile"}),
    ("N", "Within an hour, the observatory was on the phone with mission control. And by sunrise, the whole world knew. Two people were still alive up there. And a fifteen-year-old girl had been the only one listening.", "control", {"mode": "cheer"}),
    ("CONTROL", "Meridian, Control. We hear you. We hear you. Welcome back. A rescue capsule is being prepared right now. Hang on.", "hamRadio", {"freq": "145.800", "rx": True, "seed": 3}),
)

# ------------------------------------------------------------- 10 THE LAST NIGHT
scene(
    ("N", "The good news was that a rescue capsule could launch in three days. The bad news was the oxygen. By Vera's math, they had two and a half.", "gauge", {"label": "OXYGEN", "unit": "DAYS LEFT", "from": 2.5, "to": 2.4, "max": 10, "danger": 3}),
    ("N", "Control sent them a plan. Every ground station on Earth with an amateur radio was now listening for them. The plan was simple, and brutal. Move as little as possible. Talk as little as possible. Sleep as much as possible. Every breath counted.", "control", {"mode": "plan"}),
    ("N", "So they lay still, in the dim light, strapped into their sleeping bags, side by side. And during the long hours, Vera talked. Slowly. Quietly. About her daughter, who was nineteen and thought astronauts were boring.", "vera", {"mode": "dim", "seed": 18}),
    ("VERA", "On my first mission I was so busy I never looked out the window. Do you know what I regret the most? Not the danger. The sunrises I didn't watch.", "vera", {"mode": "dim", "seed": 19}),
    ("N", "So Noah woke her up for the next one. They floated to the cupola together, very slowly, and watched the line of fire sweep across the Pacific. Sunrise number one hundred and seventy-three.", "earth", {"view": "sunrise", "seed": 8}),
    ("N", "On the last day, the oxygen alarm began to beep softly. Noah's vision was blurry at the edges. Every thought took a long time to arrive. He took a photograph of the Earth, and could not remember why.", "gauge", {"label": "OXYGEN", "unit": "HOURS LEFT", "from": 9, "to": 6, "max": 24, "danger": 12}),
    ("N", "Then, through the window, he saw a new light. Small and white. Getting bigger. Getting closer. Firing tiny bursts of gas as it lined itself up with the station.", "capsule", {"phase": "approach"}),
    ("CONTROL", "Meridian, this is Dawn. We are thirty meters out. Coming to you. Put the kettle on.", "capsule", {"phase": "dock"}),
    ("N", "The docking clamps closed with a clang. And when the hatch opened, the first thing Noah felt was the air. Cold, clean, fresh air from the rescue ship, pouring into the station. He breathed it in like water in the desert.", "module", {"mode": "day", "noah": True, "rescue": True}),
)

# ------------------------------------------------------------- 11 THE RETURN
scene(
    ("N", "Twelve hours later, the rescue capsule undocked, carrying four people home. Behind them, Meridian grew smaller, its golden wings catching the sun. Empty, for now.", "meridian", {"phase": "leave"}),
    ("N", "Coming home from space is like being thrown into a furnace. The capsule hit the atmosphere at twenty-eight thousand kilometers per hour, and the window turned orange, then white, as a cloud of burning plasma wrapped around them.", "capsule", {"phase": "reentry"}),
    ("N", "Then a jolt. Then another. Four huge parachutes bloomed against a blue sky. And for the first time in eleven days, Noah felt gravity. Heavy, beautiful gravity, pulling him back toward the ground.", "capsule", {"phase": "chutes"}),
    ("N", "They splashed down in the Pacific Ocean at dawn. Noah laughed until he cried. After everything, he had come home exactly where he swore he never wanted to be again. In the middle of the sea.", "capsule", {"phase": "splash"}),
    ("N", "Vera needed surgery on her wrist. Noah needed three weeks to learn how to walk without falling over. And the first thing he did, when his legs worked again, was buy a ticket to Chile.", "profile", {"time": "day", "outfit": "out", "seed": 54, "smile": True}),
    ("N", "Sofía was waiting for him on the same roof, with her grandfather's radio. She was taller than he expected, and very shy. Until he gave her a photograph.", "sofia", {"mode": "day", "seed": 4}),
    ("N", "He had taken it from the cupola, on the night of the thirty-second call. The dark curve of the Andes. The desert. And in the middle of all that blackness, one tiny point of light. A single village. Her village.", "earth", {"view": "chile", "seed": 9}),
    ("SOFIA", "That's my house. You took a picture of my house. From space.", "sofia", {"mode": "day", "seed": 5, "smile": True}),
    ("N", "Today, the space company has a new rule. Every station, every capsule, carries a small amateur radio. Just in case. And on the frame of the cupola window, someone has written two words in marker. Keep listening.", "cupola", {"view": "day", "seed": 3, "note": True}),
    ("N", "Every few months, Noah gets a message from Chile. A photograph of the night sky, with a long bright streak across it. And four words.", "phone", {"screen": "email", "from": "Sofía · Atacama, Chile", "text": "It passed over tonight. I waved."}),
    ("N", "Because sometimes, when everything else fails, what saves us is not the most powerful machine. It's a small voice. And someone, somewhere, who never stopped listening.", "atacama", {"time": "night", "iss": True, "roof": True}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were stranded in space with three days of air, and a broken antenna outside... would you climb out into the void, with one thin cable holding you to the station? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
