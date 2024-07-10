class Tag {
  constructor(name, nb_occurence,  x, y) {
    this.name = name
    this.pos = createVector(x, y)
    this.nb_occurence = nb_occurence
  }
}

// function build_one_tag(back_tag) {
//   try {
//     const x = back_tag.x !== undefined ? back_tag.x : Math.random() * windowWidth
//     const y = back_tag.y !== undefined ? back_tag.y : Math.random() * windowHeight
//     const t = new Tag(
//       back_tag.name,
//       back_tag.x,
//       back_tag.y
//     );
//     return t
//   } catch (error) {
//       console.error("Could not build new tag:", error);
//     }
// }