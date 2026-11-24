"""AFTER ZERO — Episode 006 — WHAT IF YOU WERE LOST AT SEA?

Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · LEON (yacht skipper) · HANA (seabird researcher)
"""

TITLE = "WHAT IF YOU WERE LOST AT SEA?"
QUESTION = "Would <i>you</i> trust a bird<br />with your life?"

CHAPTERS = [
    "ADRIFT", "THE CROSSING", "THE CONTAINER", "THE RAFT", "WATER", "THE SHIP",
    "THE DEEP", "THE STORM", "THE ALBATROSS", "FOLLOWING THE BIRD", "LAND", "THE ATOLL",
]
MOOD_MAP = [3, 6, 5, 7, 2, 8, 9, 5, 9, 6, 10, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 ADRIFT (cold open)
scene(
    ("-", "", "ocean", {"time": "day", "dur": 4.0, "raft": True, "far": True}),
    ("N", "Imagine an ocean so large that you could drop every continent on Earth into it... and still have room to spare.", "ocean", {"time": "day", "seed": 2, "aerial": True}),
    ("N", "Now imagine floating in the middle of it. In a rubber raft two meters wide. With no engine, no sail, and no way to call for help.", "liferaft", {"time": "day", "seed": 1}),
    ("N", "Around you, in every direction, the horizon is perfectly flat. Perfectly empty. And the nearest land could be a thousand kilometers away.", "ocean", {"time": "dusk", "seed": 3, "raft": True}),
    ("N", "This is the story of Noah. And of the thirty-eight days he spent lost at sea.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE CROSSING
scene(
    ("N", "After the Amazon, Noah swore he would never again say yes to an adventure without thinking about it first.", "city", {"time": "day", "seed": 22}),
    ("N", "He lasted four months.", "profile", {"time": "day", "outfit": "out", "seed": 25, "smile": True}),
    ("N", "The offer came from a sixty-three-year-old Frenchman named Leon Marchand, a retired engineer who had sailed around the world twice, and needed one extra crew member to help him deliver his yacht across the Pacific Ocean.", "leon", {"mode": "dock"}),
    ("LEON", "Six thousand kilometers. Panama to the Marquesas Islands. Four weeks of ocean, stars, and terrible coffee. You'll love it.", "leon", {"mode": "dock", "smile": True, "seed": 2}),
    ("N", "The yacht was called Wren. Twelve meters long, white hull, blue sails, and a small cabin that smelled of varnish and salt.", "yacht", {"time": "day"}),
    ("N", "For the first two weeks, it was exactly what Leon had promised. Endless blue water. Dolphins racing the bow. Nights so clear that the Milky Way cast shadows on the deck.", "yacht", {"time": "dusk", "seed": 2, "dolphins": True}),
    ("LEON", "The ocean doesn't care about you, Noah. Not in a cruel way. It simply doesn't notice you. That's what makes it beautiful. And that's what makes it dangerous.", "leon", {"mode": "night", "seed": 3}),
    ("N", "Leon taught him how to steer by the stars. How to read the swell. And where everything was kept, in case of an emergency. Especially the grab bag. The orange waterproof bag beside the companionway, with everything you would need if you ever had to abandon ship.", "yachtCabin", {}),
    ("NOAH", "Has it ever happened to you? Abandoning ship?", "profile", {"time": "boatNight", "outfit": "trek"}),
    ("LEON", "Never. In forty years. And I would like to keep it that way.", "leon", {"mode": "night", "seed": 4, "smile": True}),
)

# ------------------------------------------------------------- 02 THE CONTAINER
scene(
    ("N", "On the sixteenth night, more than two thousand kilometers from the nearest land, Noah was on watch while Leon slept below.", "yacht", {"time": "night", "seed": 3}),
    ("N", "The sea was calm. The wind was steady. There was nothing out there. Nothing at all.", "ocean", {"time": "night", "seed": 4, "yachtFar": True}),
    ("N", "Every year, cargo ships lose thousands of steel shipping containers overboard in storms. Some sink. But some float for weeks or months, just below the surface. Invisible at night. As heavy as a truck.", "container", {"phase": "drift"}),
    ("-", "", "container", {"phase": "hit", "dur": 2.0}),
    ("N", "The impact threw Noah across the cockpit. Below, he heard Leon shout. And then he heard the sound every sailor fears more than any storm. Water. Rushing in.", "yachtCabin", {"flooding": True}),
    ("LEON", "The grab bag! Get the raft! Go, go, go!", "leon", {"mode": "night", "worried": True, "seed": 5}),
    ("N", "Leon threw the life raft canister over the side and pulled the cord. With a roar of compressed air, an orange shape unfolded on the black water.", "sinking", {"phase": "raft"}),
    ("N", "Wren was sinking by the bow. Fast. Noah jumped into the raft with the grab bag in his arms. Leon went back below for the satellite beacon.", "sinking", {"phase": "sink"}),
    ("N", "And then the mast came down between them, and a wave pushed the raft away from the hull. Noah heard Leon shouting his name. He saw a flashlight in the water, then a second, smaller shape. The yacht's dinghy.", "sinking", {"phase": "apart"}),
    ("NOAH", "Leon! Leon! Over here! Leon!", "raftInside", {"time": "night", "shout": True}),
    ("N", "In four minutes, the yacht was gone. In ten, Leon's flashlight was a tiny star on the horizon. In twenty, it was gone too.", "ocean", {"time": "night", "seed": 5, "raft": True, "light": True}),
    ("N", "Noah was alone. In the middle of the largest ocean on Earth.", "ocean", {"time": "night", "seed": 6, "raft": True, "aerial": True}),
)

# ------------------------------------------------------------- 03 THE RAFT
scene(
    ("N", "At dawn, he opened the grab bag and laid everything out on the floor of the raft. Every item. One by one.", "raftInside", {"time": "dawn"}),
    ("N", "Six liters of fresh water, in sealed pouches. Twelve packets of emergency ration biscuits. A fishing kit. A signal mirror. Three red parachute flares. A knife. A small hand pump. A plastic bailer. And a folded device he didn't recognize. A solar still.", "inventory", {}),
    ("N", "What wasn't there was the satellite beacon. Leon had gone back for it. Wherever Leon was now, the beacon was with him.", "profile", {"time": "raft", "outfit": "trek"}),
    ("NOAH", "Day one. I'm in the raft. Leon's somewhere out there in the dinghy. I hope he's okay. I hope he has the beacon on. I hope someone's coming for both of us.", "profile", {"time": "raft", "outfit": "trek", "seed": 2}),
    ("N", "The raft was a circle of orange rubber with an arched canopy, just big enough for him to lie down if he curled his legs. It rose and fell with every swell, endlessly, like the breathing of a giant animal.", "liferaft", {"time": "day", "seed": 2}),
    ("N", "On the first day, he was seasick. On the second, he was sunburned. On the third, the inside of the raft smelled of rubber, sweat and fear.", "raftInside", {"time": "day", "seed": 2}),
    ("N", "The nights were the worst. In the dark, the sea was louder. Every slap of a wave against the rubber sounded like something trying to get in. And sometimes, in the wind, he was sure he could hear Leon calling his name.", "ocean", {"time": "night", "seed": 14, "raft": True}),
    ("N", "He knew one thing from Leon's lessons. People lost at sea are not usually killed by the ocean. They are killed by thirst.", "ocean", {"time": "day", "seed": 7, "raft": True}),
)

# ------------------------------------------------------------- 04 WATER
scene(
    ("N", "A human being can survive for weeks without food. But without water, in the heat of the tropics, only three or four days.", "sun", {}),
    ("N", "And the cruelest thing about the ocean is that you are surrounded by water you cannot drink. Seawater is more than three times saltier than your blood. Drinking it makes you thirstier, then confused, then it kills you.", "ocean", {"time": "day", "seed": 8, "close": True}),
    ("N", "Noah rationed his six liters to half a liter a day. It was not enough. His lips cracked. His head ached constantly. He tried not to move during the hottest hours.", "profile", {"time": "raft", "outfit": "trek", "seed": 3, "dry": True}),
    ("N", "He did the math every morning, the way he used to do it in the bunker. Six liters. Half a liter a day. Twelve days. And after that, nothing.", "inventory", {"seed": 2}),
    ("N", "Then he figured out the solar still. A small inflatable cone that floated beside the raft. Seawater went into a black pad inside. The sun heated it, fresh water evaporated, condensed on the clear plastic dome, and dripped into a pouch at the bottom.", "solarStill", {}),
    ("N", "On a good day, it made almost a liter. On a cloudy day, almost nothing.", "solarStill", {"seed": 2, "drip": True}),
    ("N", "And then, on the ninth day, it rained.", "liferaft", {"time": "rain", "seed": 3}),
    ("N", "Noah stripped off his shirt and stood in the downpour with his mouth open, laughing like a madman. He caught the rain in the raft's canopy, channeled it into every container he had, and drank until his stomach hurt.", "rainCatch", {}),
    ("NOAH", "Day nine. Rain. Real rain. I filled everything. I'm rich. I'm the richest man in the Pacific Ocean.", "profile", {"time": "raft", "outfit": "trek", "seed": 4, "smile": True}),
)

# ------------------------------------------------------------- 05 THE SHIP
scene(
    ("N", "On the twelfth morning, Noah woke up to a sound he had almost forgotten. The deep, steady hum of an engine.", "raftInside", {"time": "dawn", "seed": 2}),
    ("N", "On the horizon, a container ship. Enormous. Dark red. Moving slowly from left to right, maybe two kilometers away.", "freighter", {"dist": "far"}),
    ("NOAH", "Here! Here! Over here! Please!", "liferaft", {"time": "dawn", "seed": 4, "waving": True}),
    ("N", "He fired the first flare. A ball of red fire arced into the sky, so bright he had to look away. In the morning sunlight, it looked small and pale.", "flareSea", {}),
    ("N", "He grabbed the signal mirror and flashed it toward the ship's bridge, again and again, the way Leon had shown him.", "mirror", {}),
    ("N", "The ship kept moving. It didn't slow down. It didn't change course.", "freighter", {"dist": "far", "seed": 2, "leaving": True}),
    ("N", "Modern cargo ships are run by crews of twenty people, working on a vessel the size of four football fields. At sea, often only one person is watching the horizon. And a small orange raft, low in the waves, is very easy to miss.", "freighter", {"dist": "mid", "seed": 3}),
    ("N", "In an hour, the ship was gone. Noah sat in the raft and stared at the empty horizon, and for the first time, he let himself believe that no one was coming.", "ocean", {"time": "day", "seed": 9, "raft": True, "aerial": True}),
    ("NOAH", "Day twelve. A ship passed. It didn't see me. I screamed at it for an hour after it was gone. Then I cried. And then I decided something. If nobody is coming, then I have to get myself home.", "profile", {"time": "raft", "outfit": "trek", "seed": 12, "beard": 0.3}),
)

# ------------------------------------------------------------- 06 THE DEEP
scene(
    ("N", "But the ocean, he slowly discovered, was not empty at all.", "underwater", {"time": "day"}),
    ("N", "By the second week, a small world had formed beneath the raft. Little striped fish hid in its shadow. Bigger fish followed the little ones. And then the dorados arrived. Golden-green, fast, and curious, bumping against the floor of the raft at night.", "underwater", {"time": "day", "seed": 2, "dorado": True}),
    ("N", "With the fishing kit, Noah caught one on the fifteenth day. It was the first real meal he had eaten in two weeks. He ate it raw, in thin strips, the way Leon had told him the old sailors did.", "raftInside", {"time": "day", "seed": 3, "fish": True}),
    ("N", "Flying fish crashed into the canopy at night, attracted by nothing at all. In the morning, he found them on the raft. Breakfast, delivered.", "flyingFish", {}),
    ("N", "One morning, a sea turtle surfaced beside the raft, as big as a coffee table, and looked at him with ancient, unhurried eyes. It stayed for a minute, breathing slowly. Then it sank back into the blue, as if it had simply come to check on him.", "underwater", {"time": "day", "seed": 5, "turtle": True}),
    ("N", "And then came the sharks.", "underwater", {"time": "day", "seed": 3, "sharks": True}),
    ("N", "Oceanic whitetips. Two of them, three meters long, circling slowly, patient as clocks. Sometimes one would rub its back along the bottom of the raft, and the whole floor would ripple under Noah's knees.", "underwater", {"time": "day", "seed": 4, "sharks": True, "close": True}),
    ("N", "They never attacked. A raft doesn't look like food to a shark. But Noah never put his hand in the water again.", "liferaft", {"time": "dusk", "seed": 5, "fins": True}),
    ("N", "At night, the ocean glowed. Every wave that broke against the raft lit up in sparks of blue-green fire. Tiny organisms called plankton, flashing their own light. When Noah dragged his fingers along the surface, they left trails like comets.", "biolum", {}),
    ("NOAH", "Day seventeen. The ocean is glowing. I'm watching it right now. I wish someone else could see this. I wish Leon could see this.", "profile", {"time": "biolum", "outfit": "trek", "seed": 5}),
)

# ------------------------------------------------------------- 07 THE STORM
scene(
    ("N", "On the twenty-second day, the sky turned the color of a bruise.", "ocean", {"time": "storm", "seed": 10}),
    ("N", "The swells grew taller than houses. The raft climbed each one slowly, hung at the top for a terrible second, and then slid down into the valley on the other side.", "stormSea", {"phase": "swell"}),
    ("N", "Noah zipped the canopy shut, tied himself to the inside of the raft with the safety line, and held on.", "raftInside", {"time": "storm", "shake": 0.7}),
    ("N", "In the middle of the night, a breaking wave caught the raft sideways... and flipped it upside down.", "stormSea", {"phase": "capsize"}),
    ("-", "", "black", {"dur": 2.0}),
    ("N", "He was underwater. Inside the raft. In complete darkness. Tangled in the safety line, with no idea which way was up.", "underwaterDark", {}),
    ("N", "He forced himself to stop. To feel for the line. To follow it, hand over hand, to the edge of the raft... and out. He surfaced into the screaming wind, gasping, with the overturned raft beside him.", "stormSea", {"phase": "outside"}),
    ("N", "There was a strap on the bottom, for exactly this. He climbed onto the raft, grabbed the strap, threw his weight backwards, and pulled it over. On the third try, it flipped.", "stormSea", {"phase": "righting"}),
    ("N", "When the storm passed the next afternoon, he counted what was left. The solar still was gone. Half of the rain water was gone. Two packets of biscuits. And the fishing kit.", "inventory", {"lost": True}),
    ("NOAH", "Day twenty-three. I lost almost everything. But I'm still here. I'm still here. Do you hear me, ocean? I'm still here.", "profile", {"time": "raft", "outfit": "trek", "seed": 6, "beard": 0.5}),
)

# ------------------------------------------------------------- 08 THE ALBATROSS
scene(
    ("N", "Two days later, he had a visitor.", "sky", {"time": "day"}),
    ("N", "It came out of the sky like a glider, without a single wingbeat. White body. Dark wings, each one longer than Noah was tall. An albatross.", "albatross", {"phase": "glide"}),
    ("N", "It circled the raft three times, then landed on the water beside it, folded its enormous wings, and looked at him. As if it had been expecting him.", "albatross", {"phase": "water"}),
    ("NOAH", "Hello. Hello there. Are you lost too?", "profile", {"time": "raft", "outfit": "trek", "seed": 7, "beard": 0.55, "smile": True}),
    ("N", "The bird stayed for an hour. The next day, it came back. And the next. It would sit on the edge of the raft in the morning, preening its feathers, completely unafraid.", "albatross", {"phase": "raft"}),
    ("NOAH", "I'm going to call you Leon. You're old, you're stubborn, and you showed up out of nowhere in the middle of the ocean. It suits you.", "profile", {"time": "raft", "outfit": "trek", "seed": 13, "beard": 0.55, "smile": True}),
    ("N", "On the third visit, Noah noticed something on its leg. A small metal band. A ring. With letters stamped into it.", "albatross", {"phase": "band"}),
    ("N", "He leaned closer, very slowly. The bird let him. The letters read: Tamaru Atoll Research. Return to station. And a number.", "albatrossBand", {}),
    ("N", "A research station. On an atoll. Somewhere close enough for an albatross to visit him every day.", "profile", {"time": "raft", "outfit": "trek", "seed": 8, "beard": 0.6}),
    ("N", "Albatrosses can fly thousands of kilometers. But during the nesting season, they return to the same island, to the same mate, again and again. And Noah remembered something else Leon had told him, on one of those long night watches. In the evening, seabirds fly home.", "leon", {"mode": "night", "seed": 6}),
)

# ------------------------------------------------------------- 09 FOLLOWING THE BIRD
scene(
    ("N", "That evening, Noah watched the albatross take off from the raft. It climbed into the wind, circled once... and then flew in a straight line, low over the water, toward the southwest.", "albatross", {"phase": "leave"}),
    ("N", "The next evening, it did the same. Southwest. And the next.", "ocean", {"time": "dusk", "seed": 11, "raft": True, "bird": True}),
    ("N", "A life raft has no sail. It goes wherever the wind and the current take it. But Noah had a knife, a paddle, and the raft's orange canopy.", "raftInside", {"time": "day", "seed": 4}),
    ("N", "He cut the canopy free on one side, lashed it between the two paddles, and raised it into the wind. It was the ugliest sail in the history of the Pacific. But the raft began to move. Slowly. Southwest.", "sailRaft", {}),
    ("N", "Every evening, the albatross showed him the way. Every night, he steered by the stars Leon had taught him. Every morning, he corrected his course by the sun.", "sailRaft", {"time": "dusk", "seed": 2, "bird": True}),
    ("N", "At night, he kept the Southern Cross on his left shoulder, exactly the way Leon had shown him from the cockpit of Wren. In the dark, alone, with the stars wheeling overhead, he could almost hear Leon's voice. A little more to the west, Noah. A little more.", "ocean", {"time": "night", "seed": 15, "raft": True}),
    ("NOAH", "Day thirty-one. Following a bird. If anyone ever finds this recording, I want you to know I am completely sane. I'm just following a bird.", "profile", {"time": "raft", "outfit": "trek", "seed": 9, "beard": 0.75}),
    ("N", "His body was failing. He had lost so much weight that his ribs showed. Salt sores covered his skin. He slept fourteen hours a day. But the water lasted, just barely, thanks to two more storms. And every evening, the bird came back.", "raftInside", {"time": "dusk", "seed": 5}),
)

# ------------------------------------------------------------- 10 LAND
scene(
    ("N", "On the thirty-sixth day, Noah saw something strange on the horizon. A cloud. Not like the others. It sat perfectly still, while every other cloud in the sky was moving.", "ocean", {"time": "day", "seed": 12, "cloudStack": True}),
    ("N", "Sailors have known about this for thousands of years. Clouds form above islands, even small ones, because the land heats the air differently than the sea. Long before you can see the land, you can see its cloud.", "ocean", {"time": "day", "seed": 13, "cloudStack": True, "raft": True}),
    ("N", "The next morning, the water changed color. From deep, endless blue to a bright, glowing turquoise. And Noah smelled something he hadn't smelled in five weeks. Plants. Earth. Land.", "lagoonWater", {}),
    ("N", "And then he saw it. A thin line of white sand. A few palm trees, leaning in the wind. And beyond them, a small white building with an antenna on its roof.", "atoll", {"far": True}),
    ("NOAH", "Land. Land. Oh my God. Land!", "profile", {"time": "lagoon", "outfit": "trek", "seed": 10, "beard": 0.9, "smile": True}),
    ("N", "But between the raft and the beach was a reef. A wall of coral just below the surface, with waves exploding on it in white sheets of foam.", "reef", {}),
    ("N", "There was a gap. Just one. Where the water ran smooth and dark between the breaking waves. Noah paddled with everything he had left, aimed the raft at the gap... and let the next wave carry him through.", "reef", {"through": True}),
    ("N", "The raft scraped over the coral, spun once, and slid into the calm, glassy water of the lagoon.", "lagoonWater", {"raft": True}),
)

# ------------------------------------------------------------- 11 THE ATOLL
scene(
    ("N", "The researcher who found him was named Hana. She was twenty-nine, from New Zealand, and she had spent six months on Tamaru Atoll studying albatrosses with two colleagues.", "atoll", {"beach": True}),
    ("HANA", "Oh my God. Are you okay? Can you hear me? Where did you come from?", "hana", {"mode": "beach", "worried": True}),
    ("NOAH", "Your bird. I followed your bird.", "profile", {"time": "lagoon", "outfit": "trek", "seed": 11, "beard": 0.9}),
    ("N", "At first, Hana thought he was delirious. Then he described the band on its leg. She checked her records. Albatross number four-seven-one. A male. Who had been coming back to his nest every evening, late, for the past three weeks.", "hana", {"mode": "station", "seed": 2}),
    ("HANA", "He was visiting you. Every single day. Then flying three hundred kilometers home. I thought he was just going far to fish.", "hana", {"mode": "station", "seed": 3, "smile": True}),
    ("N", "Hana and her two colleagues carried him to the station, wrapped him in a sheet, and gave him a glass of cold fresh water. He held it with both hands. It was, he said later, the best thing he had ever tasted in his life.", "hana", {"mode": "station", "seed": 4}),
    ("N", "The station had a satellite phone. The first call Noah made was to the maritime rescue center in Tahiti. The second was to his sister. The third was the hardest.", "phoneCall", {}),
    ("N", "Leon was alive. A fishing boat had found his dinghy on the fourth day, three hundred kilometers away, with the beacon still flashing. He had spent the next five weeks in a hotel in Tahiti, refusing to go home, calling the rescue center every single morning.", "leon", {"mode": "dock", "seed": 7, "worried": True}),
    ("LEON", "Noah? Noah. Thirty-eight days. They told me to stop hoping. I told them they didn't know you.", "leon", {"mode": "phone", "seed": 8}),
    ("N", "A week later, a supply ship came to Tamaru Atoll. Leon was standing on its deck. When it reached the lagoon, he didn't wait for the boat to dock. He jumped into the water, sixty-three years old, and swam.", "atoll", {"ship": True}),
    ("N", "Noah lost fifteen kilos during his thirty-eight days at sea. It took him months to recover. He still can't eat ration biscuits. And he has never been on a sailboat again.", "city", {"time": "dusk", "seed": 23}),
    ("N", "But every year, Hana sends him an email. Just one line. Four-seven-one is back.", "phone", {"screen": "email"}),
    ("N", "Because sometimes, when you are lost in the largest, emptiest place on Earth... help comes from the last place you would ever think to look.", "albatross", {"phase": "glide", "seed": 2, "sunset": True}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were lost at sea, and a bird showed up every evening, flying in the same direction... would you follow it? Or would you stay where the rescuers might be looking? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
