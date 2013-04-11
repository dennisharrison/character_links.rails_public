function insertNodeAtCursor(node) {
    console.log(node);
    var range, html;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
}

function insertHtmlAtCursor(html) {
    var range, node;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        //node = range.createContextualFragment(html);
        node = html.get(0);
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().pasteHTML(html);
    }
}

var savedRange, isInFocus;
function saveSelection() {
    console.log('Saving Selection!');
    if (window.getSelection)//non IE Browsers
    {
        savedRange = window.getSelection().getRangeAt(0);
    }
    else if (document.selection)//IE
    {
        savedRange = document.selection.createRange();
    }
}

function restoreSelection() {
    isInFocus = true;
    document.getElementById("LessonWrapper").focus();
    if (savedRange != null) {
        if (window.getSelection)//non IE and there is already a selection
        {
            var s = window.getSelection();
            if (s.rangeCount > 0)
                s.removeAllRanges();
            s.addRange(savedRange);
        }
        else
        if (document.createRange)//non IE and no selection
        {
            window.getSelection().addRange(savedRange);
        }
        else
        if (document.selection)//IE
        {
            savedRange.select();
        }
    }
}
//this part onwards is only needed if you want to restore selection onclick
var isInFocus = false;
function onDivBlur() {
    console.log('In onDivBlur')
    isInFocus = false;
}

function cancelEvent(e) {
    if (isInFocus == false && savedRange != null) {
        if (e && e.preventDefault) {
            //alert("FF");
            e.stopPropagation(); // DOM style (return false doesn't always work in FF)
            e.preventDefault();
        }
        else {
            window.event.cancelBubble = true;//IE stopPropagation
        }
        restoreSelection();
        return false; // false = IE style
    }
}

function updateInput(element, target){
    content_area = $(element);
    target_input = $(target);
    target_input.val(content_area.html());
}

$(document).on('dragover', '.content_edit_area', function(e){
    e.preventDefault();
    e.stopPropagation();
});
$(document).on('dragenter', '.content_edit_area', function(e){
    e.preventDefault();
    e.stopPropagation();
});
$(document).on('blur', '.content_edit_area', function(e){
    onDivBlur();
});
$(document).on('mouseup', '.content_edit_area', function(e){
    saveSelection();
});
$(document).on('keyup', '.content_edit_area', function(e){
    var content_area = $(this)
    var target_input = $(content_area.attr('target_input'));
    target_input.val(content_area.html());
    saveSelection();
});


onkeyup='saveSelection();updateInput(this,"#question_question");'

$(document).on('drop', '.content_edit_area', function(e){
    var content_area = $(this);
    if(e.originalEvent.dataTransfer){
        if(e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            /*UPLOAD FILES HERE*/
            //upload(e.originalEvent.dataTransfer.files);
            var file = e.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var div = $('<div><div/>');
                div.addClass('dropped_image_wrapper');
                var img = $('<img/>');
                img.attr('src', event.target.result);
                div.html(img);
                insertHtmlAtCursor(div);
                content_area.trigger('keyup');
            };
            reader.readAsDataURL(file);
            return false;
        }
    }
});

function hideContentEditAreas(){
    var content_edit_areas = $('.content_edit_area');
    _.each(content_edit_areas, function(content_edit_area_element){
        var content_edit_area = $(content_edit_area_element);
        var target_input = $(content_edit_area.attr('target_input'));
        target_input.hide();
    });
};

function makeContentEditAreas(element){
    var content_edit_area_targets = $(element);

    _.each(content_edit_area_targets, function(content_edit_area_target){
        var target_input = $(content_edit_area_target);
        var html  = "<div class='content_edit_area' contenteditable='true' target_input='#" + target_input.attr('id') + "'>";
            html += target_input.val();
            html += "</div>";
        var jhtml = $(html);
        var search_string = "[target_input='#" + target_input.attr('id') + "']";
        if( $(search_string).length > 0 ){
            console.log('We have seen this one already, ' + search_string);
        } else {
            target_input.parent().append(jhtml);
            target_input.hide();
        }

    });


}

$(document).ready(function(event){
    makeContentEditAreas('.content_edit_area_target');
});