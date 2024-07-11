class PaneTags {

  constructor(panes_handler) {
    this.panes_handler = panes_handler;
    this.expanded = true;
    this.f_tags = this.panes_handler.panes.addFolder({ title: 'Tags', expanded: this.expanded });
    this.current_tag;
  }

  build() {
    this.f_tags.hidden = true;
    this.f_tags = this.panes_handler.panes.addFolder({ title: 'Tags', expanded: this.expanded });

    let btn_show_tags = this.f_tags.addButton({ title: 'show tags center' });
    btn_show_tags.on('click', () => {
      tags_handler.show_all_tags();
    });

    let btn_hide_tags = this.f_tags.addButton({ title: 'hide tags center' });
    btn_hide_tags.on('click', () => {
      tags_handler.hide_all_tags();
    });

    this.build_tags_list();
    if (this.current_tag) {
      this.build_tag_window()
    }
  }

  build_tags_list() {
    let opt = [];
    for (let tag of tags_handler.tags) {
      opt.push({ text: tag.name, value: tag.name });
    }
    // console.log('opt: ', opt);
    let tag_list = this.f_tags.addBlade({
      view: 'list',
      label: 'tags list',
      options: opt,
      value: this.current_tag ? this.current_tag.name : '',
    });
    tag_list.on('change', (value) => {
      this.current_tag = tags_handler.tags.find(tag => tag.name == value.value);
      setTimeout(() => this.panes_handler.build_panes(), 0);
    });
  }

  build_tag_window() {
    let name_input = this.f_tags.addInput({ 'name': this.current_tag.name }, 'name');
    name_input.on('change', (value) => {
      this.current_tag.modifify_name(value.value);
      setTimeout(() => this.panes_handler.build_panes(), 0);
    });

    let bool_display = this.f_tags.addInput({ 'display': this.current_tag.displayed }, 'display');
    bool_display.on('change', (value) => {
      this.current_tag.displayed = !this.current_tag.displayed;
    });
    
    let btn_remove_tag = this.f_tags.addButton({ title: '/!\\ remove this tag to all sounds' });
    btn_remove_tag.on('click', () => {
      tags_handler.remove_tag_to_all_sounds_from_name_and_back_update_db(this.current_tag.name);
      this.current_tag = null;
      setTimeout(() => this.panes_handler.build_panes(), 0);
    });
  }
}



