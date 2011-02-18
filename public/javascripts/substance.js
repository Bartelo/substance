// Register Notifications
var Notifications = {
  CONNECTED: {
    message: 'Just established a server connection.',
    type: 'info'
  },
  
  AUTHENTICATED: {
    message: 'Successfully authenticated.',
    type: 'success'
  },
  
  AUTHENTICATION_FAILED: {
    message: 'Authentication failed.',
    type: 'error'
  },
  
  SIGNUP_FAILED: {
    message: 'User Registration failed. Check your input',
    type: 'error'
  },
  
  DOCUMENT_LOADING: {
    message: 'Loading document ...',
    type: 'info'
  },
  
  DOCUMENT_LOADED: {
    message: 'Document successfully loaded.',
    type: 'success'
  },
  
  DOCUMENT_LOADING_FAILED: {
    message: 'An error ocurred during loading.',
    type: 'error'    
  },
  
  DOCUMENTS_LOADING: {
    message: 'Loading available documents ...',
    type: 'info'
  },
  
  DOCUMENTS_LOADED: {
    message: 'Documents fetched.',
    type: 'success'
  },
  
  DOCUMENTS_LOADING_FAILED: {
    message: 'An error occured during loading documents',
    type: 'error'
  }, 
  
  BLANK_DOCUMENT: {
    message: "You are now editing a blank document.",
    type: 'info'
  },
  
  DOCUMENT_SAVING: {
    message: "Saving document ...",
    type: 'info'
  },
  
  DOCUMENT_SAVED: {
    message: "The document has been stored in the repository.",
    type: 'success'
  },
  
  DOCUMENT_SAVING_FAILED: {
    message: "Error during saving.",
    type: 'error'
  },
  
  SYNCHRONIZING: {
    message: "Synchronizing with server ...",
    type: 'info'
  },
  
  SYNCHRONIZED: {
    message: "Successfully synchronized with server",
    type: 'info'
  },
  
  SYNCHRONIZING_FAILED: {
    message: "Failed to synchronize with server",
    type: 'error'
  },
  
  DOCUMENT_INVALID: {
    message: "The document is invalid. Make sure that you've set a correct name for it.",
    type: 'error'
  },
  
  DOCUMENT_ALREADY_EXISTS: {
    message: "This document name is already taken.",
    type: 'error'
  },
  
  DOCUMENT_DELETING: {
    message: "Deleting document ...",
    type: 'info'
  },
  
  DOCUMENT_DELETED: {
    message: "The document has been deleted.",
    type: 'success'
  },
  
  DOCUMENT_DELETING_FAILED: {
    message: "Error during deletion.",
    type: 'error'
  },
  
  NEW_COLLABORATOR: {
    message: "A new collaborator just went online.",
    type: 'info'
  },
  
  EXIT_COLLABORATOR: {
    message: "One collaborator just left.",
    type: 'info'
  }
};


Backbone.Notifier = function(options) {
  options || (options = {});
  if (this.initialize) this.initialize(options);
};

_.extend(Backbone.Notifier.prototype, Backbone.Events, {
  notify: function(message) {
    this.trigger('message:arrived', message);
  }
});


// Set up global notification system
var notifier = new Backbone.Notifier();

// Listen for messages 
notifier.bind('message:arrived', function(message) {
  var $message = $('<p class="notification"><span>info:</span>'+message.message+'</p>');
  $('#notifications .wrapper').append($message);
  
  if (message.message.indexOf('...') !== -1) {
    $message.addClass('activity');
    
  } else {
    $('#notifications .wrapper p.activity').remove();
    // Just flash message if it's not a wait... message
    setTimeout(function() {
      $message.remove();
    }, 4000);
  }
});
// Helpers
// ---------------



/**
 * Date.parse with progressive enhancement for ISO-8601, version 2
 * © 2010 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function () {
    _.date = function (date) {
        var timestamp = Date.parse(date), minutesOffset = 0, struct;
        if (isNaN(timestamp) && (struct = /^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {
            if (struct[8] !== 'Z') {
                minutesOffset = +struct[10] * 60 + (+struct[11]);
                
                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }
            
            timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +struct[7].substr(0, 3));
        }
        
        return new Date(timestamp).toDateString();
    };
}());


var Helpers = {};

// Templates for the moment are recompiled every time
Helpers.renderTemplate = _.renderTemplate = function(tpl, view, helpers) {
  source = $("script[name="+tpl+"]").html();
  var template = Handlebars.compile(source);
  return template(view, helpers || {});
};

// Render Underscore templates
_.tpl = function(tpl, ctx) {
  source = $("script[name="+tpl+"]").html();
  // var template = Handlebars.compile(source);
  // return template(view, helpers || {});
  return _.template(source, ctx);
};

_.prettyDate = function(time) {
  if (time instanceof Date) time = time.toJSON();
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
};



_.stripTags = function(input, allowed) {
// Strips HTML and PHP tags from a string  
// 
// version: 1009.2513
// discuss at: http://phpjs.org/functions/strip_tags
// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   improved by: Luke Godfrey
// +      input by: Pul
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Onno Marsman
// +      input by: Alex
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Marc Palau
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Eric Nagel
// +      input by: Bobby Drake
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Tomasz Wesolowski
// +      input by: Evertjan Garretsen
// +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
// *     example 1: strip_tags('<p>Kevin</p> <b>van</b> <i>Zonneveld</i>', '<i><b>');
// *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
// *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
// *     returns 2: '<p>Kevin van Zonneveld</p>'
// *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
// *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
// *     example 4: strip_tags('1 < 5 5 > 1');
// *     returns 4: '1 < 5 5 > 1'
// *     example 5: strip_tags('1 <br/> 1');
// *     returns 5: '1  1'
// *     example 6: strip_tags('1 <br/> 1', '<br>');
// *     returns 6: '1  1'
// *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
// *     returns 7: '1 <br/> 1'
   allowed = (((allowed || "") + "")
      .toLowerCase()
      .match(/<[a-z][a-z0-9]*>/g) || [])
      .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
   var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
       commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
   return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
   });
}
var renderControls = function(node, first, last, parent) {
  
  function render(node, destination, consolidate) {
    
    function computeActions(n, parent) {
      var actions = [];

      // Possible children
      if (n.all('children') && n.all('children').length === 0 && destination === 'after') {
        var children = n.properties().get('children').expectedTypes;
        
        _.each(children, function(type) {
          actions.push({
            node: n._id,
            parentNode: parent ? parent._id : null,
            nodeType: type,
            nodeTypeName: graph.get(type).name,
            insertionType: 'child'
          });
        });
      }

      // Possible siblings
      if (parent) {
        var siblings = parent.properties().get('children').expectedTypes;
        _.each(siblings, function(type) {
          actions.push({
            node: n._id,
            parentNode: parent ? parent._id : null,
            nodeType: type,
            nodeTypeName: graph.get(type).name,
            insertionType: 'sibling'
          });
        });
      }
      
      // Consolidate actions for child elements
      if (consolidate && n.all('children') && n.all('children').length > 0) {
        actions = actions.concat(computeActions(n.all('children').last(), n));
      }
      
      return actions;
    }
  
    return Helpers.renderTemplate('controls', {
      node: node.key,
      destination: destination,
      actions: computeActions(node, parent)
    });
  }
  
  // Top level
  if (!parent) {
    // Cleanup
    $('#document .controls').remove();
    if (!node.all('children') || node.all('children').length === 0) {
      $(render(node, 'after')).appendTo($('#'+node.html_id));
    }
  } else {
    //  Insert before, but only for starting nodes (first=true)
    if (first) {
      // Insert controls before node
      $(render(node, 'before')).insertBefore($('#'+node.html_id));
    }
    
    // Consolidate at level 1 (=section level), but only for closing nodes (last=true)
    if (parent.types().get('/type/document')) {
      $(render(node, 'after', true)).insertAfter($('#'+node.html_id));
    } else if (!last) {
      $(render(node,'after')).insertAfter($('#'+node.html_id));
    }
  }
  
  if (node.all('children')) {
    // Do the same for all children
    node.all('children').each(function(child, key, index) {
      var first = index === 0;
      var last = index === node.all('children').length-1;
      renderControls(child, first, last, node);
    });
  }
};


// HTMLRenderer
// ---------------

var HTMLRenderer = function(root, parent) {
  
  // Implement node types
  var renderers = {
    "/type/document": function(node, parent) {
      var content = '',
          children = node.all('children');
      
      if (children) {
        children.each(function(child, key, index) {
          content += renderers[child.type._id](child, node);
        });        
      }
      
      return _.tpl('document', {
        node: node,
        content: content,
        edit: app.document.mode === 'edit',
        title: node.get('title'),
        lead: node.get('lead')
      });
    },
    
    "/type/story": function(node, parent) {
      return renderers["/type/document"](node, parent)
    },
    
    "/type/conversation": function(node, parent) {
      return renderers["/type/document"](node, parent)
    },
    
    "/type/article": function(node, parent) {
      return renderers["/type/document"](node, parent)
    },
    
    "/type/manual": function(node, parent) {
      return renderers["/type/document"](node, parent)
    },
    
    "/type/qaa": function(node, parent) {
      return renderers["/type/document"](node, parent)
    },
    
    "/type/section": function(node, parent) {
      var content = '',
          children = node.all('children');
      
      if (children) {
        node.all('children').each(function(child, key, index) { 
          content += renderers[child.type._id](child, node);
        });
      }
      
      return Helpers.renderTemplate('section', {
        node: node,
        parent: parent,
        content: content,
        edit: app.document.mode === 'edit',
        name: node.get('name')
      });
    },
    
    "/type/text": function(node, parent) {
      return Helpers.renderTemplate('text', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        content: node.get('content')
      });
    },
    
    "/type/quote": function(node, parent) {
      return Helpers.renderTemplate('quote', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        content: node.get('content'),
        author: node.get('author')
      });
    },
    
    "/type/code": function(node, parent) {
      return Helpers.renderTemplate('code', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        content: node.get('content')
      });
    },
    
    "/type/question": function(node, parent) {
      return Helpers.renderTemplate('question', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        content: node.get('content')
      });
    },
    
    "/type/answer": function(node, parent) {
      return Helpers.renderTemplate('answer', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        content: node.get('content')
      });
    },
    
    "/type/image": function(node, parent) {
      return Helpers.renderTemplate('image', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        url: node.get('url')
      });
    },
    
    "/type/visualization": function(node, parent) {
      return Helpers.renderTemplate('visualization', {
        node: node,
        parent: parent,
        edit: app.document.mode === 'edit',
        visualization_type: node.get('visualization_type'),
        data_source: node.get('data_source')
      });
    }
  };

  return {
    render: function() {
      // Traverse the document     
      return renderers[root.type._id](root, parent);
    }
  };
};


var TOCRenderer = function(root) {
  
  // Known node types
  var renderers = {
    "/type/document": function(node) {
      content = '<h2>Table of contents</h2>';
      content += '<ul>';
      node.all('children').each(function(child) {
        content += '<li><a class="toc-item" node="'+child.html_id+'" href="#'+root.get('creator')._id.split('/')[2]+'/'+root.get('name')+'/'+child.html_id+'">'+child.get('name')+'</a></li>';
      });
      content += '</ul>';
      return content;
    },
    
    "/type/story": function(node) {
      return renderers["/type/document"](node);
    },
    
    "/type/conversation": function(node) {
      return "";
    },
    
    "/type/manual": function(node, parent) {
      return renderers["/type/document"](node, parent);
    },
    
    "/type/article": function(node, parent) {
      return renderers["/type/document"](node, parent);
    },
    
    "/type/qaa": function(node, parent) {
      return renderers["/type/document"](node, parent);
    }
  };

  return {
    render: function() {
      // Traverse the document
      return renderers[root.type._id](root);
    }
  };
};
var DocumentEditor = Backbone.View.extend({
  events: {
    'keydown .property': 'updateNode'
  },
  
  initialize: function() {
    var that = this;
    
    this.$node = $('#' + app.document.selectedNode.html_id + ' > h1.content').attr('contenteditable', true);
    this.$lead = $('#' + app.document.selectedNode.html_id + ' #document_lead').attr('contenteditable', true);
    
    this.$node.unbind('keydown');
    this.$node.bind('keydown', function(e) {
      return e.keyCode !== 13 ? that.updateNode() : false;
    });
    this.$lead.unbind('keydown');
    this.$lead.bind('keydown', function(e) {
      return e.keyCode !== 13 ? that.updateNode() : false;
    });
  },
  
  updateNode: function() {
    var that = this;
    setTimeout(function() {
      var sanitizedTitle = _.stripTags(that.$node.html());

      // Update HTML with sanitized content
      // that.$node.html(sanitizedTitle);
      
      var sanitizedLead = _.stripTags(that.$lead.html());

      // Update HTML with sanitized content
      // that.$lead.html(sanitizedLead);
      
      app.document.updateSelectedNode({
        title: sanitizedTitle,
        lead: sanitizedLead
      });
      
      app.document.trigger('changed');
    }, 5);
  }
});
var SectionEditor = Backbone.View.extend({
  events: {
    'keydown .property': 'updateNode'
  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$node = $('#' + app.document.selectedNode.html_id + ' > .content').attr('contenteditable', true);
    this.$node.unbind('keydown');
    
    this.$node.bind('keydown', function(e) {
      return e.keyCode !== 13 ? that.updateNode() : false;
    });
  },
  
  updateNode: function(e) {
    var that = this;
    
    setTimeout(function() {
      var sanitizedContent = _.stripTags(that.$node.html());
      // Update HTML with sanitized content
      app.document.updateSelectedNode({
        name: sanitizedContent
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_section', app.editor.model.selectedNode.data));
  }
});

var TextEditor = Backbone.View.extend({
  events: {

  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$content = this.$('div.content');
    editor.activate(this.$content);
    
    // Update node when editor commands are applied
    editor.bind('changed', function() {
      that.updateNode();
    });
  },
  
  updateNode: function() {
    var that = this;
    
    setTimeout(function() {
      app.document.updateSelectedNode({
        content: that.$content.html()
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_text', app.editor.model.selectedNode.data));
  }
});

var QuoteEditor = Backbone.View.extend({
  events: {

  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$content = this.$('.quote-content');
    this.$author = this.$('.quote-author');
    
    editor.activate(that.$content);
    
    this.$author.unbind('keydown');
    this.$author.bind('keydown', function(e) {
      return e.keyCode !== 13 ? that.updateNode() : false;
    });

    $('.proper-commands').hide(); // Quickfix
    
    // Update node when editor commands are applied
    editor.bind('changed', function() {
      that.updateNode();
    });
  },
  
  updateNode: function() {
    var that = this;
    
    setTimeout(function() {
      app.document.updateSelectedNode({
        content: that.$content.html(),
        author: that.$author.html()
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_text', app.editor.model.selectedNode.data));
  }
});

var CodeEditor = Backbone.View.extend({
  events: {

  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$content = this.$('.content');
    editor.activate(this.$content);
    
    $('.proper-commands').hide(); // Quickfix
    
    // Update node when editor commands are applied
    editor.bind('changed', function() {
      that.updateNode();
    });
  },
  
  updateNode: function() {
    var that = this;
    
    setTimeout(function() {
      app.document.updateSelectedNode({
        content: that.$content.html()
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_text', app.editor.model.selectedNode.data));
  }
});

var QuestionEditor = Backbone.View.extend({
  events: {

  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$content = this.$('.content');
    editor.activate(this.$content);
    $('.proper-commands').hide(); // Quickfix
    
    // Update node when editor commands are applied
    editor.bind('changed', function() {
      that.updateNode();
    });
  },
  
  updateNode: function() {
    var that = this;
    
    setTimeout(function() {
      app.document.updateSelectedNode({
        content: that.$content.html()
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_text', app.editor.model.selectedNode.data));
  }
});

var AnswerEditor = Backbone.View.extend({
  events: {

  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    this.$content = this.$('.content');
    editor.activate(this.$content);
    $('.proper-commands').hide(); // Quickfix
    
    // Update node when editor commands are applied
    editor.bind('changed', function() {
      that.updateNode();
    });
  },
  
  updateNode: function() {
    var that = this;
    
    setTimeout(function() {
      app.document.updateSelectedNode({
        content: that.$content.html()
      });
    }, 5);
  },
  
  render: function() {
    // $(this.el).html(Helpers.renderTemplate('edit_text', app.editor.model.selectedNode.data));
  }
});

var ImageEditor = Backbone.View.extend({
  events: {
    
  },
  
  initialize: function() {
    var that = this;
    this.render();
    
    $('#upload_image').transloadit({
      modal: false,
      wait: true,
      autoSubmit: false,
      onProgress: function(bytesReceived, bytesExpected) {
        percentage = (bytesReceived / bytesExpected * 100).toFixed(2) || 0;
        $('#upload_progress').attr('style', 'width:' + percentage +'%');
        $('#image_progress_legend').html('<strong>Uploading:</strong> ' + percentage + '% complete</div>');
      },
      onError: function(assembly) {
        alert(assembly.error+': '+assembly.message);
        $('#progress_container').hide();
      },
      onStart: function() {
        $('#progress_container').show();
      },
      onSuccess: function(assembly) {
        // This triggers a node re-render
        app.document.updateSelectedNode({
          url: assembly.results.resize_image[0].url,
          dirty: true
        });
        $('#progress_container').hide();
      }
    });
  },
  
  render: function() {
    this.$('.node-editor-placeholder').html(Helpers.renderTemplate('edit_image', app.editor.model.selectedNode.data));
  }
});
var ApplicationController = Backbone.Controller.extend({
  routes: {
    '^(?!search)(.*)\/(.*)$': 'loadDocument',
    '^(?!search)(.*)\/(.*)\/(.*)$': 'loadDocument',
    ':username': 'userDocs',
    '^search\/(.*)$': 'searchDocs'
  },
  
  loadDocument: function(username, docname, node) {
    app.browser.load({"type": "user", "value": username});
    app.document.loadDocument(username, docname, node);
    
    $('#document_wrapper').attr('url', '#'+username+'/'+docname);
    $('#browser_wrapper').attr('url', '#'+username);
    return false;
  },
  
  userDocs: function(username) {
    // username = username.length > 0 ? username : app.username;
    
    if (!username) { // startpage rendering
      return app.toggleStartpage();
    }
    
    app.browser.load({"type": "user", "value": username});
    
    $('#browser_wrapper').attr('url', '#'+username);
    
    app.browser.bind('loaded', function() {
      app.toggleView('browser');
    });
    
    return false;
  },
  
  searchDocs: function(searchstr) {
    app.searchDocs(searchstr);
    return false;
  }
});
// Top level UI namespace

var UI = {};

UI.StringEditor = Backbone.View.extend({
  events: {
    'change input': 'updateValue'
  },
  
  initialize: function(options) {
    var that = this;
    this._value = options.value;
    
    // Re-render on every change
    this.bind('changed', function() {
      that.render();
    });
    
    // Finally, render
    this.render();
  },
  
  // Add a new value for the property
  updateValue: function(e) {
    var val = this.$('input[name=value]').val();

    this._value = val;
    this.trigger('changed');
    this.render(); // re-render
    
    return false;
  },
  
  // Get the current set of values
  value: function() {
    return this._value;
  },
  
  // Render the editor, including the display of values
  render: function() {
    $(this.el).html(_.renderTemplate('string_editor', {
      value: this._value
    }));
  }
});
UI.MultiStringEditor = Backbone.View.extend({
  events: {
    'submit form': 'newItem',
    'click a.remove-item': 'removeItem',
    'click .available-item a': 'selectAvailableItem',
    'keydown input': 'inputChange',
    'click input': 'initInput',
    'blur input': 'reset'
  },
  
  initialize: function(options) {
    var that = this;
    this._items = options.items || [];
    this._availableItems = options.availableItems;
    
    // Re-render on every change
    this.bind('changed', function() {
      that.render();
    });
    
    // Finally, render
    this.render();
  },
  
  initInput: function() {
    // this.updateSuggestions();
  },
  
  reset: function() {
    this.$('.available-items').empty();
  },
  
  inputChange: function(e) {
    var suggestions = this.$('.available-item');
    if (e.keyCode === 40) { // down-key
      if (this.selectedIndex < suggestions.length-1) this.selectedIndex += 1;
      this.teaseSuggestion();
    } else if (e.keyCode === 38){ // up-key
      if (this.selectedIndex>=0) this.selectedIndex -= 1;
      this.teaseSuggestion();
    } else {
      this.updateSuggestions();
    }
  },
  
  teaseSuggestion: function() {
    var suggestions = this.$('.available-item');
    this.$('.available-item.selected').removeClass('selected');
    if (this.selectedIndex>=0 && this.selectedIndex < this.$('.available-item').length) {
      $(this.$('.available-item')[this.selectedIndex]).addClass('selected');
    }
  },
  
  // Update matched suggestions
  updateSuggestions: function() {
    var that = this;
    setTimeout(function() {
      if (this.$('input[name=new_value]').val().length === 0) {
        that.$('.available-items').empty();
        return;
      }
      
      var regexp = new RegExp('^'+this.$('input[name=new_value]').val().toLowerCase()+'(.)*')
      
      that.$('.available-items').empty();
      _.each(that._availableItems, function(item) {
        if (regexp.test(item.toLowerCase())) {
          that.$('.available-items').append($('<div class="available-item"><a href="#" value="'+item+'">'+item+'</a></div>'));
        }
      });
      that.selectedIndex = -1;
    }, 200);
  },
  
  selectAvailableItem: function(e) {
    this.$('input[name=new_value]').val($(e.currentTarget).attr('value'));
    this.$('input[name=new_value]').focus();
    return false;
  },
  
  // Add a new value for the property
  newItem: function(e) {
    if (this.selectedIndex >= 0) {
      this.$('input[name=new_value]').val(this.$('.available-item.selected a').attr('value'));
    }
        
    var val = this.$('input[name=new_value]').val();
    if (!_.include(this._items, val) && val.length > 0) {
      this._items.push(val); 
      this.trigger('changed');
      this.render(); // re-render
      this.$('input[name=new_value]').focus();
    } else {
      this.trigger('error:alreadyexists');
    }
    return false;
  },
  
  // Remove a certain value
  removeItem: function(e) {
    var val = $(e.target).attr('value');
    this._items = _.reject(this._items, function(v) { return v === val; });
    this.trigger('changed');
    return false;
  },
  
  // Get the current value [= Array of values]
  value: function() {
    return this._items;
  },
  
  // Render the editor, including the display of values
  render: function() {
    $(this.el).html(_.renderTemplate('multi_string_editor', {
      items: this._items
    }));
  }
});
function addEmptyDoc(type, name) {
  var docType = graph.get(type);
  var doc = graph.set(Data.uuid('/document/'+ app.username +'/'), docType.meta.template);
  doc.set({
    creator: "/user/"+app.username,
    created_at: new Date(),
    updated_at: new Date(),
    name: name
  });
  return doc;
};

// The Document Editor View

var Document = Backbone.View.extend({
  events: {
    'mouseover .content-node': 'highlightNode',
    'mouseout .content-node': 'unhighlightNode',
    'click .content-node': 'selectNode',
    'click .controls .handle': 'showActions',
    'click a.unpublish-document': 'unpublishDocument',
    'click a.publish-document': 'publishDocument',
    
    // Actions
    'click a.add_child': 'addChild',
    'click a.add_sibling': 'addSibling',
    'click a.remove-node': 'removeNode',
    'dragstart': 'dragStart',
    'dragend': 'dragEnd',
    'dragenter': 'dragEnter',
    'dragover': 'dragOver',
    'dragleave': 'dragLeave',
    'drop': 'drop'
  },
  
  loadedDocuments: {},
  
  initialize: function() {
    var that = this;
    this.attributes = new Attributes({el: '#attributes', model: this.model});
    
    this.app = this.options.app;
    this.mode = 'show';
    
    this.bind('status:changed', function() {
      that.updateCursors();
    });
    
    this.bind('changed', function() {
      document.title = that.model.get('title');
      // Re-render Document browser
      that.app.browser.render();
    });
  },
  
  updateCursors: function() {
    $('.content-node.occupied').removeClass('occupied');
    _.each(this.status.cursors, function(user, nodeKey) {
      var n = graph.get(nodeKey);
      $('#'+n.html_id).addClass('occupied');
      $('#'+n.html_id+' .cursor span').html(user);
    });
  },
  
  render: function() {
    // Render all relevant sub views
    $(this.el).html(_.tpl('document_wrapper', {
      mode: this.mode,
      doc: this.model
    }));
    
    this.renderMenu();

    if (this.model) {
      // Render Attributes
      this.attributes.render();
      
      // Render the acutal document
      this.renderDocument();
    }
  },
  
  // Re-renders a particular node and all child nodes
  renderNode: function(node) {
    var $node = $('#'+node.html_id);
    var parent = graph.get($node.attr('parent'));
    
    $('#'+node.html_id).replaceWith(new HTMLRenderer(node, parent).render());
    
    if (this.mode === 'edit') {
      renderControls(this.app.document.model);
    } else {
      hijs('#'+node.html_id+' .content-node.code pre');
    }
  },
  
  renderDocument: function() {
    this.$('#document').html(new HTMLRenderer(this.model).render());
    this.$('#attributes').show();
    this.$('#document').show();
    
    // Render controls
    if (this.mode === 'edit') {
      renderControls(this.model);
    } else {
      hijs('.content-node.code pre');
    }
  },
  
  // renderVisualizations: function() {
  //   $('.visualization').each(function() {
  //     // Initialize visualization
  //     var c = new uv.Collection(countries_fixture);
  //     
  //     vis = new Linechart(c, {property: 'birth_rate', canvas: this});
  //     vis.start();
  //     
  //     // Stop propagation of mousewheel events
  //     $(this).bind('mousewheel', function() {
  //       return false;
  //     });
  //   });
  // },
  
  // Extract available documentTypes from config
  documentTypes: function() {
    var result = [];
    graph.get('/config/substance').get('document_types').each(function(type, key) {
      result.push({
        type: key,
        name: graph.get(key).name
      });
    });
    return result;
  },
  
  renderMenu: function() {
    if (this.model) {
      $('#document_tab').show();
      $('#document_tab').html(_.tpl('document_tab', {
        username: this.model.get('creator')._id.split('/')[2],
        document_name: this.model.get('name')
      }));
    }
  },
  
  init: function() {
    var that = this;
    
    // Inject node editor on every select:node
    this.unbind('select:node');
    
    this.bind('select:node', function(node) {
      that.resetSelection();
      $('#'+node.html_id).addClass('selected');
      
      $('#document').addClass('edit-mode');
      // Deactivate Richtext Editor
      editor.deactivate();
      
      // Render inline Node editor
      that.renderNodeEditor(node);
    });
    
    // Former DocumentView stuff
    this.bind('change:node', function(node) {
      that.renderNode(node);
    });
    
    // Points to the selected
    that.selectedNode = null;

    // TODO: Select the document node on-init
    $(document).unbind('keyup');
    $(document).keyup(function(e) {
      if (e.keyCode == 27) { that.reset(); }  // esc
      e.stopPropagation();
    });
    
    // New node
    $(document).bind('keydown', 'alt+down', function(e) {
      if (that.selectedNode) {
        var controls = $('.controls[node='+that.selectedNode._id+'][destination=after]');
        if (controls) {
          controls.addClass('active');
          // Enable insert mode
          $('#document').addClass('insert-mode');
        }
      }
    });
    
    $(document).bind('keydown', 'right', function(e) {
      // TODO: implement cycle through node insertion buttons
    });
    
    $(document).bind('keydown', 'left', function(e) {
      // TODO: implement cycle through node insertion buttons
    });
  },
  
  newDocument: function(type, name) {
    this.model = addEmptyDoc(type, name);
    
    this.status = null;
    this.mode = 'edit';
    $(this.el).show();
    this.render();
    this.loadedDocuments[app.username+"/"+name] = this.model._id;
    this.init();
    
    // Update browser graph
    if (app.browser && app.browser.query && app.browser.query.type === "user" && app.browser.query.value === app.username) {
      app.browser.graph.set('objects', this.model._id, this.model);
    }
    
    // Move to the actual document
    app.toggleView('document');
    
    controller.saveLocation('#'+this.app.username+'/'+name);
    $('#document_wrapper').attr('url', '#'+this.app.username+'/'+name);
    
    this.trigger('changed');
    notifier.notify(Notifications.BLANK_DOCUMENT);
    return false;
  },
  
  loadDocument: function(username, docname, nodeid, mode) {
    var that = this;
    
    $('#tabs').show();
    function init(id) {
      that.model = graph.get(id);
      
      if (that.model) {
        that.mode = mode || (username === this.app.username ? 'edit' : 'show');
        that.render();
        that.init();
        that.reset();
        that.trigger('changed');
        
        that.loadedDocuments[username+"/"+docname] = id;
        app.toggleView('document');
        
        // Update browser graph reference
        app.browser.graph.set('objects', id, that.model);
                
        // TODO: register document for realtime sessions
        // remote.Session.registerDocument(id);
      } else {
        $('#document_wrapper').html('Document loading failed');
      }
    }
    
    var id = that.loadedDocuments[username+"/"+docname];
    $('#document_tab').show();
    
    
    // Already loaded - no need to fetch it
    if (id) {
      // TODO: check if there are changes from a realtime session
      init(id);
    } else {
      $('#document_tab').html('&nbsp;&nbsp;&nbsp;Loading...');
      $.ajax({
        type: "GET",
        url: "/readdocument",
        data: {
          creator: username,
          name: docname
        },
        dataType: "json",
        success: function(res) {
          if (res.status === 'error') {
            $('#document_wrapper').html('Document loading failed');
          } else {
            graph.merge(res.graph);
            init(res.id);
          }
        },
        error: function(err) {
          $('#document_wrapper').html('Document loading failed');
        }
      });
    }
  },
  
  closeDocument: function() {
    this.model = null;
    controller.saveLocation('#'+this.app.username);
    $('#document_wrapper').attr('url', '#'+this.app.username);
    $('#document_tab').hide();
    app.toggleView('content');
    this.render();
  },
  
  // Delete an existing document, given that the user is authorized
  // -------------
  
  deleteDocument: function(id) {
    var that = this;
    graph.del(id);
    app.browser.graph.del(id);
    app.browser.render();
    $('#document_tab').hide();
    setTimeout(function() {
      app.toggleView('browser');
    }, 300);
    notifier.notify(Notifications.DOCUMENT_DELETED);
  },
  
  // Reset to view mode (aka unselect everything)
  reset: function(noBlur) {
    if (!this.model) return;
    if (!noBlur) $('.content').blur();
    
    this.app.document.selectedNode = null;
    this.resetSelection()

    // Broadcast
    // remote.Session.selectNode(null);
    return false;
  },
  
  resetSelection: function() {
    this.$('.content-node.selected').removeClass('selected');
    $('#document .controls.active').removeClass('active');
    
    $('#document').removeClass('edit-mode');
    $('#document').removeClass('insert-mode');
    $('.proper-commands').hide();
    
    // Reset node-editor-placeholders
    $('.node-editor-placeholder').html('');
  },
  
  renderNodeEditor: function(node) {
    var $node = $('#'+node.html_id);
    if (this.mode !== 'edit') return;
    
    // Depending on the selected node's type, render the right editor
    if (_.include(this.selectedNode.types().keys(), '/type/document')) {
      this.nodeEditor = new DocumentEditor({el: $('#drawer_content')});
    } else if (this.selectedNode.type._id === '/type/text') {
      this.nodeEditor = new TextEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/section') {
      this.nodeEditor = new SectionEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/image') {
      this.nodeEditor = new ImageEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/quote') {
      this.nodeEditor = new QuoteEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/code') {
      this.nodeEditor = new CodeEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/question') {
      this.nodeEditor = new QuestionEditor({el: $node});
    } else if (this.selectedNode.type._id === '/type/answer') {
      this.nodeEditor = new AnswerEditor({el: $node});
    }
  },
  
  updateNode: function(nodeKey, attrs) {
    var node = graph.get(nodeKey);
    node.set(attrs);
    this.trigger('change:node', node);
  },
  
  // Update attributes of selected node
  updateSelectedNode: function(attrs) {
    if (!this.selectedNode) return;
    this.selectedNode.set(attrs);
    
    // Only set dirty if explicitly requested    
    if (attrs.dirty) {
      this.trigger('change:node', this.selectedNode);
    }
    
    if (this.selectedNode.type.key === '/type/document') {
      this.trigger('changed');
    }
    
    // Notify all collaborators about the changed node
    if (this.status && this.status.collaborators.length > 1) {
      var serializedNode = this.selectedNode.toJSON();
      delete serializedNode.children;
      // remote.Session.registerNodeChange(this.selectedNode._id, serializedNode);
    }
  },
  
  showActions: function(e) {
    this.reset();
    $(e.target).parent().parent().addClass('active');
    
    // Enable insert mode
    $('#document').addClass('insert-mode');
    return false;
  },
  
  highlightNode: function(e) {
    $(e.currentTarget).addClass('active');
    return false;
  },
  
  unhighlightNode: function(e) {
    $(e.currentTarget).removeClass('active');
    return false;
  },
  
  selectNode: function(e) {
    if (this.mode === 'show') return; // Skip for show mode
    
    var key = $(e.currentTarget).attr('name');
    
    if (!this.selectedNode || this.selectedNode.key !== key) {
      var node = graph.get(key);
      this.selectedNode = node;
      this.trigger('select:node', this.selectedNode);

      // The server will respond with a status package containing my own cursor position
      // remote.Session.selectNode(key);
    }
    
    e.stopPropagation();
    return false;
  },
  
  publishDocument: function(e) {
    this.model.set({
      published_on: (new Date()).toJSON()
    });
    this.render();
    return false;
  },
  
  unpublishDocument: function() {
    this.model.set({
      published_on: null
    });
    this.render();
    return false;
  },
  
  addChild: function(e) {
    if (arguments.length === 1) {
      // Setup node
      var type = $(e.currentTarget).attr('type');
      var refNode = graph.get($(e.currentTarget).attr('node'));
      var newNode = graph.set(null, {"type": type, "document": this.model._id});
    } else {
      var refNode = graph.get(arguments[1]);
      var newNode = graph.set(arguments[0].nodeId, arguments[0]);
    }
    
    // Connect child node
    refNode.all('children').set(newNode._id, newNode);
    refNode.dirty = true;
    this.trigger('change:node', refNode);
    
    // Select newly created node
    this.selectedNode = newNode;
    this.trigger('select:node', this.selectedNode);
    
    if (arguments.length === 1) {
      // Broadcast insert node command
      // remote.Session.insertNode('child', newNode.toJSON(), $(e.currentTarget).attr('node'), null, 'after');
    }
    return false;
  },
  
  // TODO: cleanup!
  addSibling: function(e) {
    if (arguments.length === 1) {
      // Setup node
      var type = $(e.currentTarget).attr('type');
      var refNode = graph.get($(e.currentTarget).attr('node'));
      var parentNode = graph.get($(e.currentTarget).attr('parent'));
      var destination = $(e.currentTarget).parent().parent().attr('destination');
      
      // newNode gets populated with default values
      var newNode = graph.set(null, {"type": type, "document": this.model._id});
    } else {
      var refNode = graph.get(arguments[1]);
      var parentNode = graph.get(arguments[2]);
      var destination = arguments[3];
      var newNode = graph.set(arguments[0].nodeId, arguments[0]);
    }

    var targetIndex = parentNode.all('children').index(refNode._id);
    
    if (destination === 'after') {
      targetIndex += 1;
    }
    
    // Connect to parent
    parentNode.all('children').set(newNode._id, newNode, targetIndex);
    parentNode.dirty = true;
    this.trigger('change:node', parentNode);

    // Select newly created node
    this.selectedNode = newNode;
    this.trigger('select:node', this.selectedNode);
    
    if (arguments.length === 1) {
      // Broadcast insert node command
      // remote.Session.insertNode('sibling', newNode.toJSON(), refNode._id, parentNode._id, destination);      
    }
    return false;
  },
    
  removeNode: function(e) {
    if (arguments.length === 1) {
      var node = graph.get($(e.currentTarget).attr('node'));
      var parent = graph.get($(e.currentTarget).attr('parent'));
    } else {
      var node = graph.get(arguments[0]);
      var parent = graph.get(arguments[1]);
    }
    
    parent.all('children').del(node._id);
    graph.del(node._id);
    parent.dirty = true;
    this.trigger('change:node', parent);

    if (arguments.length === 1) {
      // Broadcast insert node command
      // remote.Session.removeNode(node._id, parent._id);
    }
    return false;
  }
});
var Attributes = Backbone.View.extend({
  
  initialize: function() {
    var that = this;
  },
  
  render: function() {
    app.document.mode === 'edit' ? this.renderEdit() : this.renderShow();
  },
  
  renderShow: function() {
    var that = this; 
    var doc = app.document.model;
    var attributes = [];
    
    var attributes = doc.properties().select(function(property) {
      if (property.expectedTypes[0] === '/type/attribute') {
        return true;
      }
    });
    
    $(this.el).html(_.tpl('show_attributes', {
      attributes: attributes,
      doc: doc
    }));
  },
  
  availableAttributes: function(property) {
    return graph.find({
      "type|=": ['/type/attribute'],
      member_of: '/'+ property.type._id.split('/')[2]+'/'+property.key
    });
  },
  
  renderEdit: function() {
    var that = this; 
    var doc = app.document.model;
    var attributes = [];
    
    var attributes = doc.properties().select(function(property) {
      if (property.expectedTypes[0] === '/type/attribute') {
        return true;
      }
    });
    
    $(this.el).html(_.tpl('edit_attributes', {
      attributes: attributes,
      doc: doc
    }));
    
    
    // Initialize AttributeEditors for non-unique-strings
    $('.attribute-editor').each(function() {
      var member_of = $(this).attr('property');
      var property = graph.get('/type/'+member_of.split('/')[1]).get('properties', member_of.split('/')[2]),
          key = $(this).attr('key'),
          unique = $(this).hasClass('unique'),
          type = $(this).attr('type');
          
          // property value / might be an array or a single value
          value = unique 
                  ? app.document.model.get(key).get('name') 
                  : _.map(app.document.model.get(key).values(), function(v) { return v.get('name'); });
    
          var availableAttributes = _.uniq(_.map(that.availableAttributes(property).values(), function(val) {
            return val.get('name');
          }));
                  
      var editor = that.createAttributeEditor(key, type, unique, value, availableAttributes, $(this));
      
      editor.bind('changed', function() {        
        var attrs = [];
        var availableAttributes = that.availableAttributes(property);
        
        _.each(editor.value(), function(val) {
          // Find existing attribute
          var attr = graph.find({
            "type|=": ['/type/attribute'],
            member_of: member_of,
            name: val
          }).first();
          
          if (!attr) {
            // Create attribute as it doesn't exist
            attr = graph.set(null, {
              type: ["/type/attribute"],
              member_of: member_of,
              name: val
            });
          }
          attrs.push(attr._id);
        });
        
        // Update document
        var tmp = {};
        tmp[key] = attrs;
        app.document.model.set(tmp);
        app.document.trigger('changed');
      });
    });
  },
  
  createAttributeEditor: function(key, type, unique, value, availableValues, target) {
    switch (type) {
      case 'string':
        if (unique) {
          return this.createStringEditor(key, value, availableValues, target);
        } else {
          return this.createMultiStringEditor(key, value, availableValues, target);
        }
      break;
      case 'number':
      break;
      case 'boolean':
      break;
    }
  },
  
  createMultiStringEditor: function(key, value, availableValues, target) {
    var that = this;
    var editor = new UI.MultiStringEditor({
      el: target,
      items: value,
      availableItems: availableValues
    });
    return editor;
  },
  
  createStringEditor: function(key, availableValues, target) {
    var that = this;
    var editor = new UI.StringEditor({
      el: target,
      value: value,
      availableItems: availableValues
    });
    return editor;
  }
});

// AddCriterion
// ---------------

var AddCriterion = function(app, options) {
  this.app = app;
  this.options = options;
};

// [c1, c2, !c1]  => [c2]
AddCriterion.prototype.matchesInverse = function(other) {
  return (
    other instanceof RemoveCriterion && 
    this.options.property === other.options.property && 
    this.options.operator === 'CONTAINS' && other.options.operator === 'CONTAINS' &&
    this.options.value === other.options.value
  );
};

// [c1, c2, c1~]  => [c1~, c2]
// eg. c1 = population > 2000000, c1~ = population > 10000000
AddCriterion.prototype.matchesOverride = function() {
  // TODO: implement
};

AddCriterion.prototype.execute = function() {
  this.graph = app.browser.graph;
  
  var criterion = new Data.Criterion(this.options.operator, '/type/document', this.options.property, this.options.value);
  app.browser.graph = app.browser.graph.filter(criterion);
  
  this.app.facets.addChoice(this.options.property, this.options.operator, this.options.value);
};

AddCriterion.prototype.unexecute = function() {
  app.browser.graph = this.graph; // restore the old state
  this.app.facets.removeChoice(this.options.property, this.options.operator, this.options.value);
};


// RemoveCriterion
// ---------------

var RemoveCriterion = function(app, options) {
  this.app = app;
  this.options = options;
};

RemoveCriterion.prototype.execute = function() {
  // won't be executed
};

RemoveCriterion.prototype.unexecute = function() {
  // won't be unexecuted
};

var DocumentBrowser = Backbone.View.extend({
  events: {
    'click a.add-criterion': 'addCriterion',
    'click a.remove-criterion': 'removeCriterion'
  },
  
  addCriterion: function(e) {
    var property = $(e.currentTarget).attr('property'),
        operator = $(e.currentTarget).attr('operator'),
        value = $(e.currentTarget).attr('value');
    
    this.applyCommand({command: 'add_criterion', options: {
      property: property,
      operator: operator,
      value: value
    }});
    this.render();
    return false;
  },
  
  removeCriterion: function(e) {
    var property = $(e.currentTarget).attr('property'),
        operator = $(e.currentTarget).attr('operator'),
        value = $(e.currentTarget).attr('value');

    this.applyCommand({command: 'remove_criterion', options: {
      property: property,
      operator: operator,
      value: value
    }});
    this.render();
    return false;
  },
  
  initialize: function(options) {
    var that = this;
    this.app = options.app;
    this.browserTab = new BrowserTab({el: '#browser_tab', browser: this});
    this.documents = [];
    this.commands = [];
  },
  
  // Modfies query state (reflected in the BrowserTab)
  load: function(query) {
    var that = this;
    this.query = query;
    this.graph = new Data.Graph(seed);
    
    $('#browser_tab').show().html('&nbsp;&nbsp;&nbsp;Loading documents...');
    $('#browser_wrapper').html('');
    $.ajax({
      type: "GET",
      url: "/documents/"+query.type+"/"+encodeURI(query.value),
      dataType: "json",
      success: function(res) {
        that.graph.merge(res.graph);
        that.facets = new Facets({el: '#facets', browser: that});
        that.loaded = true;
        that.trigger('loaded');
        that.render();
      },
      error: function(err) {}
    });
  },
  
  render: function() {
    var that = this;
    if (this.loaded) {
      this.documents = this.graph.find({"type|=": "/type/document"});
      var DESC_BY_UPDATED_AT = function(item1, item2) {
        var v1 = item1.value.get('updated_at'),
            v2 = item2.value.get('updated_at');
        return v1 === v2 ? 0 : (v1 > v2 ? -1 : 1);
      };
      
      this.documents = this.documents.sort(DESC_BY_UPDATED_AT);
      $(this.el).html(_.tpl('document_browser', {
        documents: this.documents
      }));
      
      if (this.loaded) this.facets.render();
      this.browserTab.render();
    }
  },
  
  // Takes a command spec and applies the command
  applyCommand: function(spec) {
    var cmd;
    
    if (spec.command === 'add_criterion') {
      cmd = new AddCriterion(this, spec.options);
    } else if (spec.command === 'remove_criterion') {
      cmd = new RemoveCriterion(this, spec.options);
    }

    // remove follow-up commands (redo-able commands)
    if (this.currentCommand < this.commands.length-1) {
      this.commands.splice(this.currentCommand+1);
    }

    // insertion position
    var pos = undefined;
    $.each(this.commands, function(index, c) {
      if (c.matchesInverse(cmd)) {
        pos = index;
      }
    });

    if (pos >= 0) {
      // restore state
      this.commands[pos].unexecute();
      // remove matched inverse command
      this.commands.splice(pos, 1);
      // execute all follow-up commands [pos..this.commands.length-1]
      for (var i=pos; i < this.commands.length; i++) {
        this.commands[i].execute();
      }
    } else {
      this.commands.push(cmd);
      cmd.execute();
    }

    this.currentCommand = this.commands.length-1;
    return cmd;
  },
  
  undo: function() {
    if (this.currentCommand >= 0) {
      this.commands[this.currentCommand].unexecute();
      this.currentCommand -= 1;
      this.render();    
    }
  },

  redo: function() {
    if (this.currentCommand < this.commands.length-1) {
      this.currentCommand += 1;
      this.commands[this.currentCommand].execute();
      this.render();    
    }
  }
});

var Facets = Backbone.View.extend({
  
  initialize: function(options) {
    this.browser = options.browser;
    this.facetChoices = {};
  },
  
  select: function(property) {
    $('.facet').removeClass('selected');
    $('#facet_'+property).toggleClass('selected');
  },
  
  addChoice: function(property, operator, value) {
    // TODO: build flexible lookup for arbitrary operators (GT, LT etc.)
    this.facetChoices[property+'::'+operator+'::'+value] = true;
  },
  
  removeChoice: function(property, operator, value) {
    delete this.facetChoices[property+'::'+operator+'::'+value];
  },
  
  buildView: function() {
    var that = this;
    var view = {facets: []};
    
    // Properties for all registered document_types
    var properties = new Data.Hash();
    app.browser.graph.get('/config/substance').get('document_types').each(function(type, key) {
      properties = properties.union(app.browser.graph.get(type).properties());
    });
    
    app.browser.graph.get('/type/document').all('properties').each(function(property, key) {
      if (property.meta.facet) {
        var facet_choices = [];
        var selected_facet_choices = [];
        property.all("values").each(function(value) {
          if (that.facetChoices[key+'::CONTAINS::'+value._id] === true) {
            selected_facet_choices.push({key: escape(value._id), value: value.toString(), item_count: value.referencedObjects.length});
          } else {
            facet_choices.push({key: escape(value._id), value: value.toString(), item_count: value.referencedObjects.length});
          }
        });
        
        if (facet_choices.length + selected_facet_choices.length > 0) {
          view.facets.push({
            property: key,
            property_name: property.name,
            facet_choices: facet_choices,
            selected_facet_choices: selected_facet_choices
          });
        }
      }
    });
    return view;
  },
  
  render: function() {
    var that = this;
    $(this.el).html(_.renderTemplate('facets', this.buildView()));
  }
});

var Collaborators = Backbone.View.extend({
  
  initialize: function() {
    this.render();
  },
  
  render: function() {    
    $(this.el).html(Helpers.renderTemplate('collaborators', {
      status: app.editor.status,
      id: app.editor.model.id,
      author: app.editor.model.author,
      name: app.editor.model.name,
      hostname: window.location.hostname + (window.location.port !== 80 ? ":" + window.location.port : "")
    }));
  }
});

var UserSettings = Backbone.View.extend({
  events: {
    'submit form': 'updateUser'
  },
  
  updateUser: function() {
    if (this.$('#user_password').val() === "" || this.$('#user_password').val() === this.$('#user_password_confirmation').val()) {
      $.ajax({
        type: "POST",
        url: "/updateuser",
        data: {
          username: this.$('#user_username').val(),
          name: this.$('#user_name').val(),
          email: this.$('#user_email').val(),
          password: this.$('#user_password').val(),
          website: this.$('#user_website').val(),
          company: this.$('#user_company').val(),
          location: this.$('#user_location').val()
        },
        dataType: "json",
        success: function(res) {
          if (res.status === 'error') {
            notifier.notify({
              message: 'An error occured. Check your input',
              type: 'error'
            });
          } else {
            graph.merge(res.seed);
            app.username = res.username;
            app.render();
            
            app.document.closeDocument();
            app.browser.load(app.query());

            app.browser.bind('loaded', function() {
              app.toggleView('browser');
            });

            controller.saveLocation('#'+app.username);
          }
        },
        error: function(err) {
          notifier.notify({
            message: 'An error occured. Check your input',
            type: 'error'
          });
        }
      });
    } else {
      notifier.notify({
        message: 'Password and confirmation do not match.',
        type: 'error'
      });
    }
    return false;
  },
  
  initialize: function() {
    
  },
  
  render: function() {
    $(this.el).html(_.tpl('user_settings', {
      user: graph.get('/user/'+app.username)
    }));
  }
});
var NewDocument = Backbone.View.extend({
  
  initialize: function() {
    
  },
  
  render: function() {    
    $(this.el).html(_.tpl('new_document', {}));
  }
});
var BrowserTab = Backbone.View.extend({
  events: {
    'submit #search_form': 'loadDocuments',
    'keydown #search': 'search',
    'focus #search': 'focusSearch',
    'blur #search': 'blurSearch'
  },
  
  focusSearch: function(e) {
    this.searchValue = $(e.currentTarget).val();
    this.active = true;
    $(e.currentTarget).val('');
  },
  
  blurSearch: function(e) {
    var that = this;
    this.active = false;
    setTimeout(function() {
      that.render();
    }, 200);
  },
  
  // Performs a search on the document repository based on a search string
  // Returns a list of matching user names and one entry for matching documents
  search: function(e) {
    if (e.keyCode === 27) return this.blurSearch();
    var that = this;
    if ($('#search').val() === '') return;
    
    if (!that.pendingSearch) {
      that.pendingSearch = true;
      setTimeout(function() {
        that.pendingSearch = false;
        
        if (that.active && $('#search').val() !== '') {
          
          $.ajax({
             type: "GET",
             url: "/search/"+encodeURI($('#search').val()),
             dataType: "json",
             success: function(res) {               
               // Render results
               that.$('.results').html('');
               that.$('.results').append($('<a href="#search/'+encodeURI($('#search').val())+'" class="result-item documents">'+res.document_count+' Documents / '+Object.keys(res.users).length+' Users</a>'));
               _.each(res.users, function(user, key) {
                 that.$('.results').append($('<a href="#'+user.username+'" class="result-item user"><div class="username">'+user.username+'</div><div class="full-name">'+(user.name ? user.name : '')+'</div><div class="count">User</div></a>'));
               });
               $('#browser_tab .results').show();
             },
             error: function(err) {}
           });
        }
        // Sanitize on every registered change
      }, 500);
    }
  },
  
  // Finally perform a real search
  loadDocuments: function() {
    app.searchDocs($('#search').val());
    this.active = false;
    return false;
  },
  
  loadUser: function() {
    
  },
  
  initialize: function(options) {
    this.browser = options.browser;
  },
  
  render: function() {
    var queryDescr;
    
    if (this.browser.query) {
      queryDescr = this.browser.query.type === 'user'
                       ? this.browser.query.value+"'s documents"
                       : 'Documents for &quot;'+this.browser.query.value+'&quot;';
    } else {
      queryDescr = 'Type to search ...';
    }
    
    $(this.el).html(_.tpl('browser_tab', {
      documents: this.browser.documents,
      query_descr: queryDescr
    }));
  }
});


var Header = Backbone.View.extend({
  events: {
    'focus #login-user': 'focusUser',
    'blur #login-user': 'blurUser',
    'focus #login-password': 'focusPassword',
    'blur #login-password': 'blurPassword'
  },
  
  initialize: function(options) {
    
  },
  
  focusUser: function(e) {
    var input = $(e.currentTarget)
    if (input.hasClass('hint')) {
      input.val('');
      input.removeClass('hint');
    }
  },
  
  blurUser: function(e) {
    var input = $(e.currentTarget)
    if (input.val() === '') {
      input.addClass('hint');
      input.val('username');
    }
  },
  
  focusPassword: function(e) {
    var input = $(e.currentTarget)
    if (input.hasClass('hint')) {
      input.val('');
      input.removeClass('hint');
    }
  },
  
  blurPassword: function(e) {
    var input = $(e.currentTarget)
    if (input.val() === '') {
      input.addClass('hint');
      input.val('password');
    }
  },

  render: function() {
    var username = this.options.app.username;
    // Render login-state
    $(this.el).html(_.tpl('header', {
      user: graph.get('/user/'+username)
    }));
  }
});
// The Application
// ---------------

// This is the top-level piece of UI.
var Application = Backbone.View.extend({
  events: {
    'click .toggle-new-document': 'toggleNewDocument',
    'click a.scroll-to': 'triggerScrollTo',
    'click .new-document': 'newDocument',
    'click #dashboard_toggle': 'showDashboard',
    'click #document_toggle': 'showDocument',
    'click a.load-document': 'loadDocument',
    'click a.save-document': 'saveDocument',
    'click a.logout': 'logout',
    'click a.signup': 'toggleSignup',
    'click .tab': 'switchTab',
    'click a.show-attributes': 'showAttributes',
    'click a.publish-document': 'publishDocument',
    'click a.unpublish-document': 'unpublishDocument',
    'submit #create_document': 'createDocument',
    'submit #login-form': 'login',
    'click a.delete-document': 'deleteDocument',
    'click a.view-collaborators': 'viewCollaborators',
    'click a.toggle-document-views': 'toggleDocumentViews',
    'click a.toggle-signup': 'toggleSignup',
    'click a.toggle-startpage': 'toggleStartpage',
    'click a.toggle-edit-mode': 'toggleEditMode',
    'click a.toggle-show-mode': 'toggleShowMode',
    'click a.toggle-user-settings': 'toggleUserSettings',
    'submit #signup-form': 'registerUser'
  },

  login: function(e) {
    this.authenticate();
    return false;
  },
  
  triggerScrollTo: function(e) {
    this.scrollTo($(e.currentTarget).attr('href'));
    return false;
  },
  
  newDocument: function() {
    this.content = new NewDocument({el: '#content_wrapper'});
    this.content.render();
    
    this.toggleView('content');
    return false;
  },
  
  toggleUserSettings: function() {
    this.content = new UserSettings({el: '#content_wrapper'});
    this.content.render();
    this.toggleView('content');    
    return false;
  },
  
  toggleSignup: function() {
    app.browser.browserTab.render();
    $('#content_wrapper').html(_.tpl('signup'));
    app.toggleView('content');
    return false;
  },
  
  toggleStartpage: function() {
    app.browser.browserTab.render();
    $('#content_wrapper').html(_.tpl('startpage'));
    app.toggleView('content');
    return false;
  },
  
  searchDocs: function(searchstr) {
    app.browser.load({"type": "search", "value": encodeURI(searchstr)});
    $('#browser_wrapper').attr('url', '#search/'+encodeURI(searchstr));
    
    app.browser.bind('loaded', function() {
      app.toggleView('browser');
    });
  },
  
  switchTab: function(e) {
    this.toggleView($(e.currentTarget).attr('view'));
  },
  
  toggleView: function(view) {
    $('.tab').removeClass('active');
    $('#'+view+'_tab').addClass('active');
    if (view === 'browser' && !this.browser.loaded) return;
    $('.view').hide();
    $('#'+view+'_wrapper').show();
    controller.saveLocation($('#'+view+'_wrapper').attr('url'));
    return false;
  },
  
  createDocument: function(e) {
    var that = this;
    var name = $('#create_document input[name=new_document_name]').val();
    var type = $('#create_document select[name=document_type]').val();
    
    if (new RegExp(graph.get('/type/document').get('properties', 'name').validator).test(name)) {
      
      // TODO: find a more efficient way to check for existing docs.
      $.ajax({
        type: "GET",
        url: "/readdocument",
        data: {
          creator: app.username,
          name: name
        },
        dataType: "json",
        success: function(res) {
          if (res.status === 'error') {
            that.document.newDocument(type, name);
          } else {
            $('#create_document input[name=new_document_name]').addClass('error');
            $('#new_document_name_message').html('This document name is already taken.');            
          }
        },
        error: function(err) {
          $('#document_wrapper').html('Document loading failed');
        }
      });
      
      return false;
    } else {
      $('#create_document input[name=new_document_name]').addClass('error');
      $('#new_document_name_message').html('Invalid document name. No spaces or special characters allowed.');
    }
    return false;
  },
  
  toggleEditMode: function(e) {
    var user = app.document.model.get('creator').get('username');
    var name = app.document.model.get('name');
    
    app.document.loadDocument(user, name, null, 'edit');
    return false;
  },
  
  toggleShowMode: function(e) {
    var user = app.document.model.get('creator').get('username');
    var name = app.document.model.get('name');
    
    app.document.loadDocument(user, name, null, 'show');
    return false;
  },
  
  loadDocument: function(e) {
      var user = $(e.currentTarget).attr('user');
          name = $(e.currentTarget).attr('name');

      app.document.loadDocument(user, name);
      if (controller) {
        controller.saveLocation($(e.currentTarget).attr('href'));
        $('#document_wrapper').attr('url', $(e.currentTarget).attr('href'));
      }
    return false;
  },
  
  // Handle top level events
  // -------------
  
  showAttributes: function() {
    app.document.drawer.toggle('Attributes');
    $('.show-attributes').toggleClass('selected');
    return false;
  },
  
  logout: function() {
    var that = this;
    
    $.ajax({
      type: "POST",
      url: "/logout",
      dataType: "json",
      success: function(res) {
        that.username = null;
        that.authenticated = false;
        that.document.closeDocument();
        that.browser.loaded = false;
        that.browser.render();
        that.render();
        $('#document_tab').hide();
        
        app.toggleStartpage();
        
        controller.saveLocation('');
        $('.new-document').hide();
      }
    });
    return false;
  },
  
  deleteDocument: function(e) {
    if (confirm('Are you sure to delete this document?')) {
      this.document.deleteDocument(app.document.model._id);
      this.document.closeDocument();
    }
    return false;
  },
  
  // Application Setup
  // -------------
  
  updateSystemStatus: function(status) {
    this.activeUsers = status.active_users;
  },
  
  query: function() {
    return this.authenticated ? { "type": "user", "value": this.username }
                              : { "type": "user", "value": "demo" }
  },
  
  initialize: function() {
    var that = this;
    
    // Initialize browser
    this.browser = new DocumentBrowser({
      el: this.$('#browser_wrapper'),
      app: this
    });
    
    // Initialize document
    this.document = new Document({el: '#document_wrapper', app: this});
    this.header = new Header({el: '#header', app: this});
    this.activeUsers = [];
    
    // Try to establish a server connection
    // this.connect();
    // this.bind('connected', function() {
    //   notifier.notify(Notifications.CONNECTED);
    // });
    
    // Cookie-based auto-authentication
    if (session.username) {
      graph.merge(session.seed);
      this.authenticated = true;
      this.username = session.username;
      this.trigger('authenticated');
      $('#tabs').show();
      $('.new-document').show();
    } else {
      this.authenticated = false;
    }
    
    this.bind('authenticated', function() {
      that.authenticated = true;
      // Re-render browser
      $('#tabs').show();
      $('.new-document').show();
      that.render();
      that.document.closeDocument();
      that.browser.load(that.query());
      
      that.browser.bind('loaded', function() {
        that.toggleView('browser');
      });
      
      controller.saveLocation('#'+that.username);
    });
    
    that.render();
  },
  
  connect: function() {
    var that = this;
    
    DNode({
      Session: {
        updateStatus: function(status) {
          that.document.status = status;
          that.document.trigger('status:changed');
        },
        
        updateSystemStatus: function(status) {
          that.updateSystemStatus(status);
        },
        
        updateNode: function(key, node) {
          app.document.updateNode(key, node);
        },
        
        moveNode: function(sourceKey, targetKey, parentKey, destination) {
          throw 'Not implemented';
        },
        
        insertNode: function(insertionType, node, targetKey, parentKey, destination) {
          if (insertionType === 'sibling') {
            app.document.addSibling(node, targetKey, parentKey, destination);
          } else { // inserionType === 'child'
            app.document.addChild(node, targetKey, parentKey, destination);
          }
        },
        
        removeNode: function(key, parentKey) {
          app.document.removeNode(key, parentKey);
        },
        
        // The server asks for the current (real-time) version of the document
        getDocument: function(callback) {
          var result = that.getFullDocument(app.document.model._id);
          callback(result);
        }
      }
    }).connect(function (remoteHandle) {
      // For later use store a reference to the remote object
      remote = remoteHandle;      
      that.trigger('connected');
    });
  },
  
  getFullDocument: function(id) {    
    var result = {};
    function addNode(id) {
      if (!result[id]) {
        var n = graph.get(id);
        result[id] = n.toJSON();

        // Resolve associated Nodes
        n.type.all('properties').each(function(p) {
          if (p.isObjectType()) {
            n.all(p.key).each(function(obj) {
              if (obj.type) addNode(obj._id);
            });
          }
        });
      }
    }
    addNode(id);
    return result;
  },
  
  authenticate: function() {
    var that = this;
    
    $.ajax({
      type: "POST",
      url: "/login",
      data: {
        username: $('#login-user').val(),
        password: $('#login-password').val()
      },
      dataType: "json",
      success: function(res) {
        if (res.status === 'error') {
          return notifier.notify(Notifications.AUTHENTICATION_FAILED);
        } else {
          graph.merge(res.seed);
          that.username = res.username;
          that.trigger('authenticated');
        }
      },
      error: function(err) {
        notifier.notify(Notifications.AUTHENTICATION_FAILED);
      }
    });
    return false;
  },
  
  // Scroll to an element
  scrollTo: function(selector) {
    var offset = $(selector).offset();
    offset ? $('html, body').animate({scrollTop: offset.top}, 'slow') : null;
    return false;
  },
  
  registerUser: function() {
    var that = this;
    
    $('.page-content .input-message').empty();
    $('#registration_error_message').empty();
    $('.page-content input').removeClass('error');
    
    $.ajax({
      type: "POST",
      url: "/register",
      data: {
        username: $('#signup_user').val(),
        name: $('#signup_name').val(),
        email: $('#signup_email').val(),
        password: $('#signup_password').val()
      },
      dataType: "json",
      success: function(res) {
        if (res.status === 'error') {
          if (res.field === "username") {
            $('#signup_user').addClass('error');
            $('#signup_user_message').html(res.message);
          } else {
            $('#registration_error_message').html(res.message);
          }
        } else {
          graph.merge(res.seed);
          notifier.notify(Notifications.AUTHENTICATED);
          that.username = res.username;
          that.trigger('authenticated');
        }
      },
      error: function(err) {
        $('#registration_error_message').html('Unknown error.');
      }
    });
    
    return false;
  },
  
  // Should be rendered just once
  render: function() {
    var that = this;
    this.document.render();
    this.browser.render();
    this.header.render();
    
    return this;
  }
});

Data.setAdapter('AjaxAdapter');

var remote,                              // Remote handle for server-side methods
    app,                                 // The Application
    controller,                          // Controller responding to routes
    editor,                              // A global instance of the Proper Richtext editor
    graph = new Data.Graph(seed, false); // The database

(function() {
  $(function() {
    
    function scrollTop() {
      return document.body.scrollTop || document.documentElement.scrollTop;
    }
    
    // Start the engines
    app = new Application({el: $('#container'), session: session});
    
    // Set up a global instance of the Proper Richtext Editor
    editor = new Proper();
    
    // Initialize controller
    controller = new ApplicationController({app: this});
    
    // Start responding to routes
    Backbone.history.start();
    
    var pendingSync = false;
    graph.bind('dirty', function() {
      // Reload document browser      
      if (!pendingSync) {
        pendingSync = true;
        setTimeout(function() {
          $('#sync_state').html('Synchronizing...');
          graph.sync(function(err, invalidNodes) {
            if (!err && invalidNodes.length === 0) {
              $('#sync_state').html('Successfully synced.');
              setTimeout(function() {
                $('#sync_state').html('');
              }, 3000);
              pendingSync = false;
            } else {
              $('#sync_state').html(err || 'Error during sync. Reload!.');
            }
          });
        }, 3000);
      }
    });
    
    graph.bind('conflicted', function() {
      if (!app.document.model) return;
      graph.fetch({
        creator: app.document.model.get('creator')._id,
        name: app.document.model.get('name')
      }, {expand: true}, function(err) {
        app.document.render();
        app.scrollTo('#document_wrapper');
      });
      notifier.notify({
        message: 'There are conflicting nodes. The Document will be reset for your own safety.',
        type: 'error'
      });

    });
  });
})();
