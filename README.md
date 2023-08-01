# advanced_texteditor

# Example:

## Pure js:

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/advanced_texteditor/index.css" />
    <script type="text/javascript" src="https://unpkg.com/advanced_texteditor/dist/index.js"></script>
</head>
<body>
    <h1>Text Editor</h1>
    <div id="editor"></div>
</body>
<script>
    new Advanced.TextEditor("#editor", { toolbar: "bold italic underline strikeThrough formatBlock justifyLeft justifyCenter justifyRight justifyFull insertOrderedList insertUnorderedList insertHorizontalRule html pre indent outdent createLink unlink refresh undoRedo", onChange: (e) => { console.log(e) } })
</script>

</html>
```

## React Js:

### Class Component

```
import { TextEditor } from "advanced_texteditor";
import "advanced_texteditor/index.css";

class Sample extends React.Component {
    constructor(props) {
       this.editoRef = null;
    }

    componentDidMount = () => {
       this.editoRef = new TextEditor("#editor", {
          onChange: (e) => {
            console.log(e);
          },
       }),
    }

    render = () => {
       return(
        <div id="editor"/>
       )
    }
}
```
### Functional Component

```
import React, { useRef, useEffect } from 'react';
import { TextEditor } from "advanced_texteditor";
import "advanced_texteditor/index.css";

const Sample = () => {
    const editoRef = useRef(null);

    useEffect(() => {
       editoRef.current = new TextEditor("#editor", {
          onChange: (e) => {
            console.log(e);
          },
       }),
    }, []);

    return (
      <div id="editor"/>
    );
}
```

### Custom Styles
Create index.css file and update following format
```
.ate_editor [contenteditable] {
  padding: 8px 12px;
  min-height: 20vh;
  cursor: pointer;
  overflow: auto;
  background: white;
}

.ate_editor [contenteditable]:focus-visible {
  border: none;
  outline: none;
}

.ate_editor {
  border: 1px solid black;
  background: white;
  margin: 10px;
}

.ate_editor .ate_toolbar,
.ate_editor .ate_bottom_bar {
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 5px;
  background: white;
  flex-wrap: wrap;
  gap: 5px;
}

.ate_editor .ate_toolbar {
  border-bottom: 1px solid;
}

.ate_editor .ate_bottom_bar {
  border-top: 1px solid;
}

.ate_editor .ate_bottom_bar button:disabled {
  filter: opacity(0.5);
}

.ate_editor .ate_toolbar button,
.ate_editor .ate_bottom_bar button {
  border: none;
  display: flex;
  font-size: 16px;
  background: white;
  align-items: center;
  text-align: center;
}

.ate_editor .ate_toolbar select {
  font-size: 16px;
}

.ate_editor .ate_toolbar button .tooltiptext,
.ate_editor .ate_bottom_bar button .tooltiptext {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
}

.ate_editor .ate_toolbar button:hover .tooltiptext {
  visibility: visible;
}

.ate_editor .ate_bottom_bar {
  /* height: 20px; */
  background: #fff;
}

.ate_editor table {
  border: 1px solid;
  border-collapse: collapse;
}

.ate_editor table tr td {
  border: 1px solid;
}

.ate_editor .ate_bottom_bar .ripple {
  animation: ripple 2s linear infinite;
  border-radius: 50%;
}


@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 #0000008a
  }
  100% {
    box-shadow: 0 0 0 5px #0000008a
  }
}

```
