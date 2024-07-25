class PaneTags {

  constructor(panes_handler) {
    this.panes_handler = panes_handler;
    this.expanded = false;
    this.f_tags = this.panes_handler.panes.addFolder({ title: 'Tags', expanded: this.expanded });
    this.current_tag;
  }

  build() {
    this.f_tags.hidden = true;
    this.f_tags = this.panes_handler.panes.addFolder({ title: 'Tags', expanded: this.expanded });
    this.build_tag_filters_applied();

    let btn_show_tags = this.f_tags.addButton({ title: 'show tags center' });
    btn_show_tags.on('click', () => {
      tags_handler.show_all_tags();
    });

    let btn_hide_tags = this.f_tags.addButton({ title: 'hide tags center' });
    btn_hide_tags.on('click', () => {
      tags_handler.hide_all_tags();
    });

    let btn_reset_filters = this.f_tags.addButton({ title: 'reset tag filters' });
    btn_reset_filters.on('click', () => {
      tags_handler.reset_all_tag_filters();
      sounds_handler.update_displaying_relative_to_tag_filters();
      this.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });

    this.build_tags_list();
    if (this.current_tag) {
      this.build_tag_window()
    }

  }

  build_tag_filters_applied() {
    let filtered_tags = tags_handler.tags.filter(tag => tag.filter_sounds);
    if (filtered_tags.length > 0) {
      let f_filtered_tags = this.f_tags.addFolder({ title: 'Tags filters applied', expanded: true });
      for (let tag of filtered_tags) {
        f_filtered_tags.addBlade({
          view: 'text',
          label: '',
          parse: (v) => String(v),
          value: tag.name,
        });
      }
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
      this.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }

  build_tag_window() {
    let name_input = this.f_tags.addInput({ 'modify name': '' }, 'modify name');
    name_input.on('change', (value) => {
      this.current_tag.modifify_name(value.value);
      this.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });

    let bool_show_center = this.f_tags.addInput({ 'show center': this.current_tag.display_center }, 'show center');
    bool_show_center.on('change', (value) => {
      this.current_tag.display_center = value.value;
    });

    let bool_display_sound = this.f_tags.addInput({ 'filter sounds': this.current_tag.filter_sounds }, 'filter sounds');
    bool_display_sound.on('change', (value) => {
      this.current_tag.filter_sounds = value.value;
      sounds_handler.update_displaying_relative_to_tag_filters();
      this.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });

    let btn_remove_tag = this.f_tags.addButton({ title: '! remove this tag definitively' });
    btn_remove_tag.on('click', () => {
      tags_handler.remove_tag_to_all_sounds_from_name_and_back_update_db(this.current_tag.name);
      this.current_tag = null;
      this.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }
}



