class Tag:
    def __init__(self, name: str):
        self.name = name
        self.nb_occurences = 0
        self.x_mds = 0
        self.y_mds = 0

    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}