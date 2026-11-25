"""AFTER ZERO — Episode 007 — WHAT IF YOU WERE STRANDED IN THE SAHARA?

Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · YARA (geologist) · IDRIS (caravan leader)
"""

TITLE = "WHAT IF YOU WERE STRANDED IN THE SAHARA?"
QUESTION = "Would <i>you</i> stay<br />or walk?"

CHAPTERS = [
    "STRANDED", "THE EXPEDITION", "THE STORM", "STAY WITH THE CAR", "THE HEAT", "THE DECISION",
    "THE NIGHT WALK", "THE MIRAGE", "THE WELL", "THE GREEN SAHARA", "THE CARAVAN", "THE RETURN",
]
MOOD_MAP = [3, 6, 5, 7, 2, 8, 9, 7, 5, 10, 11, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 STRANDED (cold open)
scene(
    ("-", "", "dunes", {"time": "heat", "dur": 4.0, "walker": True, "far": True}),
    ("N", "Imagine a desert the size of the United States. Nine million square kilometers of sand, rock and sky.", "dunes", {"time": "day", "seed": 2, "aerial": True}),
    ("N", "Now imagine standing in the middle of it. With a broken car, an injured friend, and twenty liters of water. In a place where the temperature reaches fifty degrees during the day... and falls close to freezing at night.", "jeep", {"phase": "buried", "time": "heat"}),
    ("N", "No phone signal. No road. No footprints but your own. And nobody in the world who knows exactly where you are.", "dunes", {"time": "dusk", "seed": 3, "walker": True}),
    ("N", "This is the story of Noah. And of the nine days he spent stranded in the Sahara.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE EXPEDITION
scene(
    ("N", "After thirty-eight days lost in the Pacific Ocean, Noah made himself a promise. No more water. No more boats. If he ever went anywhere again, it would be somewhere dry.", "city", {"time": "day", "seed": 31}),
    ("N", "He should have been more specific.", "profile", {"time": "day", "outfit": "out", "seed": 31, "smile": True}),
    ("N", "The invitation came from Doctor Yara Haddad, a forty-one-year-old geologist who had read about Noah's story, and needed a photographer for a short expedition into the deep Sahara.", "yara", {"mode": "office"}),
    ("YARA", "Ten days. Two of us, one very good car, and more water than we could ever drink. I study rivers, Noah. Rivers that disappeared thousands of years ago. I just need someone to take pictures of them.", "yara", {"mode": "office", "smile": True, "seed": 2}),
    ("N", "On her satellite images, Yara had found something remarkable. Hidden under the sand, invisible from the ground, were the shapes of ancient riverbeds. Hundreds of kilometers long. Branching like the veins of a leaf.", "satMap", {"phase": "rivers"}),
    ("N", "Six thousand years ago, she explained, the Sahara wasn't a desert at all. It was green. With lakes, grasslands, and rivers full of fish. And she wanted to walk along one of those lost rivers with her own feet.", "yara", {"mode": "jeep", "seed": 3}),
    ("N", "They left the last town on a Tuesday morning, in a white four-by-four loaded with fuel, food, a satellite phone, and four big jerrycans of water. Within an hour, the road ended. Within three, there was nothing around them but sand.", "jeep", {"phase": "drive", "time": "day"}),
    ("N", "Noah had seen the ocean. He had seen the Arctic. But he had never seen anything like this. Dunes as tall as buildings, rolling to the horizon like frozen waves. And a silence so complete that he could hear his own heartbeat.", "dunes", {"time": "day", "seed": 4}),
    ("NOAH", "It's beautiful. It's like being on another planet.", "profile", {"time": "desert", "outfit": "trek", "seed": 2}),
    ("YARA", "It is beautiful. Just remember that it wants you dead. Everything out here is trying to take your water. The sun, the wind, the sand. Even your own breath.", "yara", {"mode": "jeep", "seed": 4}),
    ("N", "For four days, everything went perfectly. They camped under the most incredible stars Noah had ever seen. Yara found her river, exactly where the satellite had shown it. And Noah took hundreds of photographs.", "dunes", {"time": "night", "seed": 5, "camp": True}),
)

# ------------------------------------------------------------- 02 THE STORM
scene(
    ("N", "On the morning of the fifth day, Yara noticed something on the southern horizon. A thin brown line, like a smudge on the sky.", "dunes", {"time": "day", "seed": 6, "haze": True}),
    ("YARA", "Noah. Get in the car. Now.", "yara", {"mode": "jeep", "worried": True, "seed": 5}),
    ("N", "In the Sahara, they call it a haboob. A wall of sand and dust, sometimes more than a kilometer high, moving at the speed of a car. Pushed by a wind that can strip the paint off metal.", "haboob", {"phase": "far"}),
    ("N", "Yara tried to outrun it. She drove north, as fast as the sand would allow, while the brown wall grew behind them. Taller. Darker. Closer.", "haboob", {"phase": "near"}),
    ("-", "", "haboob", {"phase": "hit", "dur": 2.5}),
    ("N", "And then the world disappeared. Day turned into a brown, howling night. The sand hit the windows like a hailstorm. Noah couldn't see the hood of the car in front of him.", "jeepInside", {"storm": True}),
    ("N", "Yara kept driving, trying to find the shelter of a rocky ridge she remembered. She never saw the edge of the dune. The front wheels dropped. The car tipped forward... and rolled.", "jeep", {"phase": "roll", "time": "storm"}),
    ("N", "When it stopped, the car was on its side. Noah was hanging from his seatbelt. And Yara wasn't answering.", "jeepInside", {"storm": True, "tilt": True}),
    ("NOAH", "Yara! Yara, can you hear me? Talk to me!", "profile", {"time": "sandstorm", "outfit": "trek", "seed": 3}),
    ("YARA", "My leg. Noah, my leg. I think it's broken.", "yara", {"mode": "storm", "worried": True, "seed": 6}),
    ("N", "The storm raged for eleven hours. Noah held her hand in the dark, wrapped her leg with a jacket and two tent poles, and listened to the sand slowly burying the car.", "jeepInside", {"storm": True, "tilt": True, "dark": True}),
)

# ------------------------------------------------------------- 03 STAY WITH THE CAR
scene(
    ("N", "At dawn, the wind stopped. Noah forced the door open and climbed out into a world that had been completely rearranged.", "dunes", {"time": "dawn", "seed": 7, "car": "buried"}),
    ("N", "The dunes had moved. The tracks were gone. The car lay on its side, half buried, with sand packed inside the engine. And the satellite phone, which had been on the dashboard, was in pieces.", "jeep", {"phase": "buried", "time": "dawn"}),
    ("N", "Together, with a shovel and the car's jack, they managed to push it back onto its wheels. But the engine wouldn't start. Not even a click.", "jeep", {"phase": "buried", "time": "day", "noah": True}),
    ("N", "Yara's leg was badly broken below the knee. She couldn't stand. She couldn't walk. And she knew exactly what that meant.", "yara", {"mode": "car", "worried": True, "seed": 7}),
    ("YARA", "Rule number one in the desert. If your car breaks down, you stay with the car. A car can be seen from the air. A person walking can't. People who leave their cars are the ones they find later. Much later.", "yara", {"mode": "car", "seed": 8}),
    ("N", "So they stayed. And they counted everything they had left.", "desertInventory", {}),
    ("N", "One jerrycan of water had split open in the crash. Another had leaked into the sand. They had twenty-two liters left. For two people. A bag of dates, some bread, tins of sardines. A mirror. A torch. A tarp. A first aid kit. And Yara's laptop, with forty percent battery.", "desertInventory", {"lost": True}),
    ("N", "Noah did the math. In this heat, a person can sweat more than a liter of water every hour. Without shade, without rest, twenty-two liters would last two people maybe four days.", "heatGauge", {"temp": 48}),
    ("NOAH", "Somebody knows we're out here, right? Someone's going to come looking?", "profile", {"time": "desert", "outfit": "trek", "seed": 4}),
    ("YARA", "The university knows our route. In five days, when we don't come back, they'll send someone. But Noah... the storm pushed us more than sixty kilometers off that route. They'll be looking in the wrong place.", "yara", {"mode": "car", "worried": True, "seed": 9}),
)

# ------------------------------------------------------------- 04 THE HEAT
scene(
    ("N", "By ten in the morning, the sand was too hot to touch. By noon, the air above the dunes was shimmering. The thermometer on the dashboard read fifty-one degrees.", "heatGauge", {"temp": 51}),
    ("N", "The heat of the Sahara doesn't feel like heat. It feels like weight. It presses on your head and your chest. It dries your eyes. It turns every movement into work.", "dunes", {"time": "heat", "seed": 8}),
    ("N", "They stretched the tarp from the roof of the car to the sand, and lay in its shadow without moving, from morning until the sun went down. Yara taught him the rules. Don't talk too much. Breathe through your nose. Ration your sweat, not your water.", "jeep", {"phase": "camp", "time": "heat"}),
    ("N", "During the day, they barely moved. At night, they worked. Noah dug the wheels out. He laid stones on the sand in the shape of a giant arrow and the letters S, O, S, big enough to be seen from a plane.", "dunes", {"time": "night", "seed": 9, "car": "camp", "sos": True}),
    ("N", "And twice a day, at sunrise and sunset, he climbed the highest dune and flashed the mirror at the horizon. In every direction. Just in case.", "mirrorDesert", {}),
    ("N", "On the third day, they heard it. A low drone, far away in the sky. An airplane. Noah scrambled up the dune with the mirror, flashing it at the sky, shouting until his voice cracked.", "dunes", {"time": "day", "seed": 10, "plane": True, "walker": True}),
    ("N", "It was a passenger jet. Eleven kilometers up. Three hundred people eating lunch, watching movies, looking at the desert through their windows. Not one of them saw him.", "planeHigh", {}),
    ("NOAH", "Day three. Twelve liters left. Yara's leg is swollen and she has a fever. I'm doing everything she tells me. I don't know what else to do.", "profile", {"time": "desertNight", "outfit": "trek", "seed": 5, "beard": 0.2}),
)

# ------------------------------------------------------------- 05 THE DECISION
scene(
    ("N", "On the fourth night, Yara woke him up. She had her laptop open, its screen glowing blue in the dark. The battery was at nine percent.", "jeep", {"phase": "camp", "time": "night", "laptop": True}),
    ("YARA", "Look at this. This is where we are. And this, this line, is the old river I came to study. It runs north. Right past us.", "satMap", {"phase": "here"}),
    ("N", "On the satellite image, the ancient riverbed was a faint pale ribbon, snaking through the dunes. And forty kilometers to the north, where it met an old caravan trail, there was a tiny symbol from an old French map. A well.", "satMap", {"phase": "well"}),
    ("YARA", "Wells like that are used by the nomads. The caravans still cross this part of the desert. If there's water, there are people. Sooner or later.", "yara", {"mode": "night", "seed": 10}),
    ("NOAH", "You just told me rule number one is never to leave the car.", "profile", {"time": "desertNight", "outfit": "trek", "seed": 6, "beard": 0.25}),
    ("YARA", "Rule number one is for people who have time. We don't. At this rate, the water is gone in three days. And nobody is looking for us here.", "yara", {"mode": "night", "worried": True, "seed": 11}),
    ("N", "It was the hardest decision of Noah's life. If he stayed, they would both run out of water. If he went, he would leave Yara alone, injured, in the middle of the desert. And if he didn't find the well... nobody would ever find either of them.", "dunes", {"time": "night", "seed": 11, "car": "camp"}),
    ("N", "They split the water. Yara insisted he take more, because he would be walking. He refused. They argued in whispers for an hour. In the end, he took five liters. He left her seven.", "desertInventory", {"split": True}),
    ("YARA", "Walk at night. Rest in the day. Follow the old river, it will take you north. And Noah. Water remembers its way. Even when it's gone.", "yara", {"mode": "night", "seed": 12, "smile": True}),
    ("N", "He kissed her on the forehead, put five liters of water and a handful of dates into his backpack, and walked into the dark.", "dunes", {"time": "night", "seed": 12, "walker": True, "car": "camp"}),
)

# ------------------------------------------------------------- 06 THE NIGHT WALK
scene(
    ("N", "At night, the desert is a completely different place. The heat drains out of the sand in a few hours. The temperature falls by thirty degrees. And above you, the sky explodes.", "dunes", {"time": "night", "seed": 13, "walker": True, "milky": True}),
    ("N", "Without any city lights for hundreds of kilometers, there are so many stars that it becomes hard to find the constellations. The Milky Way is not a faint cloud. It's a river of light, bright enough to see your own shadow.", "starNav", {"phase": "sky"}),
    ("N", "Noah navigated the way Leon had taught him on the ocean. Find the Big Dipper. Follow the two stars at the end of its bowl. And there, alone, almost exactly above the north, is Polaris. The North Star.", "starNav", {"phase": "polaris"}),
    ("N", "He kept it in front of him, slightly to the left of the pale line of the old riverbed. And he walked. For hours. Up the dunes, sliding down the other side, sinking to his ankles with every step.", "dunes", {"time": "night", "seed": 14, "walker": True, "tracks": True}),
    ("N", "He wasn't alone. In the light of his torch, he saw tiny footprints crossing his path. A fennec fox, with ears almost as long as its body, watched him from the top of a dune and then vanished.", "critter", {"kind": "fennec"}),
    ("N", "And once, when he sat down to rest, something moved in the sand beside his hand. A yellow scorpion, its tail raised. Noah didn't breathe until it walked away.", "critter", {"kind": "scorpion"}),
    ("NOAH", "Night one. I think I've walked fifteen kilometers. It's so cold my hands are shaking. Two days ago I'd have given anything to feel cold.", "profile", {"time": "desertNight", "outfit": "trek", "seed": 7, "beard": 0.3}),
    ("N", "At dawn, he dug a shallow trench on the shady side of a dune, covered himself with his shirt, and tried to sleep through the heat of the day. He drank half a liter. Exactly half. No more.", "dunes", {"time": "dawn", "seed": 15, "walker": True}),
)

# ------------------------------------------------------------- 07 THE MIRAGE
scene(
    ("N", "On the second night, the riverbed became harder to follow. The dunes grew taller. And Noah's body began to fail.", "dunes", {"time": "night", "seed": 16, "walker": True}),
    ("N", "Dehydration happens in stages. First, thirst and headache. Then dizziness, and a heart that beats too fast. Then confusion. You start making mistakes. You forget why you're walking. You see things that aren't there.", "heatGauge", {"temp": 53, "blur": True}),
    ("N", "On the morning of the third day, Noah saw a lake. A wide, shining sheet of blue water, maybe two kilometers ahead, with the reflections of the dunes trembling on its surface.", "mirage", {}),
    ("N", "He knew what it was. A mirage. A layer of superheated air above the sand, bending the light of the sky down to the ground, so that the sky itself looks like water. He knew. And he walked toward it anyway.", "mirage", {"seed": 2, "walker": True}),
    ("N", "The lake moved away from him as he walked. Always two kilometers ahead. Always shining. Until finally, it simply wasn't there anymore.", "dunes", {"time": "heat", "seed": 17, "walker": True}),
    ("N", "That afternoon, lying in his trench, he heard Yara's voice calling him. Then his sister's. Then Leon's. He knew they weren't real. He answered them anyway.", "profile", {"time": "heat", "outfit": "trek", "seed": 8, "beard": 0.4}),
    ("NOAH", "Day seven. One liter left. If I don't find the well tonight... I'm sorry, Yara. I'm so sorry.", "profile", {"time": "desertNight", "outfit": "trek", "seed": 9, "beard": 0.45}),
    ("N", "That night, he walked with the last of his strength, the North Star blurring in and out of focus. And just before dawn, he saw a shape on the horizon that didn't move. A ring of stones. And beside it, the twisted silhouette of a tree.", "dunes", {"time": "dawn", "seed": 18, "walker": True, "well": True}),
)

# ------------------------------------------------------------- 08 THE WELL
scene(
    ("N", "It was the well. Exactly where the old map had said it would be. A circle of ancient stones, worn smooth by centuries of ropes. And a single acacia tree, still alive, its roots deep in the sand.", "well", {"phase": "arrive"}),
    ("N", "Noah fell to his knees, leaned over the edge, and looked down.", "well", {"phase": "look"}),
    ("N", "There was nothing. Just darkness, and far below, a floor of dry, cracked mud. He dropped a stone. He heard it hit the bottom. No splash.", "wellDown", {}),
    ("N", "The well was dry.", "black", {"text": "", "dur": 3.0}),
    ("N", "He sat with his back against the stones and drank the last of his water. Three mouthfuls. He had walked forty kilometers through the desert for this. For an empty hole in the ground.", "profile", {"time": "desert", "outfit": "trek", "seed": 10, "beard": 0.5}),
    ("NOAH", "I'm sorry, Yara. It's dry. It's dry. I don't know what to do.", "profile", {"time": "desert", "outfit": "trek", "seed": 11, "beard": 0.5}),
    ("N", "And then, as the sun rose and the light crept across the stones, he noticed the carvings.", "well", {"phase": "carvings"}),
)

# ------------------------------------------------------------- 09 THE GREEN SAHARA
scene(
    ("N", "On the flat rock beside the well, almost erased by time, someone had carved pictures. A giraffe, with its long neck. A herd of cattle. A man in a canoe. And a row of fish.", "rockArt", {}),
    ("N", "Fish. In the middle of the Sahara.", "rockArt", {"zoom": True}),
    ("N", "Yara had told him about carvings like these. They were six, seven, eight thousand years old. Made by people who had lived here when the Sahara was green. When this place was not a desert, but the bank of a river.", "greenSahara", {}),
    ("N", "And suddenly, Noah remembered what Yara had said. Water remembers its way. The river hadn't vanished. It had sunk. Deep under the sand, the old riverbed still collected what little rain fell on the desert. The acacia knew it. That was why it was still alive.", "greenSahara", {"fade": True}),
    ("N", "He looked at the riverbed, at the outside of its bend, where water would have pooled, and where the acacia's roots disappeared into the ground. He took the small shovel from his backpack. And he started to dig.", "dig", {"depth": 0}),
    ("N", "One hand's depth. Dry. An arm's length. Dry. He kept digging, in the heat, with his heart hammering and his vision going grey at the edges.", "dig", {"depth": 1}),
    ("N", "And at the depth of his shoulder, the sand changed color. Darker. Cooler. Damp.", "dig", {"depth": 2}),
    ("N", "He kept digging, then waited. And slowly, very slowly, a thin layer of brown, muddy water began to seep into the bottom of the hole.", "dig", {"depth": 3, "water": True}),
    ("NOAH", "Water. Yara, there's water. There's water!", "profile", {"time": "desert", "outfit": "trek", "seed": 12, "beard": 0.55, "smile": True}),
    ("N", "He filtered it through his shirt, into his bottle. It tasted of mud, iron and roots. It was the most beautiful thing he had ever tasted. And then he did the second thing Yara had told him. He gathered dry acacia branches, and he made a fire. A big one. With green leaves on top, to make smoke.", "signalFire", {"time": "day"}),
)

# ------------------------------------------------------------- 10 THE CARAVAN
scene(
    ("N", "The smoke rose straight up into the windless morning sky. A grey column, visible for thirty kilometers in every direction.", "dunes", {"time": "day", "seed": 19, "smoke": True}),
    ("N", "In the late afternoon, Noah heard bells. Faint. Rhythmic. And then he saw them, coming over the ridge in a long line against the golden light. Camels. Twenty, thirty of them. And men walking beside them, wrapped in indigo cloth.", "caravan", {"time": "dusk"}),
    ("N", "The leader of the caravan was a man named Idris. He was sixty-eight years old. He had crossed this desert more than a hundred times, carrying salt and dates between the oases, the way his father and his grandfather had done before him.", "idris", {"mode": "dunes"}),
    ("IDRIS", "We saw your smoke from very far. Only a fool or a lost man makes a fire at noon in the desert. You don't look like a fool.", "idris", {"mode": "dunes", "seed": 2, "smile": True}),
    ("N", "Idris gave him water from a goatskin bag, then made him drink slowly, a few sips at a time. Then he made tea. Because in the desert, before anything else, there is always tea.", "tea", {}),
    ("IDRIS", "Three glasses. The first is bitter, like life. The second is sweet, like love. The third is gentle, like death. You drink all three, or you insult your host.", "idris", {"mode": "fire", "seed": 3}),
    ("NOAH", "There's a woman. Yara. She's with our car, forty kilometers south. Her leg is broken. She's alone. Please.", "profile", {"time": "desertNight", "outfit": "trek", "seed": 13, "beard": 0.55}),
    ("N", "Idris listened. Then he asked Noah to describe the dunes he had crossed. Their shapes. Their direction. The color of the sand. Noah thought he was crazy. Until Idris smiled.", "idris", {"mode": "fire", "seed": 4}),
    ("IDRIS", "I know this place. My grandfather called it the Valley of the Old River. The car is between the two tall dunes that look like sisters. We leave now. Camels walk well at night.", "idris", {"mode": "fire", "seed": 5}),
    ("N", "Idris sent his youngest nephew riding north on the fastest camel, toward the nearest village with a telephone. And with three men and four camels, they set off south. In the dark. Without a map. Without a compass. Guided only by the stars, and by an old man's memory.", "caravan", {"time": "night", "seed": 2}),
)

# ------------------------------------------------------------- 11 THE RETURN
scene(
    ("N", "They rode all night. Noah, too weak to walk, swayed on the back of a camel, wrapped in an indigo blanket, falling asleep and waking up again under the turning stars.", "caravan", {"time": "night", "seed": 3, "noah": True}),
    ("N", "At sunrise, Idris stopped and pointed. Two tall dunes, side by side, exactly like sisters. And between them, small and white and half buried in the sand, the car.", "dunes", {"time": "dawn", "seed": 20, "car": "buried", "caravan": True}),
    ("N", "Noah slid off the camel and ran. He fell, got up, fell again. The tarp was still up. The stones of the SOS arrow were still there. But nothing was moving.", "jeep", {"phase": "camp", "time": "dawn", "noah": True}),
    ("NOAH", "Yara! Yara!", "profile", {"time": "desert", "outfit": "trek", "seed": 14, "beard": 0.6}),
    ("N", "She was lying in the shade of the tarp, her eyes closed, her lips cracked and grey. Beside her were two water bottles. One empty. And one completely full.", "yara", {"mode": "car", "worried": True, "seed": 13}),
    ("YARA", "Noah? You came back. I saved some. For you. In case you came back thirsty.", "yara", {"mode": "car", "seed": 14, "smile": True}),
    ("N", "She had been rationing her water to a few sips a day. Not to survive longer. But so that, if Noah came back with nothing, there would still be enough for him.", "yara", {"mode": "car", "seed": 15}),
    ("N", "That afternoon, two military trucks and a medical team arrived from the north, guided by Idris's nephew. Yara was flown to a hospital that night. The doctors said that one more day, maybe two, and she would not have survived.", "jeep", {"phase": "convoy", "time": "day"}),
    ("N", "Noah lost nine kilos in nine days. Yara needed two operations on her leg. And a year later, she published her research. A map of an ancient river, three hundred kilometers long, buried under the Sahara.", "yara", {"mode": "office", "seed": 16, "smile": True}),
    ("N", "She named the well where Noah found water after the man who had saved them both. Today, on scientific maps of the Sahara, there is a tiny blue dot. And beside it, a name. Bir Idris. The well of Idris.", "satMap", {"phase": "named"}),
    ("N", "Every winter, Noah gets a photograph from Yara's phone. A caravan of camels, crossing a ridge at sunset. And three glasses of tea, on a tray, in the sand.", "phone", {"screen": "email", "from": "Yara · Photo attached", "text": "Idris says hello. The third glass is waiting."}),
    ("N", "Because sometimes, the things that save us are older than we can imagine. A river that disappeared six thousand years ago. A map drawn by the stars. And a stranger who still remembers the way.", "caravan", {"time": "dusk", "seed": 4}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were stranded in the desert with a broken car... would you stay and wait for rescue? Or would you walk into the dark, following a river that disappeared thousands of years ago? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
