"""AFTER ZERO — Episode 004 — WHAT IF YOU GOT LOST IN THE AMAZON?

Same format: one beat = one shot. (speaker, text, visual, params)
speakers: N narrator · NOAH · TOMAS (river guide) · ROSA (riverside fisherwoman)
"""

TITLE = "WHAT IF YOU GOT LOST IN THE AMAZON?"
QUESTION = "Would <i>you</i> stay put,<br />or follow the water?"

CHAPTERS = [
    "THE GREEN", "THE RIVER", "ONE PHOTOGRAPH", "THE STORM", "THE FIRST NIGHT", "WATER",
    "THE CIRCLE", "ABOVE THE TREES", "THE FLOODED FOREST", "THE RAFT", "THE FEVER", "THE CANOE",
]
MOOD_MAP = [3, 6, 1, 5, 8, 2, 7, 6, 9, 6, 5, 11]

S = []


def scene(*beats):
    S.append(list(beats))


# ------------------------------------------------------------- 00 THE GREEN (cold open)
scene(
    ("-", "", "jungle", {"time": "dawn", "dur": 4.0, "fog": True}),
    ("N", "Imagine being surrounded by life. Millions of trees. Billions of insects. Rivers wider than cities.", "canopy", {"time": "day"}),
    ("N", "And still... being completely alone.", "jungle", {"time": "day", "noah": True, "dense": True}),
    ("N", "In the Amazon rainforest, you can walk for days without seeing the sky. Every direction looks the same. And the trail you walked a minute ago can disappear behind you like water closing over a stone.", "jungle", {"time": "dusk", "seed": 2, "noah": True}),
    ("N", "This is the story of Noah. And of the sixteen days he spent lost in the largest forest on Earth.", "title", {"title": TITLE, "tail": 4.5}),
)

# ------------------------------------------------------------- 01 THE RIVER
scene(
    ("N", "After the Arctic, Noah had promised himself something warmer.", "city", {"time": "day", "seed": 16}),
    ("N", "So when a botanical research team offered him a job, mapping weather sensors along a remote tributary of the Amazon, he said yes before they had finished explaining.", "riverBoat", {"time": "day"}),
    ("N", "Three days by boat from the nearest town. No roads. No phone signal. Just the river, brown and wide and slow, and the green walls of the forest on either side.", "riverBoat", {"time": "day", "seed": 2, "wide": True}),
    ("N", "Their guide was a man named Tomás. Forty-four years old, born in a riverside village, he had been guiding scientists through these forests since he was a teenager.", "tomas", {"mode": "boat"}),
    ("TOMAS", "First rule of the forest, Noah. Never leave the trail. Not for a photo. Not for a bird. Not for anything. The forest is very good at hiding people. Even from themselves.", "tomas", {"mode": "boat", "seed": 2}),
    ("NOAH", "Never leave the trail. Got it.", "profile", {"time": "river", "outfit": "trek"}),
    ("TOMAS", "Everyone says got it. Then the forest shows them something beautiful.", "tomas", {"mode": "boat", "seed": 3, "smile": True}),
    ("N", "The research camp was a cluster of tents and hammocks under blue tarps, on a patch of high ground above the river. Six scientists, two boatmen, a generator that ran for two hours every evening, and more mosquitoes than Noah had ever imagined could exist.", "camp", {"time": "dusk"}),
    ("N", "He shared a tent with Clara, a twenty-six-year-old botanist from São Paulo who had been coming to this forest since she was a student. She laughed when he asked whether the snakes were dangerous.", "camp", {"time": "dusk", "seed": 2}),
    ("N", "That night, from his hammock at the research camp, Noah listened to the forest. Frogs. Insects. Strange calls he couldn't name. It wasn't silence. It was the opposite of silence.", "campNight", {"camp": True}),
)

# ------------------------------------------------------------- 02 ONE PHOTOGRAPH
scene(
    ("N", "On the second morning, the team split into pairs to install sensors along a marked trail. Noah and a young botanist named Clara took the eastern loop.", "jungle", {"time": "day", "seed": 3, "noah": True, "trail": True}),
    ("N", "Around ten o'clock, Clara stopped to collect samples from a fallen tree. Noah wandered a few meters ahead.", "jungle", {"time": "day", "seed": 4, "trail": True}),
    ("N", "And then he heard it. A harsh, beautiful cry somewhere above him. A flash of red and blue between the leaves.", "macaw", {}),
    ("N", "A pair of scarlet macaws, landing on the branches of a giant kapok tree, just a little way off the trail. Just a little way.", "kapok", {"birds": True}),
    ("NOAH", "Just one photo. Twenty meters. I'll be right back.", "profile", {"time": "jungle", "outfit": "trek"}),
    ("N", "He took the photo. It was perfect. He took another. The macaws flew deeper into the forest, and he followed them for a few more steps. Then a few more.", "kapok", {"birds": True, "noah": True, "seed": 2}),
    ("N", "When he turned around, the trail was gone.", "jungle", {"time": "day", "seed": 5, "noah": True, "dense": True}),
    ("NOAH", "Clara? Clara! Over here!", "jungle", {"time": "day", "seed": 6, "noah": True, "dense": True}),
    ("N", "The forest swallowed his voice after a few meters. Thick leaves, hanging vines, trunks wider than cars. Every direction looked exactly like every other direction.", "jungle", {"time": "day", "seed": 7, "dense": True}),
    ("N", "He checked his GPS. It was searching for satellites, blocked by a canopy forty meters thick. Then the screen flashed a message he would remember for the rest of his life. Battery low.", "gps", {}),
)

# ------------------------------------------------------------- 03 THE STORM
scene(
    ("N", "The rain came twenty minutes later.", "jungle", {"time": "storm", "seed": 2}),
    ("N", "Not a shower. A wall of water. In the Amazon, a single storm can drop more rain in an hour than some cities see in a month.", "jungle", {"time": "storm", "seed": 3, "noah": True}),
    ("N", "The ground turned to mud. Small streams appeared from nowhere and became rivers. Thunder rolled through the trees like falling buildings.", "jungle", {"time": "storm", "seed": 4, "flood": True}),
    ("N", "Somewhere close, with a crack like a gunshot, a giant tree gave way under the weight of the water and came down through the canopy, tearing vines and branches with it. The ground shook beneath his feet. It had fallen less than thirty meters away.", "jungle", {"time": "storm", "seed": 6, "treefall": True}),
    ("N", "Noah ran, searching for the trail, for the camp, for anything familiar. That was his first mistake. Running made him more lost, not less.", "jungle", {"time": "storm", "seed": 5, "noah": True, "run": True}),
    ("N", "When the storm finally passed, the light was fading. He was soaked, scratched, and completely alone.", "jungle", {"time": "dusk", "seed": 3, "noah": True}),
    ("N", "Back at the trail, Clara had raised the alarm within the hour. Tomás led a search until it was too dark to see. They found one of Noah's footprints in the mud... and then nothing.", "tomas", {"mode": "night", "worried": True}),
    ("N", "Clara didn't sleep that night. She sat by the radio in the camp, replaying the moment over and over. She had looked down at a fallen tree for less than two minutes. When she looked up, he was gone.", "camp", {"time": "dusk", "seed": 3}),
    ("N", "Thousands of kilometers away, in a small apartment, Noah's sister received a phone call from a number she didn't recognize. A search was underway, the voice said. There was no reason to panic yet.", "phoneCall", {"seed": 2}),
)

# ------------------------------------------------------------- 04 THE FIRST NIGHT
scene(
    ("N", "Night in the rainforest comes fast. One moment there is green light. The next, there is nothing at all.", "jungle", {"time": "night", "seed": 2}),
    ("N", "Noah remembered one thing Tomás had told him on the boat. Never sleep on the ground. Ants, snakes, scorpions, flood water. The ground belongs to them.", "shelter", {"building": True}),
    ("N", "He found two trees close together and wedged branches between them. A rough platform, half a meter off the mud. He covered it with giant palm leaves, the way he'd seen in documentaries, and hoped it would hold.", "shelter", {"seed": 2}),
    ("N", "And then the forest began to talk.", "campNight", {"seed": 2}),
    ("N", "Howls. Clicks. Something heavy moving through the leaves. A scream that might have been a bird, or might not. In the darkness, every sound was a predator. Every shadow had eyes.", "campNight", {"seed": 3, "eyes": True}),
    ("NOAH", "It's just frogs. It's just frogs. It's just... very large frogs.", "profile", {"time": "jungleNight", "outfit": "trek"}),
    ("N", "Then, around midnight, the trees began to glow.", "campNight", {"seed": 4, "fireflies": True}),
    ("N", "Fireflies. Thousands of them, blinking in slow green waves between the trunks. And on the forest floor, patches of fungus that shone with a soft, ghostly light of their own.", "campNight", {"seed": 5, "fireflies": True, "fungus": True}),
    ("N", "Noah watched them until the fear wore off, and exhaustion took over. Lost in the most dangerous forest on Earth, he fell asleep smiling.", "shelter", {"seed": 3, "night": True}),
)

# ------------------------------------------------------------- 05 WATER
scene(
    ("N", "It sounds strange, in a forest where it rains every day. But one of the greatest dangers of being lost in the Amazon is thirst.", "jungle", {"time": "day", "seed": 8}),
    ("N", "River water carries parasites and bacteria. Puddles are worse. Noah had a small water bottle and no way to boil anything. So he learned to collect rain.", "waterLeaf", {}),
    ("N", "He folded large leaves into funnels and let them drip into his bottle during the afternoon storms. It took hours to fill. Every drop felt like treasure.", "waterLeaf", {"seed": 2, "drip": True}),
    ("N", "He remembered something else from a survival video he'd watched years ago. Certain thick vines hold clean water inside them. He cut one with his pocket knife... and clear water poured out, cool and slightly sweet.", "vine", {}),
    ("NOAH", "Day three. Found water in a vine. A vine! I'm going to tell everyone about this. If I... when I get back.", "profile", {"time": "jungle", "outfit": "trek", "seed": 2}),
    ("N", "Food was harder. He knew almost nothing about which fruits were safe. Many of the brightest ones were poisonous. So he followed a simple rule. Only eat what you see the monkeys eat.", "monkeys", {"time": "day"}),
    ("N", "On the fourth day, he found a tree covered in small yellow fruit, half eaten, with seeds scattered beneath it. He ate a few. They were sour, and wonderful.", "jungle", {"time": "day", "seed": 9, "fruit": True, "noah": True}),
    ("N", "He wasn't starving. But he wasn't getting any closer to home, either.", "jungle", {"time": "day", "seed": 10, "noah": True, "dense": True}),
    ("N", "Twice, he heard the distant sound of a helicopter, somewhere far above the canopy. He screamed and waved until his voice broke. But from the air, the Amazon is a carpet of green forty meters thick. A man standing beneath it is invisible.", "canopy", {"time": "day", "seed": 5}),
    ("N", "The insects were relentless. Mosquitoes at dawn and dusk. Ants that bit like fire. On the fourth morning he found three leeches on his ankle, swollen and dark, and had to burn them off with the last flame of his lighter.", "profile", {"time": "jungle", "outfit": "trek", "seed": 4}),
    ("N", "He learned to move slowly. In the heat, every unnecessary step cost water he couldn't spare. He walked in the mornings, rested through the hottest hours, and built a new shelter every afternoon before the rain.", "shelter", {"seed": 4, "building": True}),
)

# ------------------------------------------------------------- 06 THE CIRCLE
scene(
    ("N", "From the first morning, Noah had done what he thought was smart. He picked a direction and walked in a straight line, carving an arrow into a tree trunk every few hundred meters so he would know where he'd been.", "treeMark", {"day": 1}),
    ("N", "On the fifth day, around noon, he stopped to rest against a huge trunk with roots like the fins of a rocket.", "kapok", {"seed": 3, "noah": True, "rest": True}),
    ("N", "And there, at the height of his shoulder, was an arrow. Carved with a pocket knife. And underneath it, the number one.", "treeMark", {"day": 1, "found": True}),
    ("-", "", "treeMark", {"day": 1, "found": True, "dur": 3.0, "seed": 2}),
    ("N", "It was his own mark. From the first morning. He had walked for four days... in a giant circle.", "profile", {"time": "jungle", "outfit": "trek", "seed": 3}),
    ("N", "It happens to almost everyone who is lost without landmarks. In experiments, people blindfolded in open fields, or walking through dense forest, drift in circles without ever noticing. One leg is slightly stronger. The brain fills in the rest.", "circlePath", {}),
    ("NOAH", "Four days. Four days for nothing. Nothing!", "jungle", {"time": "day", "seed": 11, "noah": True, "dense": True}),
    ("N", "He sat in the mud and, for a long time, he didn't move at all.", "kapok", {"seed": 4, "noah": True, "rest": True}),
    ("NOAH", "Day five. I walked in a circle. For four days. I'm recording this so that if I ever feel smart again, I can listen to it.", "profile", {"time": "jungle", "outfit": "trek", "seed": 5}),
    ("N", "Then he remembered the second thing Tomás had told him. If you are ever lost, Noah, find water. Small water leads to big water. Big water leads to people.", "tomas", {"mode": "boat", "seed": 4}),
)

# ------------------------------------------------------------- 07 ABOVE THE TREES
scene(
    ("N", "But to find water, he first needed to know where it was. And the only way to see anything in the Amazon is from above.", "kapok", {"seed": 5, "climb": True}),
    ("N", "The kapok tree beside him was the tallest thing for kilometers. Its trunk was covered in thick vines, like ropes left there for him.", "kapok", {"seed": 6, "climb": True, "noah": True}),
    ("N", "It took him almost two hours to climb thirty meters. His arms shook. His hands bled. Twice, he nearly fell.", "kapok", {"seed": 7, "climb": True, "noah": True, "high": True}),
    ("N", "And then his head broke through the leaves, into open air and blinding sunlight.", "canopy", {"time": "day", "noah": True, "reveal": True}),
    ("N", "The forest stretched to every horizon. An ocean of green, rolling in waves of treetops. Clouds sat on it like ships.", "canopy", {"time": "day", "seed": 2, "noah": True}),
    ("N", "And there, to the south, between two hills... a thin silver line, glinting in the sun. A river.", "canopy", {"time": "day", "seed": 3, "noah": True, "river": True}),
    ("NOAH", "There you are. There you are.", "profile", {"time": "canopy", "outfit": "trek", "smile": True}),
    ("N", "He memorized the line of the hills. The position of the sun. He climbed down with a plan for the first time in five days. Walk with the sun on your left in the morning. Toward the river. Toward big water.", "jungle", {"time": "day", "seed": 12, "noah": True, "trail": True}),
)

# ------------------------------------------------------------- 08 THE FLOODED FOREST
scene(
    ("N", "It took him two more days to reach the water. And when he did, it wasn't what he expected.", "jungle", {"time": "day", "seed": 13, "noah": True}),
    ("N", "In the rainy season, Amazon rivers rise by ten meters or more, spilling into the forest for kilometers. The locals call it the igapó. The flooded forest.", "igapo", {"time": "day"}),
    ("N", "Trees stood in black, mirror-still water up to their branches. Fish swam between their trunks. Somewhere out there, the real river channel was flowing. But between Noah and that channel lay kilometers of drowned forest.", "igapo", {"time": "day", "seed": 2, "noah": True}),
    ("N", "He waded in up to his waist, then his chest. The water was warm and dark. He couldn't see his own feet.", "igapo", {"time": "day", "seed": 3, "wading": True}),
    ("N", "People imagine piranhas tearing swimmers apart in seconds. The truth is less dramatic. Most piranhas are shy, and attacks on people are rare. But Noah didn't know that. Every brush of a fish against his legs made his heart stop.", "igapo", {"time": "day", "seed": 4, "wading": True, "fish": True}),
    ("N", "That evening, from a branch above the water, he saw two red lights gliding toward him across the surface. Then two more.", "caiman", {}),
    ("N", "Caimans. Cousins of the alligator. Their eyes reflected the last light of the sunset like coals.", "caiman", {"seed": 2, "close": True}),
    ("N", "They circled the tree for a while, then drifted away into the dark. Noah spent the night wedged in the branches, too frightened to sleep, too tired to stay awake.", "igapo", {"time": "night", "seed": 5, "perch": True}),
)

# ------------------------------------------------------------- 09 THE RAFT
scene(
    ("N", "He couldn't swim across kilometers of flooded forest. But maybe he could float.", "igapo", {"time": "day", "seed": 6}),
    ("N", "Balsa trees grow in the Amazon. Their wood is so light that a log as thick as a man can be carried on one shoulder. Noah found three fallen trunks near the water's edge.", "raft", {"building": True}),
    ("N", "He tied them together with strips of vine and his own shoelaces. It took a full day. It looked terrible. It floated.", "raft", {"building": True, "seed": 2}),
    ("NOAH", "Day nine. I built a boat. A very small, very bad boat. Tomás would laugh at it. I hope I get the chance to show him.", "profile", {"time": "river", "outfit": "trek", "seed": 2}),
    ("N", "He pushed off into the flooded trees, paddling with a broken branch, following the faint current toward the south.", "raft", {"floating": True}),
    ("N", "The first night on the raft was the worst. Every splash in the dark was a caiman. Every bump against a submerged branch was something worse. He didn't close his eyes until the sky turned grey.", "igapo", {"time": "night", "seed": 7, "perch": False}),
    ("N", "On the second day of paddling, the trees opened up... and he drifted out onto the river itself. Wide. Brown. Moving. Big water.", "riverWide", {"time": "day", "raft": True}),
    ("N", "Big water leads to people. He held on to that sentence like a rope.", "riverWide", {"time": "dusk", "raft": True, "seed": 2}),
    ("N", "At night he tied the raft to overhanging branches near the bank and lay on his back, watching the sky. Without the canopy above him, the stars were everywhere. He picked out the ones his sister had taught him, a long time ago, on the roof of their parents' house.", "riverWide", {"time": "night", "raft": True, "seed": 6}),
    ("N", "Twice, afternoon storms caught him in open water. The rain was so heavy he couldn't see the banks. He lay flat on the logs, held on with both hands, and let the river carry him.", "riverWide", {"time": "storm", "raft": True, "seed": 7}),
    ("N", "In the mornings, howler monkeys roared from the riverbanks, a sound like wind through a tunnel. River dolphins, pink and grey, surfaced beside the raft, looked at him, and dove again.", "riverWide", {"time": "dawn", "raft": True, "dolphins": True}),
)

# ------------------------------------------------------------- 10 THE FEVER
scene(
    ("N", "On the eleventh day, the cut on his leg turned red and hot.", "profile", {"time": "fever", "outfit": "trek"}),
    ("N", "He had scratched it on a thorn during the storm, on the very first day. In the heat and humidity of the rainforest, even a small wound can become dangerous fast.", "fever", {"seed": 1}),
    ("N", "By the afternoon, he was shivering in thirty-degree heat. By night, the stars were moving in ways that stars do not move.", "fever", {"seed": 2, "strong": True}),
    ("NOAH", "Day twelve. Or thirteen. I'm not... I'm not sure. If anyone finds this phone... tell my sister I'm sorry I went so far away. Tell her I saw macaws.", "profile", {"time": "fever", "outfit": "trek", "seed": 2}),
    ("N", "At one point he was certain he heard his sister's voice, calling him for dinner, the way she used to when they were kids. He answered her. He told her he was coming. He told her he was almost there.", "fever", {"seed": 3}),
    ("N", "He drifted for two days, in and out of sleep, lying flat on the raft, too weak to paddle. He drank rain from his folded leaves. He talked to the river dolphins. He talked to Tomás, who wasn't there.", "riverWide", {"time": "day", "raft": True, "lying": True, "seed": 3}),
    ("N", "And far upstream, the real Tomás hadn't stopped looking.", "tomas", {"mode": "boat", "worried": True, "seed": 5}),
    ("N", "The official search had ended after a week. The helicopters had gone home. But every morning, Tomás took his small motor canoe out onto a different stretch of river, calling Noah's name, and asking every fisherman he passed if they had seen a young foreigner, alone.", "riverBoat", {"time": "dawn", "seed": 3, "searching": True}),
    ("TOMAS", "Have you seen him? Tall. Dark hair. Grey backpack. Please. Tell everyone downstream.", "tomas", {"mode": "boat", "worried": True, "seed": 6}),
)

# ------------------------------------------------------------- 11 THE CANOE
scene(
    ("N", "On the morning of the sixteenth day, a fisherwoman named Rosa was checking her nets at a bend in the river, with her grandson in the front of the canoe.", "rosaCanoe", {"time": "dawn"}),
    ("N", "The boy saw it first. A strange shape drifting in the current. Three logs, tied together. And on top of them, something that looked like a person.", "riverWide", {"time": "dawn", "raft": True, "lying": True, "seed": 4, "canoe": True}),
    ("ROSA", "Oh my God. Hold the canoe steady. He's alive. He's alive!", "rosa", {"mode": "canoe"}),
    ("N", "Rosa had heard about the lost foreigner from three different fishermen. Everyone on the river had. Tomás had made sure of that.", "rosa", {"mode": "canoe", "seed": 2}),
    ("ROSA", "My son was lost on the river once, many years ago. For three days. The whole village searched for him. When someone is lost on the river, the river belongs to everyone.", "rosa", {"mode": "canoe", "seed": 3}),
    ("N", "They pulled Noah into the canoe, wrapped him in a blanket, and paddled him to their village. A cluster of wooden houses on stilts, above the waterline.", "village", {"time": "dawn"}),
    ("N", "Her grandson, Davi, eight years old, held the stranger's hand the whole way, and told him over and over, in a language Noah didn't understand, that everything was going to be okay. Noah understood anyway.", "rosaCanoe", {"time": "dawn", "seed": 2}),
    ("N", "Rosa cleaned his wound with boiled water and a paste of crushed leaves her grandmother had taught her to make. And someone with a radio called the next town downstream.", "village", {"time": "day", "seed": 2, "inside": True}),
    ("N", "Children from the village took turns sitting by his hammock, bringing him fish soup and fresh water, and asking him questions he was too tired to answer. Was it true he had walked in a circle for four days? Did he really sleep in a tree with caimans underneath?", "village", {"time": "day", "seed": 4}),
    ("N", "That evening, a motor canoe came racing around the bend, far too fast.", "riverBoat", {"time": "dusk", "seed": 4, "racing": True}),
    ("TOMAS", "I told you. Never leave the trail.", "tomas", {"mode": "village", "smile": True}),
    ("NOAH", "The macaws were really beautiful, Tomás.", "profile", {"time": "village", "outfit": "trek", "smile": True}),
    ("TOMAS", "They always are. That's why the forest uses them.", "tomas", {"mode": "village", "smile": True, "seed": 2}),
    ("N", "Noah spent a week in hospital in Manaus, recovering from the infection and from severe dehydration. He had lost nine kilos. Doctors said that two more days on the river might have killed him.", "city", {"time": "day", "seed": 17}),
    ("N", "His sister flew in on the third day. She didn't say I told you so. Not once. She just held his hand, and didn't let go for a very long time.", "phoneCall", {}),
    ("N", "When Noah talks about the Amazon now, people expect stories about jaguars and piranhas and poisonous snakes. He tells them about vines full of water. About fireflies. About a fisherwoman and her grandson, and a guide who refused to stop looking.", "riverWide", {"time": "dusk", "seed": 5}),
    ("N", "The forest didn't try to hurt him. The forest doesn't care. That's what makes it so dangerous... and so beautiful.", "canopy", {"time": "dusk", "seed": 4}),
    ("N", "But people care. And sometimes, that is enough to bring you home.", "village", {"time": "dusk", "seed": 3}),
    ("-", "", "endCard", {"dur": 5.0}),
    ("N", "If you were lost in the Amazon, what would you do? Stay where you are and wait? Or follow the water, and trust the river? Tell us in the comments.", "endCard", {"question": True, "q": QUESTION}),
    ("N", "And remember... when everything ends, the story begins.", "endCard", {"question": True, "q": QUESTION, "tail": 4.0}),
)
