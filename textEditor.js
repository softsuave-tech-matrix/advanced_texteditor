class TextEditor {
  constructor(selector, props = {}) {
    this.container = document.querySelector(selector);
    this.container && (this.container.className = "ate_editor");
    this.toolbar = document.createElement("div");
    this.content = document.createElement("div");
    this.bottomBar = document.createElement("div");
    this.bottomBar.className = "ate_bottom_bar";
    this.toolbar.className = "ate_toolbar";
    this.content.contentEditable = true;
    this.container && this.container.appendChild(this.toolbar);
    this.container && this.container.appendChild(this.content);
    this.container && this.container.appendChild(this.bottomBar);
    this.selection = null;
    this.props = props;
    this.props.enableToolbarDefault = this.props.toolbar ? false : true;
    this.content.style = props.style || "max-height: 20vh;";
    this.sourceMode = false;
    this.micStatus = false;
    this.history = [];
    this.currentPosition = -1;
    this.value = "";
    this.tarNode = null;
    globalThis._this = this;
    this.initializeToolbar();
    this.setupEventListeners();
    this.updateUndoRedo();
    this.wordToNum = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
    };
  }

  initializeToolbar() {
    const buttons = [
      { type: "button", label: "Bold", style: "bold", innerHTML: "<b>B</b>" },
      {
        type: "button",
        label: "Italic",
        style: "italic",
        innerHTML: "<i>I</i>",
      },
      {
        type: "button",
        label: "Underline",
        style: "underline",
        innerHTML: "<u>U</u>",
      },
      {
        type: "button",
        label: "Strike Through",
        style: "strikeThrough",
        innerHTML: "<s>S</s>",
      },
      {
        type: "button",
        label: "Super Script",
        style: "superscript",
        innerHTML:
          '<svg width="25px" height="25px" focusable="false"><path d="M15 9.4 10.4 14l4.6 4.6-1.4 1.4L9 15.4 4.4 20 3 18.6 7.6 14 3 9.4 4.4 8 9 12.6 13.6 8 15 9.4Zm5.9 1.6h-5v-1l1-.8 1.7-1.6c.3-.5.5-.9.5-1.3 0-.3 0-.5-.2-.7-.2-.2-.5-.3-.9-.3l-.8.2-.7.4-.4-1.2c.2-.2.5-.4 1-.5.3-.2.8-.2 1.2-.2.8 0 1.4.2 1.8.6.4.4.6 1 .6 1.6 0 .5-.2 1-.5 1.5l-1.3 1.4-.6.5h2.6V11Z" fill-rule="nonzero"></path></svg>',
      },
      {
        type: "button",
        label: "Sub Script",
        style: "subscript",
        innerHTML:
          '<svg width="25px" height="25px" focusable="false"><path d="m10.4 10 4.6 4.6-1.4 1.4L9 11.4 4.4 16 3 14.6 7.6 10 3 5.4 4.4 4 9 8.6 13.6 4 15 5.4 10.4 10ZM21 19h-5v-1l1-.8 1.7-1.6c.3-.4.5-.8.5-1.2 0-.3 0-.6-.2-.7-.2-.2-.5-.3-.9-.3a2 2 0 0 0-.8.2l-.7.3-.4-1.1 1-.6 1.2-.2c.8 0 1.4.3 1.8.7.4.4.6.9.6 1.5s-.2 1.1-.5 1.6a8 8 0 0 1-1.3 1.3l-.6.6h2.6V19Z" fill-rule="nonzero"></path></svg>',
      },
      {
        type: "select",
        label: "Heading",
        style: "formatBlock",
        options: [
          {
            type: "option",
            value: "H1",
            label: "Heading 1",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "H2",
            label: "Heading 2",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "H3",
            label: "Heading 3",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "H4",
            label: "Heading 4",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "H5",
            label: "Heading 5",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "H6",
            label: "Heading 6",
            style: "strikeThrough",
          },
          {
            type: "option",
            value: "P",
            label: "Paragraph",
            style: "strikeThrough",
          },
        ],
      },
      {
        type: "button",
        label: "Justify Left",
        style: "justifyLeft",
        innerHTML:
          '<svg width="20px" height="20px" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>',
      },
      {
        type: "button",
        label: "Justify Center",
        style: "justifyCenter",
        innerHTML:
          '<svg width="20px" height="20px" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>',
      },
      {
        type: "button",
        label: "Justify Right",
        style: "justifyRight",
        innerHTML:
          '<svg width="20px" height="20px" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>',
      },
      {
        type: "button",
        label: "Justify",
        style: "justifyFull",
        innerHTML:
          '<svg width="20px" height="20px" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>',
      },
      {
        type: "button",
        label: "Ordered List",
        style: "insertOrderedList",
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48" fill="none"><path d="M9 4V13" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13H6" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 27H6" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 19.9999C6 19.9999 9 16.9999 11 20C13 23 6 27 6 27" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.00001 34.5001C6.00001 34.5001 8.00001 31.5 11 33.5C14 35.5 11 38 11 38C11 38 14 40.5 11 42.5C8 44.5 6 41.5 6 41.5" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 38H9" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4L6 6" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 24H43" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 38H43" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 10H43" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      {
        type: "button",
        label: "Unordered List",
        style: "insertUnorderedList",
        innerHTML:
          '<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 -4 28 28" version="1.1"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-570.000000, -209.000000)" fill="#000000"><path d="M597,226 L579,226 C578.447,226 578,226.448 578,227 C578,227.553 578.447,228 579,228 L597,228 C597.553,228 598,227.553 598,227 C598,226.448 597.553,226 597,226 L597,226 Z M572,209 C570.896,209 570,209.896 570,211 C570,212.104 570.896,213 572,213 C573.104,213 574,212.104 574,211 C574,209.896 573.104,209 572,209 L572,209 Z M579,212 L597,212 C597.553,212 598,211.553 598,211 C598,210.447 597.553,210 597,210 L579,210 C578.447,210 578,210.447 578,211 C578,211.553 578.447,212 579,212 L579,212 Z M597,218 L579,218 C578.447,218 578,218.448 578,219 C578,219.553 578.447,220 579,220 L597,220 C597.553,220 598,219.553 598,219 C598,218.448 597.553,218 597,218 L597,218 Z M572,217 C570.896,217 570,217.896 570,219 C570,220.104 570.896,221 572,221 C573.104,221 574,220.104 574,219 C574,217.896 573.104,217 572,217 L572,217 Z M572,225 C570.896,225 570,225.896 570,227 C570,228.104 570.896,229 572,229 C573.104,229 574,228.104 574,227 C574,225.896 573.104,225 572,225 L572,225 Z" id="bullet-list" sketch:type="MSShapeGroup"></path></g></g></svg>',
      },
      {
        type: "button",
        label: "Horizontal Rule",
        style: "insertHorizontalRule",
        innerHTML: '<span style="padding:0;font-size: 17px;">HR</span>',
      },
      {
        type: "sourceMode",
        label: "HTML",
        style: "html",
        onClick: () => this.toggleSource(),
        innerHTML: '<span style="font-size:17px">HTML</span>',
      },
      {
        type: "button",
        label: "PRE",
        style: "pre",
        innerHTML: '<span style="font-size:17px">&#60;&#47;&#62;</span>',
      },
      {
        type: "button",
        label: "Indent",
        style: "indent",
        innerHTML: "&#10140;",
      },
      {
        type: "button",
        label: "Outdent",
        style: "outdent",
        innerHTML: "&#10141;",
      },
      {
        type: "button",
        label: "Link",
        style: "createLink",
        onClick: () => {
          var url = window.prompt("Enter the URL:");

          if (url) {
            this.execCmd("createLink", url);
          }
        },
        innerHTML: '<span style="font-size:16px">&#128279;</span>',
      },
      {
        type: "button",
        label: "Unlink",
        style: "unlink",
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 509.84" with="20px" height="20px"><path fill-rule="nonzero" d="M245.14 352.14c8.49-8.49 22.27-8.49 30.76 0 8.5 8.5 8.5 22.27 0 30.76l-58.53 58.54c-20.35 20.34-47.15 30.51-73.94 30.51s-53.6-10.17-73.94-30.51c-20.34-20.35-30.52-47.15-30.52-73.94 0-26.78 10.18-53.6 30.52-73.94l58.53-58.53c8.5-8.5 22.27-8.5 30.77 0 8.49 8.49 8.49 22.27 0 30.76l-58.54 58.53c-11.84 11.85-17.77 27.51-17.77 43.18 0 15.67 5.93 31.33 17.77 43.17 11.85 11.85 27.51 17.78 43.18 17.78 15.67 0 31.33-5.93 43.17-17.77l58.54-58.54zm46.1-92.68c8.47 8.48 8.47 22.24 0 30.71-8.48 8.47-22.23 8.47-30.71 0l-39.78-39.78c-8.47-8.48-8.47-22.23 0-30.71 8.48-8.47 22.23-8.47 30.71 0l39.78 39.78zm45.28 245.07-25.07 5.19c-3.24.66-6.43-1.44-7.09-4.68l-16.18-78.09a6.006 6.006 0 0 1 4.66-7.11l25.05-5.29c3.27-.65 6.45 1.44 7.11 4.69l16.21 78.2c.66 3.25-1.44 6.43-4.69 7.09zM178.82 6.26 203.39.18c3.22-.8 6.48 1.17 7.28 4.38l19.46 77.29c.8 3.23-1.16 6.5-4.39 7.31l-24.8 6.28c-3.23.8-6.5-1.16-7.31-4.38l-19.46-77.43c-.81-3.23 1.16-6.5 4.38-7.31l.27-.06zm264.17 419.63-17.86 18.43a6.03 6.03 0 0 1-8.52 0l-57.22-55.51a6.015 6.015 0 0 1-.11-8.5l17.8-18.39c2.32-2.38 6.13-2.44 8.51-.12l57.28 55.58a6.027 6.027 0 0 1 .12 8.51zm68.81-112.11-6.62 24.69c-.85 3.21-4.15 5.12-7.37 4.26l-77.08-20.62c-3.22-.86-5.12-4.16-4.27-7.38l6.64-24.72c.86-3.21 4.16-5.12 7.38-4.27l77.05 20.67c3.21.85 5.12 4.16 4.27 7.37zM.38 201.65l6.97-24.15a6.025 6.025 0 0 1 7.42-4.11l76.66 21.79c3.2.91 5.05 4.25 4.15 7.45l-6.96 24.61a6.034 6.034 0 0 1-7.42 4.17L4.38 209.55a6.035 6.035 0 0 1-4.15-7.45l.15-.45zM65.14 87.17l17.84-17.81c2.35-2.34 6.17-2.33 8.51.02l56.38 56.41c2.33 2.35 2.33 6.15 0 8.49l-18.06 18.11a6.014 6.014 0 0 1-8.5.02L64.85 95.97a6.03 6.03 0 0 1 0-8.52l.29-.28zm200.98 71.28c-8.49 8.5-22.27 8.5-30.76 0-8.5-8.49-8.5-22.26 0-30.76l59.26-59.26 1.38-1.27c20.23-19.51 46.43-29.26 72.56-29.26 26.78 0 53.58 10.18 73.93 30.53 20.35 20.35 30.53 47.16 30.53 73.94 0 26.79-10.18 53.59-30.52 73.94l-59.26 59.26c-8.5 8.49-22.27 8.49-30.77 0-8.49-8.49-8.49-22.27 0-30.76l59.27-59.27c11.84-11.84 17.77-27.5 17.77-43.17 0-15.67-5.93-31.33-17.77-43.17-11.86-11.86-27.52-17.79-43.18-17.79-15.3 0-30.55 5.59-42.22 16.76l-60.22 60.28z"/></svg>',
      },
      {
        type: "button",
        label: "",
        style: "undoRedo",
        parent: "bottom",
        onClick: () => {
          this.undo();
        },
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" viewBox="0 0 329.937 329.937" xml:space="preserve"><path id="XMLID_6_" d="M317.86,60.862l-86.666-17.238c-8.124-1.612-16.021,3.661-17.638,11.785l-17.24,86.668  c-1.616,8.125,3.66,16.023,11.785,17.639c0.988,0.196,1.973,0.291,2.943,0.291c7.01,0,13.276-4.939,14.696-12.076l10.711-53.851  c22.66,41.719,16.365,95.225-18.79,130.38c-21.441,21.44-49.596,32.159-77.76,32.157c-28.157-0.003-56.323-10.722-77.759-32.157  c-42.876-42.876-42.876-112.642,0-155.518c5.858-5.857,5.858-15.355,0-21.213c-5.857-5.857-15.355-5.857-21.213,0  c-54.573,54.573-54.573,143.37,0,197.943c27.29,27.29,63.125,40.934,98.972,40.93c35.838-0.003,71.689-13.647,98.973-40.93  c26.317-26.317,40.876-61.307,40.995-98.523c0.076-23.59-5.662-46.318-16.525-66.544l48.664,9.68  c8.127,1.613,16.022-3.66,17.638-11.786C331.262,70.375,325.985,62.479,317.86,60.862z"/></svg>',
      },
      {
        type: "button",
        label: "",
        style: "undoRedo",
        parent: "bottom",
        onClick: () => {
          this.redo();
        },
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><g id="Edit / Redo"><path id="Vector" d="M13.9998 8H18.9998V3M18.7091 16.3569C17.7772 17.7918 16.4099 18.8902 14.8079 19.4907C13.2059 20.0913 11.4534 20.1624 9.80791 19.6937C8.16246 19.225 6.71091 18.2413 5.66582 16.8867C4.62073 15.5321 4.03759 13.878 4.00176 12.1675C3.96593 10.4569 4.47903 8.78001 5.46648 7.38281C6.45392 5.98561 7.86334 4.942 9.48772 4.40479C11.1121 3.86757 12.8661 3.86499 14.4919 4.39795C16.1177 4.93091 17.5298 5.97095 18.5209 7.36556" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>',
      },
      {
        type: "button",
        label: "",
        style: "undoRedo",
        parent: "bottom",
        onClick: (btnElem) => {
          this.enableMic(btnElem);
        },
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M12 17V21M12 21H9M12 21H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="3" width="4" height="10" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.7378 12.7542C17.3674 13.9659 16.6228 15.0293 15.6109 15.7918C14.599 16.5544 13.3716 16.977 12.1047 16.9991C10.8378 17.0212 9.59647 16.6417 8.55854 15.9149C7.52061 15.1881 6.73941 14.1515 6.32689 12.9534" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      {
        type: "button",
        label: "Refresh",
        style: "refresh",
        parent: "bottom",
        onClick: () => {
          this.clearAll();
        },
        innerHTML: '<span style="font-size:25px">&#x21bb;</span>',
      },
    ];

    buttons.forEach((button) => {
      let btn = null;

      if (
        this.props &&
        this.props.toolbar &&
        !this.props.toolbar.includes(button.style)
      ) {
        return;
      }

      if (button.type === "select") {
        btn = document.createElement(button.type);
        button.options.forEach((opt) => {
          const otpEle = document.createElement("option");

          otpEle.label = opt.label;
          otpEle.value = opt.value;
          btn.appendChild(otpEle);
        });
        btn.addEventListener("change", function () {
          globalThis._this.execCmd(button.style, this.value);
        });
      } else if (button.type === "sourceMode") {
        btn = document.createElement("button");
        btn.innerHTML = button.innerHTML;
        btn.style = "cursor: pointer;";
        this.setUpEventListnerBtn(btn, button);
      } else {
        btn = document.createElement(button.type);
        btn.innerHTML = button.innerHTML;
        btn.style = "cursor: pointer;";
        this.setUpEventListnerBtn(btn, button);
      }
      if (button.parent === "bottom") {
        this.bottomBar.appendChild(btn);
      } else {
        this.toolbar.appendChild(btn);
      }
    });
  }

  toggleCodeBlock() {
    document.execCommand("formatBlock", false, "PRE");
    var codeBlock = editor.querySelector("pre");
    codeBlock.style.border = "1px solid #ccc";
    codeBlock.style.backgroundColor = "#f8f8f8";
  }

  toggleSource() {
    this.sourceMode = !this.sourceMode;
    if (this.sourceMode) {
      this.content.textContent = this.content.innerHTML;
    } else {
      this.content.innerHTML = this.content.textContent;
    }
  }

  execCmd(style, value) {
    if (style === "pre") {
      this.toggleCodeBlock();
    } else {
      document.execCommand(style, false, value || null);
      this.content.focus();
    }
  }

  setCursPosition(node, index) {
    var range = document.createRange();
    var sel = window.getSelection();

    range.setStart(node, index);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  addToolTip(parentEle, button) {
    var tooltipTextEle = document.createElement("span");

    if (!button.label) {
      return;
    }
    tooltipTextEle.textContent = button.label;
    tooltipTextEle.className = "tooltiptext";
    parentEle.appendChild(tooltipTextEle);
    parentEle.addEventListener("mouseover", function () {
      tooltipTextEle.style.display = "block";
    });
    parentEle.addEventListener("mouseout", function () {
      tooltipTextEle.style.display = "none";
    });
  }

  setUpEventListnerBtn(btnElem, button) {
    this.addToolTip(btnElem, button);
    btnElem.addEventListener("click", () => {
      if (button.onClick) {
        button.onClick(btnElem);
      } else this.execCmd(button.style, button.value);
    });
  }

  setupEventListeners() {
    this.content.addEventListener("mouseup", () => this.updateSelection());
    this.content.addEventListener("mousedown", () => this.updateSelection());
    this.content.addEventListener("keyup", () => this.updateSelection());
    this.content.addEventListener("keydown", () => this.updateSelection());
    this.content.addEventListener("blur", () => this.updateHistory());
    this.content.addEventListener("input", (e) => {
      this.value = this.content.innerText;
      if (
        (this.history.length &&
          this.value.length - this.history[this.history.length - 1].length >
            5) ||
        this.history.length === 0
      ) {
        this.updateHistory();
      }
      this.props && this.props.onChange && this.props.onChange(e);
    });
  }

  updateSelection() {
    this.selection = window.getSelection();
    this.content.childNodes.forEach((node) => {
      if (node.contains(this.selection.getRangeAt(0).endContainer)) {
        this.tarNode = node;
      }
    });
  }

  insertTextAtCaret(text) {
    var sel, range;

    if (this.selection) {
      sel = this.selection;
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }
    } else if (document.selection && document.selection.createRange) {
      document.selection.createRange().text = text;
    }
  }

  insertHtmlAtCaret(html) {
    var sel, range;

    if (this.selection) {
      // IE9 and non-IE
      sel = this.selection;
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if (document.selection && document.selection.type != "Control") {
      // IE < 9
      document.selection.createRange().pasteHTML(html);
    }
  }

  getText() {
    return this.content.innerText;
  }

  setHtml() {
    return this.content.innerHTML;
  }

  setText(text) {
    this.content.innerText = text;
  }

  setHtml(str) {
    this.content.innerHTML = str;
  }

  clearAll() {
    this.content.innerHTML = "";
  }

  updateUndoRedo() {
    if (this.bottomBar && !this.bottomBar.children.length) {
      return;
    }
    if (
      this.currentPosition === this.history.length - 1 &&
      !(this.currentPosition === -1 && this.history.length === 0)
    ) {
      this.bottomBar.children[1].disabled = true;
      this.bottomBar.children[0].disabled = false;
    } else if (this.currentPosition === -1 && this.history.length !== 0) {
      this.bottomBar.children[1].disabled = false;
      this.bottomBar.children[0].disabled = true;
    } else if (this.currentPosition === -1 && this.history.length === 0) {
      this.bottomBar.children[1].disabled = true;
      this.bottomBar.children[0].disabled = true;
    } else {
      this.bottomBar.children[1].disabled = false;
      this.bottomBar.children[0].disabled = false;
    }
  }

  updateHistory() {
    if (
      (this.history &&
        this.history.length &&
        this.history[this.history.length - 1] === this.content.innerHTML) ||
      !this.content.innerHTML
    ) {
      return;
    }
    this.currentPosition;
    this.history.push(this.content.innerHTML);
    this.currentPosition++;
    this.updateUndoRedo();
  }

  undo() {
    if (this.currentPosition >= 0) {
      this.currentPosition--;
      this.content.innerHTML = this.history[this.currentPosition] || "";
    }
    this.updateUndoRedo();
  }

  redo() {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      this.content.innerHTML = this.history[this.currentPosition];
    }
    this.updateUndoRedo();
  }

  insertTable(rows, cols) {
    const range = this.getCurrentSelectionRange();

    if (range) {
      // Create the table element
      const table = document.createElement("table");

      // Create table body and add rows and cells
      const tbody = document.createElement("tbody");
      for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
          const cell = document.createElement("td");
          cell.textContent = ``;
          row.appendChild(cell);
        }
        tbody.appendChild(row);
      }

      // Append the tbody to the table
      table.appendChild(tbody);

      // Insert the table at the selection range
      range.insertNode(table);
    }
  }

  getCurrentSelectionRange() {
    let range = null;
    const editableDiv = this.content;

    if (this.selection) {
      const selection = this.selection;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        if (!editableDiv.contains(range.commonAncestorContainer)) {
          // The selection is outside the contenteditable div
          range = null;
        }
      }
    }

    return range;
  }

  updateMicStatus(status, btnElem) {
    this.micStatus = status;
    if (btnElem) {
      if (this.micStatus)
        btnElem.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="ripple" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 265.405 265.405" xml:space="preserve"><g><path style="fill:#000002;" d="M132.703,0C59.53,0,0,59.53,0,132.702s59.53,132.702,132.703,132.702   c73.172,0,132.702-59.53,132.702-132.702S205.875,0,132.703,0z M132.703,250.405C67.801,250.405,15,197.604,15,132.702   S67.801,15,132.703,15c64.901,0,117.702,52.801,117.702,117.702S197.604,250.405,132.703,250.405z"/><path style="fill:#000002;" d="M174.816,73.089H90.589c-9.649,0-17.5,7.851-17.5,17.5v84.227c0,9.649,7.851,17.5,17.5,17.5h84.227   c9.649,0,17.5-7.851,17.5-17.5V90.589C192.316,80.94,184.465,73.089,174.816,73.089z M177.316,174.816c0,1.355-1.145,2.5-2.5,2.5   H90.589c-1.355,0-2.5-1.145-2.5-2.5V90.589c0-1.355,1.145-2.5,2.5-2.5h84.227c1.355,0,2.5,1.145,2.5,2.5V174.816z"/></g></svg>';
      else {
        btnElem.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M12 17V21M12 21H9M12 21H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="3" width="4" height="10" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.7378 12.7542C17.3674 13.9659 16.6228 15.0293 15.6109 15.7918C14.599 16.5544 13.3716 16.977 12.1047 16.9991C10.8378 17.0212 9.59647 16.6417 8.55854 15.9149C7.52061 15.1881 6.73941 14.1515 6.32689 12.9534" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
    }
  }

  generatePDF() {
    const originalDisplay = this.content.style.display;

    // Temporarily set the element to be visible to capture the print output
    this.content.style.display = "block";

    // Wait for a short moment to ensure content is rendered before printing
    setTimeout(() => {
      window.print();
      // Restore the original display style
      this.content.style.display = originalDisplay;
    }, 500); // Adjust this delay as needed (milliseconds)
  }

  enableMic(btnElem) {
    if (this.micStatus) {
      globalThis._this.speechRecognizer &&
        globalThis._this.speechRecognizer.stop();

      return;
    }
    if (webkitSpeechRecognition) {
      var speechRecognizer = new webkitSpeechRecognition();
      var tempInnerhtml = this.content.innerHTML;

      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";
      speechRecognizer.start();
      this.updateMicStatus(true, btnElem, speechRecognizer);
      globalThis._this.speechRecognizer = speechRecognizer;

      speechRecognizer.onresult = (event) => {
        var finalTranscripts = "";
        console.log("event", event);
        for (var i = 0; i < event.results.length; i++) {
          for (var j = 0; j < event.results[i].length; j++) {
            const transcript = event.results[i][j].transcript;

            finalTranscripts += transcript;
            console.log("finalTranscripts", finalTranscripts);
          }
        }
        this.updateHistory();
        this.content.innerHTML = tempInnerhtml + finalTranscripts;
      };
      speechRecognizer.onerror = (event) => {
        this.updateMicStatus(false, btnElem);
      };
      speechRecognizer.onend = (event) => {
        this.updateMicStatus(false, btnElem);
      };
    } else {
      result.innerHTML =
        "Your browser is not supported. Please download Google chrome or Update your Google chrome!!";
    }
  }
}

exports.TextEditor = TextEditor;