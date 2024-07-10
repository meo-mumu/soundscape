import random

def get_random_position(w, h):
    return { 
        'x' : random.randint(0, w),
        'y' : random.randint(0, h)
    }