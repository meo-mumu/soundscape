class PaneSoundsMulti {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
    this.f_sounds_multi;
    this.current_tag_name;
    this.adding_tags = false;
    this.removing_tags = false;
  }

  build() {
    this.f_sounds_multi = this.pane_sounds.f_sounds.addFolder({ title: sounds_handler.selected_sounds.length + ' sounds selected', expanded: true });

    if (this.adding_tags || this.removing_tags) {
      this.build_tags_input_list();
    }
    else {
      this.build_btn_add_tag();
      this.build_btn_remove_tag();
    }

  }

  build_btn_add_tag() {
    let btn_add_tag = this.f_sounds_multi.addButton({ title: 'add tags' });
    btn_add_tag.on('click', () => {
      this.adding_tags = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }

  build_btn_remove_tag() {
    let btn_remove_tag = this.f_sounds_multi.addButton({ title: 'remove tags' });
    btn_remove_tag.on('click', () => {
      this.removing_tags = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }

  build_tags_input_list() {
    let opt = this.build_opt_list_tags();
    // console.log('opt: ', opt);
    let tag_list = this.f_sounds_multi.addBlade({
      view: 'list',
      label: this.adding_tags ? '+ tag :' : '- tag :',
      options: opt,
      value: this.current_tag_name ? this.current_tag_name : '',
    });
    tag_list.on('change', (value) => {
      let tag_name = value.value;
      // if (value.value == 'new_tag') {
      //   this.adding_a_new_tag = true;
      //   this.current_tag_name = null;
      // }
      if (this.adding_tags) {
        tags_handler.add_tag_to_selected_sounds_and_back_update_db(tag_name);
        this.adding_tags = false;
      }
      if (this.removing_tags) {
        tags_handler.remove_tag_to_selected_sounds_and_back_update_db(tag_name);
        this.removing_tags = false;
      }
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }

  build_opt_list_tags() {
    let opt = [];
    if (this.adding_tags) {
      tags_handler.tags.forEach(tag => {
        opt.push({ text: tag.name, value: tag.name });
      });
    }
    else if (this.removing_tags) {
      let tags_selected = [];
      for (let sound of sounds_handler.selected_sounds) {
        for (let tag of sound.sd.tags) {
          if (!tags_selected.includes(tag)) {
            tags_selected.push(tag);
          }
        }
      }
      tags_selected.forEach(tag => {
        // opt.push({ text: '> Enter a new tag', value: 'new_tag' });
        opt.push({ text: tag, value: tag });
      });
    }
    return opt;
  }


  build_new_tag_input() {
    // console.log('Enter a new tag');
    let new_tag_input = this.f_sounds_multi.addInput({ '': '' }, '');
    new_tag_input.on('change', (value) => {
      tags_handler.add_new_tag_to_selected_sounds_and_back_update_db(value.value);
      this.adding_a_new_tag = false;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }




}