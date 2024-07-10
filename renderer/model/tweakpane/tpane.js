
class TPane {
  constructor() {
    this.pane = new Tweakpane.Pane();
    this.pane_graph_parameters = new PaneGraphParameters(this.pane);

    this.tab = this.pane.addTab({
      pages: [
        { title: 'Sound card' },
        { title: 'Paths' },
      ],
    });

    this.pane_sound_card = new PaneSoundCard(this.pane, this.tab);
    this.pane_path = new PanePath(this.pane, this.tab);


  }
}





