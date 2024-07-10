# Documentation Sound Graph 

Je fais une pplication pour réprésenter un système de fichiers audio sous forme de graph interractif et dynamique. L'idée est de mettre en avant une pratique esthetique à la visualisation et l'interaction avec des données.

## Model

### Sound
Un son. Un son est représenté par une particule. Les particules sont des objets physiques 2D qui réagissent à des forces (attraction, répulsion, ...). Les particules peuvent être déplacées par l'utilisateur.
Un son à des métadonnées (nom, bpm, artist, tags).

### Tags
Tags est une liste de tag (str) définit par l'utilisateur (ex : pour le son 1 : ["jazz", "bleu", "forest"]).
Les tag aussi ont des positions sur le canvas. Leurs position est le baricentre des positions des sons qui ont ce tag. 

### Paths
Un path est une liste de sons. définit par l'utilisateur. Un path a une couleur.

### MDS
Les positions des sons dans le graph sont déterminées par les tags. Pour cela on utilise une méthode de réduction de dimensionnalité (MDS). C'est le back qui s'occupe de calculer les positions des sons dans le graph. Ainsi, les sons qui ont des tags similaires sont proches dans le graph.

## Use cases

### Initialisation
Au début la bdd est vide. Il n'y a aucun sound, tags, paths
Le tweak pane n'est pas encore visible

> "Hello."
> "I am a tool that will help you to navigate thru all your sound"
> "How ?"
> "Based on the bpm, the key (the harmony), and the tags that you put on sounds"
> "you will enter tags"
> "I will analyse all the sounds in that folder [wav, mp3, flac]"
> "for an easy begining i will initilialise the tags from the name of your folders"
> "exemple : if... bla bla bla"
> "Enter a root folder :"
Input folder root
Le back renvoie la liste des filepath trouvé
> "1678 sounds were found"
> "the time estimated to analyse all that sounds is around 15min"
Front : Pour chaque fichier appel du back fonction analyse_sound(filepath, find_tags_from_folder: bool)
> "1/1678 analysing rush.mp3"
Le back renvoie un son par un son et met des positions aléatoires
Le front stock le sound dans son tableau (le son sera donc draw directement)
Le front insert ou update le son en bdd
Et les tags
...
Une fois que tout les sons sont analysed
> "all the sounds are analysed. ils sont disposer de manière totalement aléatoire"
> "Je vais les ranger en fonction de leurs tags"
Front : calcule_sound_position_from_mds()
Back : prend la bdd et calcule toutes les mds positions
Back update la mds position en bdd
Front recharge le tableau de sound en fonction de la bdd load_sounds_from_bdd()
Front ou back calcule du barycentre des tags
Front move_to_mds_position

> "all right all the sounds are in their place"
> "look this landscape of the tag"

> "Now you can have the tweakpane"
> explanantion of the general control
> explantation about tweak pane sound and tags_handler
> explanation about the path

### En mode run 
> explanation
    > sound analyse
        > how and what
        > sync
    > tags
        > initialisation
        > general controlation of tags
    > paths
        > how 
        > export path
> sync
    > front btn
    > voir init
    > front load_sounds_from_bdd
> add and remove tag:
    all front -> bdd
> all paths 
    all front -> bdd


POUR MOI LA, PETIT A PETIT
1. Je veux faire l'initialisation et le sync btn
2. cela doit etre les meme fonction. en fait l'init appel le sync
pour l'instant pas de messagé
deja avoir le workflow + la bdd sur une base de 2 sound c'est énorme

ATTENTION PENSER AU FAIT DE DEPLACER UN FICHIER !

sync 
    front appel le back (folder)
    back liste tout les nouveau filepath (vs bdd)
    back liste de tout les fichier qui ont été déplacé
    back liste de tout les fichier à supprimé
    front affiche le nombre de son à analyser et le temps estimé
    front boucle for sur la liste des nouveau fichiers >
        back analyse_audio (filepath)
        back insert into bdd
        back return ok
         
    front recalcul des tags + bdd
    front / back recalcule des mds sounds + bdd
    front / recalcule des barycentres + bdd
    front load_all_from_bdd

en fait a chaque fois qu'on ouvre le logiciel on fait le sync

La sync est une grosse opération. Pendant cette opération le front est toujours disponible.






## Structure technique

#### Backend Python (Flask):

Constituer d'un Backend en python (Flask) pour récupérer les fichier audio, les analyser (bpm, artiste, clé, tag, ...), les stocker dans une base de donnée, et faire l'interaction avec le Frontend.

#### Frontend Javascript (Electron):

Le Frontend tourne avec Electron qui utilise p5.js et matter.js pour la partie graphique et physique.
```
├── frontend
│   ├── model
│   │   ├── sound.js
│   │   ├── soundMetaData.js
│   │   ├── graphParameter.js
│   │   ├── player.js
│   ├── renderer.js
│   ├── main.js
│   ├── index.html
```

