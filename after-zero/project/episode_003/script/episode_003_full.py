"""AFTER ZERO — Episode 003 — WHAT HAPPENS IF YOU ARE STRANDED IN THE ARCTIC?

Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · INGRID (bush pilot) · BASE (station radio) · HELI (rescue pilot, radio)
"""

TITLE = "WHAT HAPPENS IF YOU ARE STRANDED IN THE ARCTIC?"
QUESTION = "Would <i>you</i> have<br />made the walk?"

CHAPTERS = [
    "WHITEOUT", "THE FLIGHT", "THE STORM", "MINUS FORTY", "THE PILOT", "THE LONG TWILIGHT",
    "THE ICE MOVES", "THE VISITOR", "THE DECISION", "THE WALK", "THE STATION", "THE RESCUE",
]
MOOD_MAP = [3, 6, 5, 7, 1, 2, 8, 5, 9, 6, 10, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 WHITEOUT (cold open)
scene(
    ("-", "", "iceWalk", {"time": "storm", "dur": 4.0}),
    ("N", "Imagine standing in a place so cold that your breath freezes before it hits the ground.", "iceWalk", {"time": "storm", "seed": 2}),
    ("N", "Where the wind can strip the heat from your body in minutes. Where every direction looks exactly the same.", "thermo", {"temp": -41}),
    ("N", "No roads. No trees. No sound except the ice, groaning beneath your feet.", "iceCrack", {"time": "twilight", "calm": True}),
    ("N", "And the nearest human being... is thirty kilometers away.", "iceMap", {"route": False}),
    ("N", "This is the story of Noah. And of the twelve days that taught him what really happens... when you are stranded in the Arctic.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE FLIGHT
scene(
    ("N", "It was supposed to be the adventure of a lifetime.", "planeSky", {"time": "day"}),
    ("N", "Noah had been hired for three weeks as a technician at Nordhavn, a small research station on the edge of the Arctic Ocean. His job was simple: install and test new weather sensors before the long winter night arrived.", "profile", {"time": "arctic", "outfit": "out"}),
    ("N", "The last leg of the journey was a four-hour flight in a small propeller plane, loaded with supplies, fuel drums and boxes of scientific equipment.", "planeInterior", {}),
    ("N", "He had taken the job almost by accident. A friend of a friend had dropped out at the last minute, and Noah had said yes before he could talk himself out of it. He wanted, just once, to go somewhere truly far away.", "planeSky", {"time": "day", "seed": 3}),
    ("N", "The pilot was a woman named Ingrid Halvorsen. Fifty-six years old. Thirty years flying in the north. She had landed on glaciers, frozen lakes and stretches of sea ice that most pilots wouldn't even look at.", "ingrid", {"mode": "cockpit"}),
    ("INGRID", "First time this far north?", "ingrid", {"mode": "cockpit", "seed": 2}),
    ("NOAH", "That obvious?", "profile", {"time": "plane", "outfit": "parka"}),
    ("INGRID", "You've been staring out the window for two hours like a child at an aquarium. Don't worry. Everyone does, the first time.", "ingrid", {"mode": "cockpit", "seed": 3}),
    ("INGRID", "People think the Arctic is empty. It isn't. It's full. Full of wind, and light, and things that have learned to live where nothing should. You just have to know how to look.", "ingrid", {"mode": "cockpit", "seed": 4}),
    ("N", "Below them, the world was white and endless. Mountains, then glaciers, then the frozen sea, cracked into a giant puzzle of ice.", "planeSky", {"time": "day", "seed": 2, "ice": True}),
    ("N", "It was the most beautiful thing Noah had ever seen. He took a photo with his phone, and sent it to his sister. It never went through.", "planeInterior", {"seed": 2, "noah": True}),
    ("N", "An hour from Nordhavn, Ingrid tapped the fuel gauge... and stopped smiling.", "ingrid", {"mode": "cockpit", "worried": True}),
)

# ------------------------------------------------------------- 02 THE STORM
scene(
    ("N", "A storm front had moved in from the north. Faster than any forecast had predicted. In minutes, the horizon disappeared.", "planeSky", {"time": "storm"}),
    ("INGRID", "Hold on to something. This is going to get bumpy.", "ingrid", {"mode": "cockpit", "worried": True, "shake": 0.4}),
    ("N", "The plane dropped and lurched like a leaf in the wind. Snow hammered the windshield. The instruments began to flicker.", "planeInterior", {"shake": 0.8, "noah": True}),
    ("N", "Ice was forming on the wings. The engine coughed once, then again.", "planeSky", {"time": "storm", "seed": 2, "shake": 0.6}),
    ("INGRID", "Mayday, mayday, mayday. Charlie Kilo Four, losing altitude, sixty miles southwest of Nordhavn. Attempting landing on sea ice.", "ingrid", {"mode": "cockpit", "worried": True, "shake": 0.8, "seed": 2}),
    ("N", "There was no answer. Only static.", "radioClose", {"state": "search"}),
    ("N", "Ingrid searched the white chaos below for anything flat. Anything solid.", "ingrid", {"mode": "cockpit", "worried": True, "shake": 0.6, "seed": 3}),
    ("INGRID", "Brace! Brace! Brace!", "planeInterior", {"shake": 1.0, "noah": True, "seed": 2}),
    ("-", "", "crash", {"dur": 4.0}),
    ("-", "", "black", {"dur": 2.0}),
    ("N", "When Noah opened his eyes, the world was sideways. The engine was silent. And the only sound was the wind.", "wreck", {"time": "storm", "inside": True}),
    ("N", "The plane had skidded three hundred meters across the ice before a ridge of frozen snow tore off its left wing. But the cabin was intact. And they were alive.", "wreck", {"time": "storm"}),
)

# ------------------------------------------------------------- 03 MINUS FORTY
scene(
    ("N", "Here is something most people don't know about extreme cold. It doesn't kill you dramatically. It kills you quietly. One degree at a time.", "thermo", {"temp": -38}),
    ("N", "At minus forty, exposed skin can freeze in less than ten minutes. Your body pulls blood away from your hands and feet to protect your heart. Your fingers stop working. Then your thoughts slow down.", "profile", {"time": "storm", "outfit": "parka", "frost": 0.4}),
    ("N", "The most dangerous moment is often the first hour after an accident, when shock and adrenaline make people forget the cold.", "wreck", {"time": "storm", "seed": 2}),
    ("N", "And then there is hypothermia. When your core temperature drops just two degrees, you start to shiver uncontrollably. At four degrees, you become confused and clumsy. Below that, the shivering stops... and that is when it becomes truly dangerous.", "thermo", {"temp": -38, "body": True}),
    ("N", "Noah's first instinct was to run outside and look for help. Ingrid grabbed his arm.", "ingrid", {"mode": "cabin", "hurt": True}),
    ("INGRID", "No. Listen to me. Nobody walks anywhere in this. We stay with the plane. The plane is shelter. The plane is what they'll be looking for.", "ingrid", {"mode": "cabin", "hurt": True, "seed": 2}),
    ("N", "They blocked the broken window with seat cushions and a tarp. They put on every layer they had. Noah found a small camping stove in the emergency kit, and a box of fuel canisters.", "cabinNight", {"stove": True}),
    ("N", "The first blue flame was the most beautiful thing he had ever seen. More beautiful, even, than the ice from the sky.", "cabinNight", {"stove": True, "seed": 2, "close": True}),
    ("N", "Outside, the storm raged for thirty hours. Inside, two strangers sat shoulder to shoulder, listening to the wind try to tear the plane apart.", "wreck", {"time": "storm", "seed": 3, "light": True}),
    ("NOAH", "Day one. I'm recording this in case... in case someone finds the phone. We crashed. We're alive. The pilot's name is Ingrid. She's the calmest person I've ever met. I'm trying very hard to be the second calmest.", "profile", {"time": "stove", "outfit": "parka", "frost": 0.1}),
)

# ------------------------------------------------------------- 04 THE PILOT
scene(
    ("N", "When the storm finally passed, Noah saw how badly Ingrid was hurt.", "cabinNight", {"stove": True, "seed": 3, "ingrid": True}),
    ("N", "Her left leg was broken below the knee. She had splinted it herself during the night, with a piece of the instrument panel and a roll of tape, and hadn't said a word.", "ingrid", {"mode": "cabin", "hurt": True, "seed": 3}),
    ("NOAH", "Why didn't you tell me?", "profile", {"time": "stove", "outfit": "parka"}),
    ("INGRID", "Because you would have panicked. And I needed you calm. You did well, by the way.", "ingrid", {"mode": "cabin", "hurt": True, "seed": 4, "smile": True}),
    ("N", "They took stock. The radio had been destroyed in the crash. The emergency beacon was transmitting... but its antenna had snapped off, and nobody knew how far the weak signal could reach.", "radioClose", {"state": "dead"}),
    ("N", "They had food for maybe ten days, if they were careful. Fuel for the stove, about the same. And snow, of course. Endless snow, that could become water.", "cabinNight", {"stove": True, "seed": 4}),
    ("N", "Noah learned his first rule of the Arctic from Ingrid that morning. Never eat snow. Always melt it first. Eating snow lowers your body temperature, and in the cold, heat is life.", "cabinNight", {"stove": True, "pot": True}),
    ("INGRID", "Out here, everything is about energy. Every movement costs heat. Every mistake costs heat. You don't waste anything. Not even a shiver.", "ingrid", {"mode": "cabin", "seed": 5}),
    ("INGRID", "Tell me about home. Talking keeps the mind warm. Who's waiting for you?", "ingrid", {"mode": "cabin", "seed": 6, "smile": True}),
    ("NOAH", "My sister. She's the one who always calls first. She told me this trip was a terrible idea. I told her she worries too much.", "profile", {"time": "stove", "outfit": "parka", "frost": 0.15, "seed": 2}),
    ("INGRID", "Then we'll have to get you home, so you can tell her she was right.", "ingrid", {"mode": "cabin", "seed": 7, "smile": True}),
    ("N", "She taught him how to build a snow wall to block the wind. How to check his own face and fingers for the white patches of frostbite. How to sleep with his boots inside his sleeping bag, so they wouldn't freeze solid.", "snowWall", {}),
    ("N", "And she told him stories. About the north. About the people who had survived here for thousands of years, long before planes and radios.", "cabinNight", {"stove": True, "seed": 5, "ingrid": True}),
)

# ------------------------------------------------------------- 05 THE LONG TWILIGHT
scene(
    ("N", "It was late October. In this part of the world, the sun was disappearing for the winter.", "iceVista", {"time": "twilight"}),
    ("N", "Each day, it rose a little lower, and set a little sooner. On the fourth day, it barely cleared the horizon at all, a pale orange disc sliding sideways along the edge of the world.", "iceVista", {"time": "twilight", "seed": 2, "sunLow": True}),
    ("N", "Soon there would be no sun at all. Only months of darkness, and the light of the moon and stars on the ice.", "iceVista", {"time": "night", "seed": 3}),
    ("NOAH", "Day four. No planes. No helicopters. I keep listening for engines. Every gust of wind sounds like rescue for a second... and then it doesn't.", "profile", {"time": "stove", "outfit": "parka", "frost": 0.2}),
    ("N", "Every morning, they performed the same ritual. Ingrid checked Noah's nose, cheeks and ears for the waxy white spots of frostbite. Noah checked her fingers, one by one. It became a kind of greeting. Good morning. You're still here. So am I.", "cabinNight", {"stove": True, "seed": 9, "ingrid": True}),
    ("N", "On the fifth night, the sky caught fire.", "aurora", {}),
    ("N", "Curtains of green light rippled across the darkness, folding and unfolding, so bright that the snow glowed beneath them.", "aurora", {"seed": 2, "noah": True}),
    ("INGRID", "My grandmother used to say you should never whistle at the northern lights. Or they will come down and take you with them.", "ingrid", {"mode": "aurora"}),
    ("NOAH", "Do you believe that?", "profile", {"time": "aurora", "outfit": "parka"}),
    ("INGRID", "I believe it's not a good night to find out.", "ingrid", {"mode": "aurora", "seed": 2, "smile": True}),
    ("N", "That night, Ingrid told him why she still flew, at an age when most pilots had retired. Her husband had been a pilot too. Twenty years ago, he had gone down in a storm, not far from here. They never found the plane.", "ingrid", {"mode": "aurora", "seed": 3}),
    ("INGRID", "Everyone told me to stop flying. But up here, I always feel like he's just over the next horizon. So I keep going to the next horizon.", "ingrid", {"mode": "aurora", "seed": 4}),
    ("N", "For the first time since the crash, they both laughed. And for a few minutes, under that impossible sky, the cold didn't seem so terrible.", "aurora", {"seed": 3, "noah": True, "wide": True}),
)

# ------------------------------------------------------------- 06 THE ICE MOVES
scene(
    ("N", "On the sixth day, Noah woke to a sound he would never forget. A deep, heavy crack, like a cannon fired underwater.", "iceCrack", {"time": "twilight"}),
    ("N", "Sea ice is not land. It floats. It drifts with the wind and the currents. And sometimes, it breaks.", "iceCrack", {"time": "twilight", "seed": 2, "open": 0.3}),
    ("N", "Two hundred meters from the plane, a black line had opened in the white. A channel of open water, steaming in the frozen air.", "iceCrack", {"time": "twilight", "seed": 3, "open": 0.7}),
    ("INGRID", "The pack is breaking up. If that crack keeps growing, we could end up on an island of ice. Drifting out to sea.", "ingrid", {"mode": "cabin", "worried": True}),
    ("N", "Ingrid checked her compass against the stars. The ice had already moved. They were drifting east, away from the coast. Away from where any search would be looking.", "iceMap", {"route": False, "drift": True}),
    ("N", "That night, neither of them slept. They lay in the dark, feeling the faint, sickening sway of the whole world beneath them.", "cabinNight", {"stove": False, "seed": 6}),
    ("N", "The next morning, they moved everything they could to the side of the plane farthest from the crack. Food, fuel, sleeping bags. It wouldn't save them if the floe broke. But it felt better than doing nothing.", "snowWall", {"seed": 2}),
)

# ------------------------------------------------------------- 07 THE VISITOR
scene(
    ("N", "On the seventh day, they had a visitor.", "iceVista", {"time": "twilight", "seed": 4}),
    ("N", "Noah saw it first, through the cracked window. A shape moving across the ice. Slow. Patient. Yellow-white against the blue snow.", "bear", {"dist": "far"}),
    ("N", "A polar bear. The largest land predator on Earth. It had smelled their food from kilometers away.", "bear", {"dist": "mid"}),
    ("INGRID", "Don't move. Don't make a sound. Get the flare gun from the kit. Slowly.", "ingrid", {"mode": "cabin", "worried": True, "seed": 2}),
    ("N", "The bear circled the plane once. Twice. It stood on its hind legs and pressed its nose against the fuselage, just a few centimeters from Noah's face, separated by a sheet of aluminum.", "bear", {"dist": "close"}),
    ("-", "", "bear", {"dist": "close", "dur": 3.0, "seed": 2}),
    ("N", "Ingrid nodded. Noah pushed open the door, aimed the flare gun into the snow between them and the bear... and fired.", "flare", {}),
    ("N", "A burst of red light and smoke exploded across the ice. The bear flinched, turned... and loped away into the twilight, unhurried, as if it had simply lost interest.", "bear", {"dist": "leaving"}),
    ("NOAH", "I think my heart stopped. I think it actually stopped.", "profile", {"time": "flare", "outfit": "parka", "frost": 0.3}),
    ("INGRID", "It didn't. I can hear it from here.", "ingrid", {"mode": "cabin", "smile": True, "seed": 3}),
    ("N", "But they both knew the truth. They had used one of their three flares. And the bear would be back.", "cabinNight", {"stove": True, "seed": 7}),
)

# ------------------------------------------------------------- 08 THE DECISION
scene(
    ("N", "On the eighth day, Ingrid spread her old paper chart across her knees, and pointed to a tiny square on the coast.", "iceMap", {"route": False, "station": True}),
    ("INGRID", "Kapp Varde. An old weather station. Unmanned, but they still keep a radio there for emergencies. Fifteen kilometers. Maybe a little more.", "ingrid", {"mode": "cabin", "seed": 6}),
    ("N", "With her broken leg, Ingrid couldn't walk a hundred meters. If anyone was going to reach that radio, it would have to be Noah. Alone.", "profile", {"time": "stove", "outfit": "parka", "frost": 0.3, "seed": 2}),
    ("NOAH", "I'm not leaving you here alone. With that bear out there. With the ice breaking up.", "profile", {"time": "stove", "outfit": "parka", "frost": 0.3, "seed": 3}),
    ("INGRID", "Noah. The ice is drifting. Every day, we're farther from the coast. In three days, that station will be out of reach. Then neither of us goes home.", "ingrid", {"mode": "cabin", "seed": 7}),
    ("N", "She gave him the compass, two of the remaining flares, half of the food, and a set of instructions he repeated until he could say them in his sleep.", "cabinNight", {"stove": True, "seed": 8, "ingrid": True}),
    ("INGRID", "Walk with the wind on your left cheek. Rest every hour, but never sit down for more than five minutes. If you start to feel warm and sleepy... that is the cold lying to you. Keep moving.", "ingrid", {"mode": "cabin", "seed": 8}),
    ("N", "At the first gray light of the ninth day, Noah stepped out onto the ice, and started walking north.", "iceWalk", {"time": "twilight", "start": True}),
    ("N", "He looked back once. A tiny broken plane in an ocean of white. And then he didn't look back again.", "wreck", {"time": "twilight", "far": True}),
)

# ------------------------------------------------------------- 09 THE WALK
scene(
    ("N", "The first five kilometers were almost easy. The air was still. The snow was firm. Noah counted his steps, a hundred at a time, and checked the compass after every hundred.", "iceWalk", {"time": "twilight", "seed": 2}),
    ("N", "Then the wind came back.", "iceWalk", {"time": "storm", "seed": 3}),
    ("N", "It came low across the ice, carrying snow like sand. Within an hour, he could barely see his own boots. Whiteout. The sky and the ground melted into one blank, featureless glow.", "iceWalk", {"time": "storm", "seed": 4, "whiteout": True}),
    ("N", "In a whiteout, people walk in circles without realizing it. Their brain has nothing to hold on to. Noah kept his eyes on the compass needle, and the wind on his left cheek.", "thermo", {"temp": -44, "wind": True}),
    ("NOAH", "One hundred. One hundred steps. Check. Okay. Again. One. Two. Three...", "profile", {"time": "storm", "outfit": "parka", "frost": 0.6}),
    ("N", "He crossed pressure ridges, walls of broken ice pushed up like frozen waves. He jumped across narrow cracks, and walked long detours around the wide ones.", "iceRidge", {}),
    ("N", "Somewhere in the fourth hour, he realized he wasn't alone. A small white shape was trotting along beside him, thirty meters away. An Arctic fox. It followed him for almost an hour, stopping when he stopped, moving when he moved.", "iceWalk", {"time": "twilight", "seed": 8, "fox": True}),
    ("NOAH", "Are you here to keep me company? Or waiting to see if I fall down? Either way... I'm glad you're here.", "profile", {"time": "storm", "outfit": "parka", "frost": 0.5, "seed": 4}),
    ("N", "Then, in the seventh hour, the ice gave way beneath his right foot.", "iceCrack", {"time": "storm", "open": 0.4, "seed": 5}),
    ("N", "He threw himself forward and rolled, and the water only reached his knee. But at minus forty, a wet foot is a death sentence. In minutes, the boot would freeze solid, and so would his toes.", "profile", {"time": "storm", "outfit": "parka", "frost": 0.6, "seed": 3}),
    ("N", "He remembered Ingrid's voice. He rolled in the dry snow to soak up the water before it could freeze. He pulled off the boot, changed into the spare socks she had made him carry inside his jacket, and kept walking. The whole thing took three minutes. It felt like three hours.", "iceWalk", {"time": "storm", "seed": 7, "slow": True}),
    ("N", "By the sixth hour, he could no longer feel his toes. By the eighth, his thoughts had started to drift. He found himself thinking about summer. About his sister's kitchen. About lying down in the snow, just for a minute.", "iceWalk", {"time": "storm", "seed": 5, "slow": True}),
    ("N", "If you start to feel warm and sleepy... that is the cold lying to you.", "profile", {"time": "storm", "outfit": "parka", "frost": 0.7, "seed": 2}),
    ("NOAH", "Keep moving. Keep moving, Noah. She's waiting. Keep moving.", "iceWalk", {"time": "storm", "seed": 6, "slow": True}),
    ("N", "Night fell. The wind dropped. And above him, once again, the northern lights began to dance. Green. Then violet. Then green again.", "aurora", {"seed": 4, "walker": True}),
    ("N", "And there, beneath them, on a low hill by the frozen shore... a thin black line pointed at the sky. A radio mast.", "station", {"time": "night", "far": True}),
)

# ------------------------------------------------------------- 10 THE STATION
scene(
    ("N", "Kapp Varde weather station was three small huts, half buried in snowdrifts, and a mast covered in ice.", "station", {"time": "night"}),
    ("N", "The door was frozen shut. Noah broke the ice from the handle with the butt of the flare gun, and fell inside.", "station", {"time": "night", "door": True}),
    ("N", "It was barely warmer than outside. But there was no wind. And on a shelf, under a layer of frost, sat a satellite radio and a battery pack.", "stationInt", {}),
    ("N", "His hands were so numb he had to press the buttons with his knuckles.", "radioClose", {"state": "led"}),
    ("NOAH", "Mayday. Mayday. This is... this is Noah. From the plane. Charlie Kilo Four. Is anyone receiving? Please.", "radioClose", {"state": "led", "seed": 2}),
    ("-", "", "radioClose", {"state": "search", "dur": 3.0}),
    ("BASE", "Charlie Kilo Four, this is Nordhavn station. We read you. Say again, we read you! Are you injured?", "radioClose", {"state": "voice"}),
    ("N", "Noah couldn't answer at first. He just held the radio against his chest and cried.", "profile", {"time": "station", "outfit": "parka", "frost": 0.6}),
    ("N", "Then the engineer in him took over again. He read the coordinates from the station's GPS. He described the drift, the crack, the wing.", "stationInt", {"noah": True}),
    ("BASE", "Copy all. Noah, listen to me. We called off the air search yesterday. Everyone thought you went down in open water. A helicopter is launching now.", "radioClose", {"state": "voice", "seed": 2}),
    ("N", "They had stopped looking. If he had stayed with the plane... no one would have come.", "stationInt", {"noah": True, "seed": 2}),
    ("N", "While he waited for the helicopter, Noah wrapped himself in every blanket he could find and stared at the radio. Every few minutes he pressed the button, just to hear a human voice answer.", "stationInt", {"noah": True, "seed": 3}),
    ("N", "And as the adrenaline drained away, Noah measured the distance on the station's wall map. Not fifteen kilometers. Thirty-one.", "iceMap", {"route": True}),
    ("N", "Ingrid had known. She had flown over this coast for thirty years. She had cut the distance in half... because she knew that if she told him the truth, he might not have gone.", "profile", {"time": "station", "outfit": "parka", "frost": 0.5, "seed": 2}),
)

# ------------------------------------------------------------- 11 THE RESCUE
scene(
    ("N", "The helicopter arrived at Kapp Varde two hours later. Noah refused to go to the hospital.", "heli", {"time": "night"}),
    ("NOAH", "She's out there. I know where. I'm coming with you.", "profile", {"time": "heli", "outfit": "parka", "frost": 0.5}),
    ("HELI", "Nordhavn, Rescue One. Heading for coordinates. Thermal camera on. Two minutes out.", "heliInt", {}),
    ("N", "They flew low over the ice, following the black line of the crack. It had grown wider. Much wider.", "heliView", {"open": 0.8}),
    ("N", "And there, on a floating island of ice barely bigger than a football field... was the plane. And beside it, a small red light. A flare. Burning in the snow.", "heliView", {"open": 0.9, "flare": True}),
    ("N", "Ingrid had heard the helicopter coming. She had dragged herself out of the cabin with her broken leg, and fired her last flare.", "ingrid", {"mode": "ice", "flareLit": True}),
    ("INGRID", "Took you long enough.", "ingrid", {"mode": "ice", "smile": True, "seed": 2}),
    ("NOAH", "You said fifteen kilometers.", "profile", {"time": "heli", "outfit": "parka", "frost": 0.4, "smile": True, "seed": 2}),
    ("INGRID", "I said maybe a little more.", "ingrid", {"mode": "ice", "smile": True, "seed": 3}),
    ("N", "Ingrid spent three weeks in hospital. Noah lost the tips of two toes to frostbite, and gained a friend for life.", "city", {"time": "day", "seed": 15}),
    ("N", "On her last day in hospital, Ingrid asked him a question.", "profile", {"time": "day", "outfit": "out", "seed": 5}),
    ("INGRID", "Next summer, I fly the coast again. To the next horizon. I need someone who knows how to walk thirty kilometers. Interested?", "ingrid", {"mode": "cabin", "smile": True, "seed": 8}),
    ("N", "When he finally called his sister from the hospital in Nordhavn, the photo he had sent from the plane arrived on her phone at the same moment. A frozen sea, seen from above, eleven days late.", "phoneCall", {}),
    ("N", "Two weeks after the rescue, the ice floe that had carried the plane broke apart in a storm, and sank into the Arctic Ocean.", "iceCrack", {"time": "night", "open": 1.0, "seed": 4}),
    ("N", "When people ask Noah what he learned in those twelve days, he doesn't talk about the cold, or the bear, or the walk.", "profile", {"time": "day", "outfit": "out", "seed": 4}),
    ("N", "He talks about a woman with a broken leg, who lied to him about the distance... because she believed he could make it, before he did.", "aurora", {"seed": 5, "wide": True}),
    ("N", "Because sometimes, survival isn't about being the strongest. It's about having someone who refuses to let you give up.", "iceVista", {"time": "twilight", "seed": 5, "sunLow": True}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were in Noah's place, would you have made the walk? Or stayed with the plane, and waited? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
