import hashlib

def find_hash(filepath:str) -> str:
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        # Lire et mettre à jour le hash en blocs de 4K
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()