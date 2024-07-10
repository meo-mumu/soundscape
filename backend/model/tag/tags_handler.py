from collections import defaultdict
from dataclasses import dataclass, field
from sound import Sound
from tag import Tag

class TagsHandler:
    def __init__(self):
        self.all_tag: dict[str, Tag] = {}

    def init_all_tag(self, sounds: dict[int, Sound]):
        for sound in sounds.values():
            #sound.tags: dict[str, Tag]
            for tag in sound.tags.values():
                existing_tag = self.all_tag.get(tag.name)
                if existing_tag is None:
                    existing_tag = Tag(tag.name)
                    self.all_tag[tag.name] = existing_tag
                existing_tag.nb_occurences += 1

    def handle_add_tag(self, tag: str, sound: Sound):
        existing_tag = self.all_tag.get(tag)
        if existing_tag is None:
            existing_tag = Tag(tag)
            self.all_tag[tag] = existing_tag
        sound.add_tag(existing_tag)
        existing_tag.nb_occurences += 1

    def handle_remove_tag(self, tag: str, sound: Sound):
        existing_tag = self.all_tag.get(tag)
        if existing_tag is not None:
            sound.remove_tag(existing_tag)
            existing_tag.nb_occurences -= 1
            if existing_tag.nb_occurences == 0:
                del self.all_tag[tag]

    def calculate_barycenters(self, sounds: dict[int, Sound]):
        tag_positions = defaultdict(list)
        for sound in sounds.values():
            for tag in sound.tags.keys():
                tag_positions[tag].append((sound.x_mds, sound.y_mds))

        # Calculate barycenter for each tag
        for tag, positions in tag_positions.items():
            self.all_tag[tag].x_mds = sum(pos[0] for pos in positions) / len(positions)
            self.all_tag[tag].y_mds = sum(pos[1] for pos in positions) / len(positions)

    def to_dict(self):
        return {tag_name: tag.to_dict() for tag_name, tag in self.all_tag.items()}