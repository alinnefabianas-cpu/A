"""AFTER ZERO — Episode 002 — 100 DAYS TRAPPED INSIDE AN UNDERGROUND BUNKER

Same format as episode 001: one beat = one shot.
(speaker, text, visual, params)
speakers: N narrator · NOAH · WALTER (1962 journal, read in his voice) · RESCUER · SIS (phone)
"""

TITLE = "100 DAYS TRAPPED INSIDE AN UNDERGROUND BUNKER"
QUESTION = "Could <i>you</i> survive<br />100 days underground?"

CHAPTERS = [
    "DAY ONE", "THE SURVEY", "THE COLLAPSE", "INVENTORY", "THE FIRST WEEK", "WITHOUT THE SUN",
    "WALTER'S JOURNAL", "THE BREAKING POINT", "LEVEL TWO", "THE TUNNEL", "DAY NINETY-NINE", "DAY ONE HUNDRED",
]
# music mood per chapter (keys of MOODS in tools/audio_full.py)
MOOD_MAP = [3, 1, 5, 7, 2, 3, 9, 8, 7, 6, 5, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 DAY ONE (cold open)
scene(
    ("-", "", "black", {"dur": 2.0}),
    ("-", "", "watch", {"text": "DAY 1", "sub": "--:--", "dur": 3.0}),
    ("N", "Imagine being buried alive. Not for an hour. Not for a day.", "corridor", {"light": "flash", "noah": True}),
    ("N", "For one hundred days.", "tallyWall", {"n": 100, "reveal": True}),
    ("N", "No sunlight. No sky. No way of knowing whether it's morning or midnight.", "profile", {"time": "flash", "outfit": "out"}),
    ("N", "Just concrete walls... a limited supply of food, water and air... and the silence of the earth above you.", "storage", {"level": 0.9}),
    ("N", "Could you stay sane? Could you stay alive?", "bunk", {"light": "lamp"}),
    ("N", "This is the story of Noah. And of the hundred days he spent inside an underground bunker... that nobody knew existed.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE SURVEY
scene(
    ("N", "It began as an ordinary job.", "city", {"time": "day", "seed": 11}),
    ("N", "Noah worked for a small engineering firm that inspected old buildings before they were demolished. Bridges. Factories. Tunnels nobody had used in decades.", "profile", {"time": "day", "outfit": "out", "seed": 2}),
    ("N", "That Monday, his assignment was a strange one. A forgotten civil defense bunker, built in the early nineteen sixties, hidden in the hills forty miles outside the city.", "blueprint", {}),
    ("N", "The land had been sold. A highway was coming. Someone needed to go down there, check the structure, and sign a report saying it was safe to fill with concrete.", "bunkerEntrance", {"time": "day"}),
    ("N", "His colleague was supposed to come with him. But she called in sick that morning, and the deadline was Friday.", "bunkerEntrance", {"time": "day", "seed": 2, "noah": True}),
    ("NOAH", "It's just a hole in a hill. In and out. Two hours, tops.", "profile", {"time": "day", "outfit": "out", "seed": 3}),
    ("N", "He didn't tell anyone exactly where he was going. It didn't seem important.", "bunkerEntrance", {"time": "day", "seed": 3, "noah": True, "door": True}),
    ("N", "Behind the rusted steel door, a staircase dropped into the dark. Ninety-two steps, straight down into the mountain.", "bunkerStairs", {}),
    ("N", "At the bottom, a long concrete corridor. Caged lights on the ceiling. Pipes along the walls. Painted arrows pointing to rooms with names like Decontamination, Supply, and Command.", "corridor", {"light": "flash", "noah": True, "seed": 2}),
    ("N", "The air was cold and still. It smelled of dust, and metal, and time.", "corridor", {"light": "flash", "seed": 3}),
    ("NOAH", "Okay. Main corridor, section A. Some water damage on the ceiling. Structure looks... surprisingly solid.", "profile", {"time": "flash", "outfit": "out", "talkie": True}),
    ("N", "He had been underground for exactly forty minutes... when the floor began to move.", "corridor", {"light": "flash", "noah": True, "seed": 4, "rumble": True}),
)

# ------------------------------------------------------------- 02 THE COLLAPSE
scene(
    ("N", "At first, it was only a vibration. A low hum, deep in the rock. Then the lights in the ceiling began to swing.", "corridor", {"light": "flash", "quake": 0.4}),
    ("N", "And then the whole mountain roared.", "corridor", {"light": "flash", "quake": 1.0, "impact": 0.1}),
    ("N", "Dust poured from the cracks above him. Somewhere behind him, near the staircase, came a sound like thunder trapped inside a box.", "rubble", {"falling": True}),
    ("NOAH", "No, no, no, no!", "corridor", {"light": "flash", "quake": 0.8, "noah": True}),
    ("N", "Noah ran back toward the stairs, coughing, his flashlight cutting through a cloud of grey powder.", "rubble", {"dust": True}),
    ("N", "When the dust finally settled... the staircase was gone. In its place, a wall of broken concrete and rock, from floor to ceiling.", "rubble", {}),
    ("-", "", "rubble", {"dur": 3.0}),
    ("N", "He pulled at the rocks until his fingers bled. They didn't move.", "rubble", {"noah": True}),
    ("NOAH", "Help! Can anyone hear me? Help! I'm down here!", "rubble", {"noah": True, "seed": 2}),
    ("N", "His voice died against the stone. He checked his phone. No signal. Of course there was no signal. He was thirty meters inside a mountain.", "profile", {"time": "flash", "outfit": "out", "seed": 2}),
    ("N", "It was later reported as a magnitude six earthquake. It damaged hundreds of buildings across the region. Thankfully, almost nobody was hurt.", "city", {"time": "dusk", "seed": 12}),
    ("N", "Almost nobody.", "city", {"time": "dusk", "seed": 12}),
    ("N", "In all the chaos, no one noticed that a young engineer hadn't come back from a site visit in the hills.", "bunkerEntrance", {"time": "dusk", "collapsed": True}),
)

# ------------------------------------------------------------- 03 INVENTORY
scene(
    ("N", "For the first few hours, Noah sat with his back against the rubble and did nothing at all. He just breathed. In. And out.", "profile", {"time": "flash", "outfit": "out", "seed": 3}),
    ("N", "Then the engineer in him took over. Panic wouldn't move rocks. A plan might.", "corridor", {"light": "flash", "noah": True, "seed": 5}),
    ("NOAH", "Okay. Rule one: don't waste the flashlight. Rule two: find out what this place has. Rule three... don't panic.", "profile", {"time": "flash", "outfit": "out", "seed": 4}),
    ("N", "At the end of the corridor, behind a heavy door, he found the generator room. An old diesel engine, the size of a car, still sitting on its mounts.", "generator", {"state": "off"}),
    ("N", "He checked the oil. He checked the fuel. He pulled the starter cord once. Twice. Seven times.", "generator", {"state": "off", "noah": True}),
    ("N", "On the eighth pull, the engine coughed... and came to life.", "generator", {"state": "running", "noah": True}),
    ("-", "", "corridor", {"light": "on", "dur": 3.0, "lightsOn": True}),
    ("N", "For the first time, the bunker was lit. And it was bigger than he'd imagined.", "corridor", {"light": "on", "seed": 6}),
    ("N", "There was a storage room, lined with shelves of canned food, water drums, and medical supplies, all stamped with the year nineteen sixty-two.", "storage", {"level": 1.0}),
    ("N", "There was a water tank, half full. A hand-cranked air filtration machine. Six bunk beds. And in the command room, an old military radio, covered in dust.", "waterTank", {"level": 0.55}),
    ("N", "The bunker had been built to keep twelve people alive for two weeks after a nuclear war. Now it had to keep one person alive for as long as it took.", "airFilter", {"noah": True}),
    ("N", "He did the math on the back of his inspection report. The fuel would last maybe sixty days, if he ran the generator only a few hours a day.", "desk", {"book": "report"}),
    ("N", "The water, maybe ninety, if he was careful. The food, longer. Most of it, anyway.", "storage", {"level": 1.0, "seed": 2}),
    ("NOAH", "Sixty days. Okay. Someone will come long before that. Someone has to.", "profile", {"time": "bunker", "outfit": "out"}),
)

# ------------------------------------------------------------- 04 THE FIRST WEEK
scene(
    ("N", "On the first day, he was certain he would be rescued by nightfall.", "tallyWall", {"n": 1}),
    ("N", "On the second day, he was certain they would come tomorrow.", "tallyWall", {"n": 2}),
    ("N", "He spent hours in the command room, turning the dial of the old radio, listening for anything human.", "radioClose", {"state": "search"}),
    ("N", "There was only static.", "radioClose", {"state": "search", "seed": 2}),
    ("N", "He found a ventilation shaft that rose through the rock toward the surface, and he shouted up into it until his voice gave out.", "ventShaft", {}),
    ("NOAH", "Hello? Is anyone up there? My name is Noah! I'm trapped in the bunker! Please!", "ventShaft", {"noah": True}),
    ("N", "Far above, he could see a tiny circle of grey light. Thirty meters of rock. And a steel grate, rusted shut.", "ventShaft", {"seed": 2}),
    ("N", "He told himself that his company would notice. That his sister would call. That someone would find his car parked by the road.", "bunk", {"light": "lamp", "noah": True}),
    ("N", "What he didn't know was that a landslide, triggered by the earthquake, had buried the entrance road... and his car with it.", "bunkerEntrance", {"time": "day", "collapsed": True, "seed": 4}),
    ("N", "Up on the surface, the police had opened a missing person case. But nobody knew where to look.", "city", {"time": "rain", "seed": 13}),
    ("N", "On the fifth day, Noah heard it. A deep, rhythmic thudding, somewhere above him. Boom. Boom. Boom. Like machinery. Like someone digging.", "ventShaft", {"seed": 3, "noah": True}),
    ("NOAH", "They're here! They found me! I'm here! I'm down here!", "rubble", {"noah": True, "seed": 3}),
    ("N", "He banged a wrench against the pipes for an hour. Then two. The thudding stopped. It never came back. Much later, he would learn it had been a road crew, clearing the landslide on a highway three kilometers away.", "corridor", {"light": "flash", "noah": True, "seed": 8}),
    ("N", "By the end of the first week, Noah had stopped expecting rescue every hour. Now he simply hoped for it. Quietly. Like a prayer.", "tallyWall", {"n": 7}),
)

# ------------------------------------------------------------- 05 WITHOUT THE SUN
scene(
    ("N", "The hardest thing to ration wasn't food, or water. It was light.", "corridor", {"light": "dark", "flashOn": True}),
    ("N", "To save fuel, Noah ran the generator for only four hours a day. The other twenty, he lived in near-total darkness, with a single flashlight and a box of batteries.", "generator", {"state": "running", "noah": True, "seed": 2}),
    ("N", "And without the sun, something strange began to happen to time.", "watch", {"text": "DAY 12", "sub": "AM? PM?"}),
    ("N", "His body forgot when to sleep. Sometimes he slept for fourteen hours. Sometimes he lay awake for what felt like days.", "bunk", {"light": "dark", "noah": True}),
    ("N", "Scientists call it circadian drift. In experiments where people live underground without clocks, their sense of a day slowly stretches. Twenty-five hours. Thirty. Sometimes even more.", "watch", {"text": "DAY 15", "sub": "??:??", "drift": True}),
    ("N", "Noah's watch told him the date. But his body no longer believed it.", "profile", {"time": "dark", "outfit": "out", "beard": 0.3}),
    ("NOAH", "Day sixteen. Or seventeen. I keep losing count. I scratch a line on the wall every time the watch says midnight. It's the only thing that still feels real.", "desk", {"book": "noah", "noah": True}),
    ("N", "He began talking to the bunker. He named the generator Bertha. He apologized to the air filter when he cranked it too hard.", "airFilter", {"noah": True, "seed": 2}),
    ("N", "And every so often, in the silence, he heard things. A tapping in the pipes. Footsteps in the corridor. A voice calling his name.", "corridor", {"light": "dark", "flashOn": True, "seed": 2}),
    ("N", "There was never anyone there. In total isolation, the human brain begins to fill the silence on its own.", "profile", {"time": "dark", "outfit": "out", "beard": 0.35, "seed": 2}),
    ("N", "He knew that. It didn't make the footsteps any less frightening.", "corridor", {"light": "dark", "flashOn": True, "seed": 3}),
)

# ------------------------------------------------------------- 06 WALTER'S JOURNAL
scene(
    ("N", "On the twenty-third day, while searching the command room for spare fuses, Noah found a metal box bolted under the desk.", "desk", {"book": "box"}),
    ("N", "Inside was a logbook. Its cover read: Station Officer, Walter Hale. Nineteen sixty-two.", "journal", {"page": "cover"}),
    ("N", "Noah opened it under the flashlight, and began to read.", "journal", {"page": "p1"}),
    ("WALTER", "Day one. The drill began at oh six hundred. They sealed the doors behind me. One hundred days alone, to prove that a man can survive down here if the worst ever happens. I volunteered. My wife thinks I'm crazy.", "journal", {"page": "p1", "seed": 2}),
    ("N", "Walter had been a civil defense officer. The bunker had been tested with a single volunteer, for one hundred days, sealed from the outside world.", "blueprint", {"seed": 2}),
    ("N", "Noah read the journal slowly. One entry a day. Never more. It became the best part of every day.", "desk", {"book": "walter", "noah": True}),
    ("WALTER", "Day nineteen. Lost track of whether it is day or night. Slept badly. Heard footsteps in the corridor again. There was no one. There is never anyone.", "journal", {"page": "p2"}),
    ("NOAH", "Me too, Walter. Me too.", "profile", {"time": "bunker", "outfit": "out", "beard": 0.45}),
    ("WALTER", "Day thirty-one. Talked to the generator today. I have named her Bertha. If anyone ever reads this, I am not ashamed.", "journal", {"page": "p3"}),
    ("N", "Noah laughed for the first time in a month. A real laugh, loud, echoing down the corridor.", "profile", {"time": "bunker", "outfit": "out", "beard": 0.45, "smile": True}),
    ("WALTER", "Day forty. Margaret would laugh at me. I have started to make the bed every morning, though no one will see it. A man needs a reason to stand up straight, even under a mountain.", "journal", {"page": "p3", "seed": 2}),
    ("N", "So Noah began making his bed too. Every morning, whatever morning meant.", "bunk", {"light": "lamp", "seed": 3}),
    ("N", "Sixty years apart, two men had sat in the same chair, under the same mountain, fighting the same silence.", "desk", {"book": "walter", "noah": True, "seed": 2}),
    ("N", "And somehow, Noah didn't feel completely alone anymore.", "bunk", {"light": "lamp", "noah": True, "seed": 2}),
)

# ------------------------------------------------------------- 07 THE BREAKING POINT
scene(
    ("N", "On day forty-four, Bertha stopped.", "generator", {"state": "failing"}),
    ("-", "", "black", {"dur": 2.4}),
    ("N", "The lights died. The air machine went quiet. And the darkness was total.", "corridor", {"light": "dark", "flashOn": True, "seed": 4}),
    ("N", "Noah found the problem by flashlight. A cracked fuel line, leaking diesel onto the floor. Every hour it stayed broken, he was losing fuel he would never get back.", "generator", {"state": "off", "noah": True, "leak": True}),
    ("N", "He had no spare parts. No proper tools. Only a toolbox from nineteen sixty-two... and the instructions in his own head.", "desk", {"book": "report", "seed": 2}),
    ("N", "It took him nine hours. He patched the line with a piece of rubber hose, wire from a bunk bed, and a strip of his own jacket lining.", "generator", {"state": "off", "noah": True, "seed": 3}),
    ("N", "Then he pulled the cord.", "generator", {"state": "off", "noah": True, "seed": 4}),
    ("N", "Nothing.", "profile", {"time": "flash", "outfit": "out", "beard": 0.55}),
    ("N", "He pulled again. And again. Until his arm shook and his hands were raw.", "generator", {"state": "off", "noah": True, "seed": 5}),
    ("NOAH", "Come on, Bertha. Please. Please, I can't do this in the dark. I can't.", "profile", {"time": "flash", "outfit": "out", "beard": 0.55, "seed": 2}),
    ("N", "He sat down on the cold floor and, for the first time since the collapse, Noah cried.", "bunk", {"light": "dark", "noah": True, "seed": 2}),
    ("N", "Not for the darkness. For his sister. For the phone call he'd missed the week before. For every ordinary morning he had never noticed.", "profile", {"time": "dark", "outfit": "out", "beard": 0.55, "seed": 3}),
    ("N", "When the tears stopped, he picked up the flashlight, checked the patch one more time... and found a loose clamp.", "generator", {"state": "off", "noah": True, "seed": 6}),
    ("N", "One more pull.", "generator", {"state": "running", "noah": True, "seed": 7}),
    ("-", "", "corridor", {"light": "on", "dur": 2.6, "lightsOn": True, "seed": 7}),
    ("N", "Bertha roared back to life. And Noah laughed and cried at the same time, alone, under the mountain.", "profile", {"time": "bunker", "outfit": "out", "beard": 0.55, "smile": True, "seed": 4}),
    ("N", "But the leak had cost him almost two weeks of fuel. The math had changed. He couldn't wait to be rescued anymore. He had to find another way out.", "waterTank", {"level": 0.3}),
)

# ------------------------------------------------------------- 08 LEVEL TWO
scene(
    ("N", "At the end of the lowest corridor was a door Noah had avoided since the first day. A blast door, painted yellow and black.", "blastDoor", {}),
    ("N", "Level Two. Authorized personnel only.", "blastDoor", {"seed": 2}),
    ("N", "Walter's journal had mentioned it only once.", "journal", {"page": "p4"}),
    ("WALTER", "Day sixty. Opened the lower level today, as instructed, to inspect the emergency tunnel. Partially collapsed. The engineers said it would not be needed. Let us hope they are right.", "journal", {"page": "p4", "seed": 2}),
    ("N", "An emergency tunnel. Noah read the line three times.", "profile", {"time": "bunker", "outfit": "out", "beard": 0.6}),
    ("N", "The wheel on the blast door hadn't turned in sixty years. It took him two days, a crowbar, and most of a can of oil.", "blastDoor", {"noah": True, "turning": True}),
    ("N", "When it finally opened, a breath of cold air rolled out of the dark.", "blastDoor", {"open": True}),
    ("N", "Behind it, he found a small room, a ladder going down, and a framed blueprint on the wall. The full plan of the bunker.", "blueprint", {"route": True}),
    ("N", "And at the bottom of the plan, a narrow passage, marked in red, leading away from the bunker and up toward the surface. Emergency exit. Length: one hundred and forty meters.", "blueprint", {"route": True, "seed": 2}),
    ("N", "Noah climbed down the ladder and shined his light into the tunnel.", "tunnel", {"progress": 0, "noah": False}),
    ("N", "The first stretch was intact. Then, about thirty meters in, it ended in a wall of dirt and stone. The collapse Walter had written about. Or maybe a new one.", "tunnel", {"progress": 0, "blocked": True}),
    ("NOAH", "One hundred and forty meters. Okay. One meter at a time.", "profile", {"time": "flash", "outfit": "out", "beard": 0.6, "seed": 5}),
)

# ------------------------------------------------------------- 09 THE TUNNEL
scene(
    ("N", "In the supply room, he found two shovels, a pickaxe, and a wheelbarrow with one flat tire. Equipment meant for emergencies.", "storage", {"level": 0.5, "tools": True}),
    ("N", "This was an emergency.", "storage", {"level": 0.5, "tools": True, "seed": 2}),
    ("N", "Noah began to dig.", "tunnel", {"progress": 0.05, "noah": True}),
    ("N", "He dug during the four hours of generator light, and rested during the dark. He moved the dirt into the empty rooms, one wheelbarrow at a time.", "tunnel", {"progress": 0.15, "noah": True, "seed": 2}),
    ("N", "He propped the ceiling with planks from the old bunk beds, the way he'd seen in drawings of mine shafts. Every meter, he checked the roof. Every meter, he listened to the rock.", "tunnel", {"progress": 0.25, "noah": True, "seed": 3}),
    ("N", "Some days he moved two meters. Some days, only a few centimeters, when he hit stone and had to chip it away by hand.", "tallyWall", {"n": 71}),
    ("NOAH", "Day seventy-four. Forty meters done. My hands don't open all the way anymore. Walter, if you're listening... I think I finally understand why you kept writing.", "desk", {"book": "noah", "noah": True, "seed": 3}),
    ("N", "His body changed. He grew thinner, and stronger. His beard grew in. His skin turned pale from the lack of sunlight.", "profile", {"time": "flash", "outfit": "out", "beard": 0.85, "seed": 6}),
    ("N", "He took vitamin tablets from the medical kit, rationed his water to two liters a day, and counted every can of food twice.", "waterTank", {"level": 0.15, "seed": 2}),
    ("N", "On day eighty-one, part of the tunnel ceiling came down behind him. For a terrible minute, he was trapped inside a trap.", "tunnel", {"progress": 0.55, "noah": True, "cavein": True}),
    ("N", "He dug himself out with his bare hands. Then he went back... and propped the ceiling twice as carefully.", "tunnel", {"progress": 0.55, "noah": True, "seed": 4}),
    ("N", "Ninety meters. One hundred. One hundred and ten.", "tunnel", {"progress": 0.8, "noah": True, "seed": 5}),
    ("NOAH", "Day ninety. You know what I miss most, Walter? Not food. Not my bed. Rain. The sound of rain on a window. I used to hate rainy days. I'd give anything for one now.", "desk", {"book": "noah", "noah": True, "seed": 5}),
    ("N", "And then, on day ninety-six, the fuel ran out. Bertha coughed one last time, and fell silent for good.", "generator", {"state": "failing", "seed": 8}),
    ("N", "From now on, he would dig by flashlight. With the last of the batteries.", "tunnel", {"progress": 0.85, "noah": True, "dark": True}),
)

# ------------------------------------------------------------- 10 DAY NINETY-NINE
scene(
    ("N", "On day ninety-nine, Noah opened Walter's journal to the last written page.", "journal", {"page": "p5"}),
    ("WALTER", "Day ninety-nine. Tomorrow they open the doors. I have been afraid of many things down here. The dark. The silence. My own mind. But tonight I am afraid of something new.", "journal", {"page": "p5", "seed": 2}),
    ("WALTER", "I am afraid that the world up there has gone on without me. That I will climb the stairs and find that nothing waited. But I will go up anyway. Tomorrow, I go up.", "journal", {"page": "p5", "seed": 3}),
    ("N", "Noah closed the book and sat in the dark for a long time.", "profile", {"time": "dark", "outfit": "out", "beard": 0.9}),
    ("N", "He had read the journal one page a day, for seventy-six days. He had never once skipped ahead. And now, there were no more pages.", "desk", {"book": "walter", "noah": True, "seed": 4}),
    ("N", "Only one thing remained. On the inside of the back cover, scratched faintly in pencil, was a final line he hadn't noticed before.", "journal", {"page": "back"}),
    ("N", "Day one hundred. The sky is still there.", "journal", {"page": "back", "seed": 2}),
    ("N", "That night, his flashlight began to fade. He was one hundred and thirty-two meters in. Eight meters from the end of the plan. Maybe less.", "tunnel", {"progress": 0.94, "noah": True, "dark": True, "seed": 2}),
    ("NOAH", "Just eight more meters, Walter. Just eight.", "profile", {"time": "dark", "outfit": "out", "beard": 0.9, "seed": 2}),
)

# ------------------------------------------------------------- 11 DAY ONE HUNDRED
scene(
    ("N", "On the morning of day one hundred, Noah dug in total darkness.", "black", {"dur": 0}),
    ("N", "By feel. By sound. By memory.", "tunnel", {"progress": 0.97, "noah": True, "dark": True, "seed": 3}),
    ("N", "The tunnel had been climbing for the last twenty meters. The dirt above him was softer now. Damp. It smelled different. It smelled of roots.", "tunnel", {"progress": 0.98, "noah": True, "dark": True, "seed": 4}),
    ("N", "He pushed the shovel up into the ceiling one more time... and it broke through into nothing.", "breakthrough", {"phase": "crack"}),
    ("N", "A thin line of light fell into the tunnel.", "breakthrough", {"phase": "beam"}),
    ("N", "Real light. Gold and warm and moving, the way only sunlight moves.", "breakthrough", {"phase": "beam", "seed": 2}),
    ("-", "", "breakthrough", {"phase": "open", "dur": 3.5}),
    ("N", "Noah clawed at the earth with both hands until the hole was wide enough... and he pulled himself up, out of the ground, into the world.", "surfaceDawn", {"emerge": True}),
    ("N", "He was in a forest, on the far side of the mountain. It was early morning. Birds were singing. Mist was rising between the trees.", "surfaceDawn", {"seed": 2}),
    ("N", "He lay on his back in the wet grass and stared upward, and for a long time, he couldn't speak.", "surfaceDawn", {"lying": True}),
    ("NOAH", "The sky is still there, Walter. It's still there.", "profile", {"time": "surface", "outfit": "out", "beard": 1.0, "smile": True}),
    ("N", "Two hours later, a forestry worker found a thin, bearded man sitting by an old logging road, wrapped in a torn green jacket, smiling at the sun.", "rescue", {}),
    ("RESCUER", "Hey! Hey, are you okay? Where did you come from?", "rescue", {"seed": 2}),
    ("NOAH", "From under the mountain. It's a long story.", "rescue", {"seed": 3}),
    ("N", "That afternoon, in a hospital bed, he made the phone call he'd been rehearsing for a hundred days.", "phoneCall", {}),
    ("SIS", "Noah? Oh my God. Noah, is that you?", "phoneCall", {"seed": 2}),
    ("NOAH", "Hey, sis. Sorry I missed your call.", "profile", {"time": "day", "outfit": "out", "beard": 1.0, "smile": True, "seed": 2}),
    ("N", "Doctors later said he had lost eleven kilos and was severely deficient in vitamin D. But otherwise, he was in remarkable condition, for a man who had spent one hundred days underground.", "city", {"time": "day", "seed": 14}),
    ("N", "When reporters asked how he had survived, he gave them the same answer every time. He had rules. He had a plan. And he had company.", "profile", {"time": "day", "outfit": "out", "beard": 1.0, "seed": 3}),
    ("N", "The bunker was filled with concrete a few months later. But before it was sealed, Noah went back one last time... and left Walter's journal on the desk, open to the last page. With one new line, in his own handwriting, underneath.", "journal", {"page": "final"}),
    ("N", "Day one hundred. It still is.", "journal", {"page": "final", "seed": 2}),
    ("N", "Because sometimes, the only way out... is through. One meter at a time.", "surfaceDawn", {"seed": 3}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "Could you survive one hundred days underground? What would break you first: the darkness, the silence, or the waiting? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
