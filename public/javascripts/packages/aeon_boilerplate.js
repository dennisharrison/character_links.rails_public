String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

(function($) {
    $.fn.flatten = function() {
        return $(this).clone().wrap('<div></div>').parent().html();
    }
})(jQuery);

function makeActionWrapper(options){
    //Set the default values, use comma to separate the settings, example:
    var defaults = {
        actions: ['show', 'edit', 'destroy', 'duplicate'],
        model: 'myModel',
        item_id: 42,
        container: 'myContainer'
    };

    var options =  $.extend(defaults, options);

    var action_html = $("<div class='actions_wrapper'></div>");

    // Iterate over the actions, build up the DIVs, and insert into the DOM.
    _.each(options.actions,function(action){
        var container = $('<div></div>');
        container.addClass('button model_action');
        container.addClass(options.model + "_action");
        container.attr('action',action);
        container.attr('model',options.model);
        container.attr('item_id',options.item_id);
        container.attr('container',options.container);
        container.html(action.capitalize());
        action_html.append(container);
    });

    return action_html.flatten();

};


function ajax_get_modal(options) {
    var defaults = {
        button_id:  'Button',
        url:        '/',
        modal_id:   'Modal',
        title:      'Aeon',
        layer:      $('.aeon_dialog').length + 1,
        width:      600,
        height:     'auto',
        dialogClass: 'aeon_dialog',
        position:   'top',
        resizable:  false,
        draggable:  false,
        autoOpen:   false,
        modal:      true,
        stack:      false,
        open:       false,
        close:      false,
    };

    var options = $.extend({}, defaults, options);

    var layer_1_open = '';
    var open_function = '';

    if(options.open != false){
        var open_function = options.open;
    };

    if(options.close != false){
        var close_function = options.close;
    };

    var modal_selector = '#' + options.modal_id


    var close_button_wrapper = $('<div></div>');
    close_button_wrapper.addClass('modal_close_button_wrapper');

    var close_button = $('<div></div>');
    close_button.attr('id', options.modal_id + 'ModalCloseButton');
    close_button.addClass('button tertiary_modal_button close_modal_button');
    close_button.html('Close');

    close_button_wrapper.html(close_button);

    $.ajax({
        dataType: "html",
        cache: false,
        url: options.url,
        timeout: 20000,
        error: function(XMLHttpRequest, errorTextStatus, error){
            alert("Failed to submit : "+ errorTextStatus+" ;"+error);
        },
        success: function(data){
            $('#' + options.button_id).removeClass('loading_modal');
            if($(options.modal_id).length == 1){
                $(modal_selector).dialog().remove();
                $(modal_selector).remove();
            }
            var modal_container = $('<div></div>');
            modal_container.attr('id', options.modal_id);
            modal_container.attr('title', options.title);

            $('body').append(modal_container);
            $(modal_selector).dialog({
                modal: options.modal,
                autoOpen: options.autoOpen,
                dialogClass: options.dialogClass,
                position: options.position,
                stack: options.stack,
                closeOnEscape: false,
                width: options.width,
                height: options.height,
                resizable: options.resizable,
                draggable: options.draggable,
                open: function(event, ui) {
                    $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                    $('.modal_loading').remove();
                    open_function;
                    layer_1_open;
                },
                close: close_function,
            });
            $(modal_selector).html(data);

            $(modal_selector).append(close_button_wrapper);
            var close_button_selector = '#' + options.modal_id + 'ModalCloseButton';

            $(modal_selector).dialog('open');
            $('#ModalLoadingImage').remove();

            if(options.layer == 1){
                $('.ui-widget-overlay').remove();
                $(document.body).append($('<div id="AeonWidgetOverlay"></div>'));
                $(modal_selector).addClass('modal_layer_1');
            };

            $(close_button_selector).click(function(event){
                event.preventDefault();
                $(modal_selector).dialog('close');
                $(modal_selector).remove();
                $('#' + options.button_id).removeClass('modal_open_button_active');
                if(options.layer == 1){
                    $('#AeonWidgetOverlay').remove();
                };
                if(options.layer > 1){
                    $('#' + options.modal_id + 'OverlayTitleBar').remove();
                }
            });

            if(options.layer > 1){
                var title_bar = $('<div></div>');
                title_bar.attr('id', options.modal_id + 'OverlayTitleBar');
                title_bar.attr('title', $('#ui-dialog-title-' + $('.modal_layer_1').attr('id')).text());
                $(document.body).append(title_bar);
                var title_bar_selector = '#' + options.modal_id + 'OverlayTitleBar';
                var parent_selector = '#' + $('.modal_layer_1').attr('id');
                var parent_width = $(parent_selector).dialog( "option", "width" );
                $(title_bar_selector).dialog({
                    modal: false,
                    disable: true,
                    autoOpen: false,
                    draggable: false,
                    resizable: false,
                    width: parent_width,
                    height: 0,
                    closeOnEscape: false,
                    position: 'top',
                    stack: true,
                    dialogClass: 'aeon_dialog',
                    open: function(event, ui) {
                        $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                        $(title_bar_selector).hide();
                    },
                });
                console.log(parent_selector);
                if( $(parent_selector).is(":visible")){
                    $(title_bar_selector).dialog('open');
                }

            }

        }
    });
};

//$(document).on('click', '.user_action', function(event){
//    event.stopImmediatePropagation();
//    console.log(event);
//});

var ModelActions = function(model){
    var self = this;
    self.model = model;
    self.base_url = "";

    this.edit = function(model,id){
        console.log('You clicked Edit for a ' + model + ' model, with the ID of ' + id);
        var options = {
            url: self.base_url + "/" + model + "s/" + id + "/edit",
            modal_id: "edit_" + model + "_" + id + "_modal",
            title:  "Edit " + model.capitalize(),
            width: 650,
        }
        ajax_get_modal(options);

    }
    this.show = function(model, id){
        console.log('You clicked Show for a ' + model + ' model, with the ID of ' + id);
        var options = {
            url: self.base_url + "/" + model + "s/" + id,
            modal_id: "show_" + model + "_" + id + "_modal",
            title:  "View " + model.capitalize(),
            width: 650,
        }
        ajax_get_modal(options);
    }
    this.destroy =  function(model, id){
        console.log('You clicked Destroy for a ' + model + ' model, with the ID of ' + id);

        $.ajax({
            url: self.base_url + "/" + model + "s/" + id,
            type: 'delete',
            dataType: 'JSON',
            success: function(data){
                $('.' + model + '_listing[model_id=' + id + ']').remove();
            }
        })

        var options = {
            url: self.base_url + "/" + model + "s/" + id,
            modal_id: "show_" + model + "_" + id + "_modal",
            title:  "View " + model.capitalize(),
            width: 650,
        }
    }
    this.duplicate =  function(model, id){}
    this.new = function(model){
        console.log('You clicked New for a ' + model + ' model');
        var options = {
            url: self.base_url + "/" + model + "s/new",
            modal_id: "new_" + model + "_modal",
            title:  "New " + model.capitalize(),
            width: 650,
        }
        ajax_get_modal(options);
    }
    this.select =  function(model, id){}
    $(document).off('click', '.'+ self.model +'_action');
    $(document).on('click', '.'+ self.model +'_action', function(event){
        //event.stopImmediatePropagation();
        var clicked = $(this);
        var id = clicked.attr('item_id');
        var action = clicked.attr('action');
        var container = clicked.attr('container');
        var collection_string = model.capitalize() + "sCollection";
        var collection = window[collection_string];
        console.log('ModelActions click event.');

        switch(action){
            case 'edit':
                self.edit(self.model, id);
                break;

            case 'show':
                self.show(self.model, id);
                break;

            case 'destroy':
                self.destroy(self.model, id);
                break;
            case 'duplicate':
                self.duplicate(self.model, id);
                break;
            case 'new':
                self.new(self.model);
                break;
            case 'select':
                self.select(self.model, id);
                break;
        }

    });
}

function select_models(options){
    _.each(options.selected_array, function(id){
        $('.' + options.model + '_listing[model_id=' + id + ']').addClass('selected');
    });
}

function fetch_resource_data(options) {
    var defaults = {
        success_callback: function(data){
            console.log('Data from fetch_resource_data:', data);
        },
        uri: 'index.json'
    }
    var options = $.extend({}, defaults, options);

    $.ajax({
        url: options.uri,
        dataType: 'json',
        timeout: 20000,
        cache: false,
        success: function(data){
            options.render_options.model_data = data;
            options.success_callback(options.render_options);
        }
    });
}


function render_vertical_list(options) {
    $(options.container).html('');
    _.each(options.model_data, function(item){
        var action_options = {
            model: options.model_name,
            item_id: item.id,
            container: "#" + options.model_name + "_ManageModal",
            actions: options.actions
        };

        var html  = "<div class='listing_item " + options.model_name +"_listing' model='" + options.model_name + "' model_id='" + item.id + "'>";
        html += makeActionWrapper(action_options);

        _.each(item, function(attribute, key){
            if(_.include(options.attributes, key)){
                html += "<div class='attribute' model='" + options.model_name + "' attribute='" + key + "' model_id='" + item.id + "'>" + attribute + "</div>";
            }
        });

        html += "</div>";
        var jhtml = $(html);
        $(options.container).append(jhtml);
    });;
    options.render_callback(options.render_callback_options);
}

function showErrors(ui, responseText){
    var error_array = JSON.parse(responseText);
    ui.html('');
    _.each(error_array, function(messages, field){

        var html  = "<div class='error_message_wrapper'>";
        html += "<div class='error_field'>" + field + "</div>";
        html += "<div class='error_messages'>";
        _.each(messages, function(message){
            html += "<div class='error_message'>" + message + "</div>";
        });
        html += "</div>";
        html += "</div>";
        var jhtml = $(html);
        ui.append(jhtml);
    });
}