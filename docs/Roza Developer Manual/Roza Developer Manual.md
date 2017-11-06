[TOC]

<div class="manual">

# Creating Module

Step 1: Prepare UI by creating JSON composed from various Roza's element. See [Prepare UI](#prepareui)

Step 2: Save the UI in database (table roza_ui). Get the ui_id

Step 3: Create landing file. See [Create Landing File](#createlandingfile)

Step 4: Call the landing file. See [Call Landing File](#calllandingfile)

------

<a name="prepareui"></a>

# Prepare UI

UI means what would you like the screens' segments to display (usually a listing or form). The segments refer to taskbar, leftPanel, rightPanel or fullPanel.

A UI is composed of:

1. **Data** - What value you want each of the element to be
2. **Element** - Eg text field, dropdown, checkbox, etc
3. **Lookup** - If the element is dropdown, you want to populate all the options

When composing a UI, the data must come first (if any but not mandatory). This is an example of a complete UI:

```json
[
  {
    "type": "data", //element type data
    "source": {"gender":"P", "comment":"Testing 123"}
  },
  {
    "type": "title", //element type title
    "labelbm": "Permohonan Cuti",
    "labelbi": "Leave Application"
  },
  {
    "id": "gender",
    "type": "dropdown", //element type dropdown
    "source": [{"value":"M", "labelbi":"Male", "labelbm":"Lelaki"}, {"value":"P", "labelbi":"Female", "labelbm":"Perempuan"}], //lookup
    "labelbm": "Jantina",
    "labelbi": "Gender"
  },
  {
    "id": "comment",
    "type": "textarea",
    "labelbm": "Komen",
    "labelbi": "Comment",
    "placeholder": "insert comment",
    "maxlength": 255,
    "required": true
  }
]
```

------

<a name="elementtaskbar"></a>

## Element: taskbar

Taskbar is just a collection of menu which should trigger another UI. All item in taskbar (list) **SHOULD** has icon as standard layout. The icon use FontAwesome as its standard class name. Sample:
```json
[
  {
    "type": "taskbar",
    "labelbm": "Baru",
    "labelbi": "New",
    "icon": "fa fa-plus",
    "list": [
      {
        "labelbm": "Tatatertib",
        "labelbi": "Discipline"
      },
      {
        "labelbm": "Cuti",
        "labelbi": "Leave",
        "onclick": "rozaCallLandingFile('UI_ProtoCutiNew.js')"
      },
      {
        "labelbm": "Tuntutan",
        "labelbi": "Claim"
      }
    ]
  },
  {
    "type": "taskbar",
    "labelbm": "Status",
    "labelbi": "Status",
    "icon": "fa fa-hourglass-end"
  },
  {
    "type": "taskbar",
    "labelbm": "Tugasan",
    "labelbi": "Task",
    "icon": "fa fa-tasks"
  }
]
```

------

## Element: data

By itself, it won't produce any UI at the front end. The data element is used to provide value to elements defined in the same JSON scope.

The source must return **single row data (not array)** either from SQL or JSON itself.

*Optional: sourceparam*

```json
[
  {
    "type": "data",
    "source": "SELECT data_data FROM proto_data WHERE data_id = ?",
    "sourceparam": ["rozaGetParam(id)"]
  },
  {
    "type": "data",
    "source": {"test123":"Lorem Ipsum"}
  },
	{
      "id": "test123",
      "type": "text",
      "labelbm": "Cubaan",
      "labelbi": "Testing"
    },
]
```

The key for each data must match the element's id. In the above sample, an element with id = test123 will has "Lorem Ipsum" as its value.

This is sample of value for proto_data.data_data in database:
```json
{"name": "Salbiah bt Ahmad", "state": "KUL"}
```
------

## Element: standardlist

It's an email like listing usually put at the leftPanel. The source SQL must includes 5 alias (ROZA_ID, ROZA_TITLE, ROZA_DESC, ROZA_TIME, ROZA_UNREAD).

*Optional: sourceparam, onclick*

```json
[
  {
    "type": "standardlist",
    "source": "SELECT task_id ROZA_ID, task_title ROZA_TITLE, task_desc ROZA_DESC, task_timecreate ROZA_TIME, task_unread ROZA_UNREAD FROM proto_task WHERE task_userid = ? ORDER BY task_timecreate",
    "sourceparam": ["Selangor", "rozaGetParam(globalUserId)"],
    "onclick": "rozaCallLandingFile('UI_ProtoCuti.js?id=rozaGetField(ROZA_ID)')",
    "labelbm": "Senarai Tugasan",
    "labelbi": "Task List"
  }
]
```

------

## Element: dropdown

The default value for this element is received from the data elements. In order for the user to change the dropdown value, this element required another source as it lookup value.

The source must return **array data** either from SQL or JSON itself.

*Optional: source_param, onchange, required*

```json
[
  {
    "id": "state",
    "type": "dropdown",
    "source": "SELECT lov_data FROM proto_lov WHERE lov_category = 'state'",
    "labelbm": "Negeri",
    "labelbi": "State",
    "onchange": "rozaModal(this.val)",
    "required": true
  },
  {
    "id": "gender",
    "type": "dropdown",
    "source": [{"value":"M", "labelbi":"Male", "labelbm":"Lelaki"}, {"value":"P", "labelbi":"Female", "labelbm":"Perempuan"}],
    "labelbm": "Jantina",
    "labelbi": "Gender"
  },
]
```

------

## Element: inlinehtml & blockhtml

This special element is used to display custom html markup. It can be anything from normal link to complex graph. The source of it's UI comes from the data element source. If your HTML Markup too complex, put it in external HTML file in **"dev > html"** folder and then use iframe.

If you want to display a single line of text (eg link) beside it's label, use inlinehtml. If you want to display complex html (eg iframe), use blockhtml.

*Optional: fullwidth*

```json
[
  {
    "type": "data",
    "source": {"el1":"<a href='' onclick='download(1)'>My Paperwork.docx</a>"}
  },
  {
    "type": "data",
    "source": {"el2":"<iframe src='dev/html/UI_Complex.html?id=rozaGetParam(id)'></iframe>"}
  },
  {
    "id": "el1",
    "type": "inlinehtml",
    "labelbm": "Pautan",
    "labelbi": "Link"
  },
  {
    "id": "el2",
    "type": "blockhtml"
    "fullwidth": true
  }
]
```

This is example of UI_Complex.html:

```html
<style> body, html { margin:0; } </style>
<div style="background:red; padding:10px;">Testing 123</div>
<script> alert('Hello!'); </script>
```

Setting the fullwidth property to true will make the inlinehtml/blockhtml occupy the label area as well.

------

## Element Type vs Properties
<table class="longtable" cellspacing="0" cellpadding="0"><tr><td>Element Type</td><td><div>source</div></td><td><div>source_param</div></td><td><div>onclick</div></td><td><div>onchange</div></td><td><div>labelbm</div></td><td><div>labelbi</div></td><td><div>placeholder</div></td><td><div>maxlength</div></td><td><div>filetype</div></td><td><div>fullwidth</div></td><td><div>icon</div></td><td><div>list</div></td><td><div>required</div></td></tr><tr><td>taskbar</td><td></td><td></td><td>◉</td><td></td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td>◉</td><td>◉</td><td></td></tr><tr><td>data</td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>standardlist</td><td>◉</td><td>◉</td><td>◉</td><td></td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>title</td><td></td><td></td><td></td><td></td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>text</td><td></td><td></td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td>◉</td></tr><tr><td>textarea</td><td></td><td></td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td>◉</td></tr><tr><td>dropdown</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td>◉</td></tr><tr><td>file</td><td></td><td></td><td></td><td></td><td>◉</td><td>◉</td><td></td><td></td><td>◉</td><td></td><td></td><td></td><td>◉</td></tr><tr><td>inlinehtml</td><td></td><td></td><td></td><td></td><td>◉</td><td>◉</td><td></td><td></td><td></td><td>◉</td><td></td><td></td><td>◉</td></tr><tr><td>button</td><td></td><td></td><td>◉</td><td></td><td>◉</td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>formbutton</td><td></td><td></td><td>◉</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>

**filetype:**	Array of string. Eg ["doc", "docx"]

**onclick:**		Function name in string. Eg "rozaModal()"

------

## Element Event

You can use normal jQuery event (eg onclick, onchange, mouseover, etc) in any part of your code. Roza natively provide these events which can be attached to any element:

1. onclick
2. onchange

The advantage of using native event compare to normal jQuery is that this event is hidden from the DOM.

Sample of usage:
```json
{
  "id": "state",
  "type": "dropdown",
  "labelbm": "Negeri",
  "labelbi": "State",
  "onclick": "rozaCallLandingFile('UI_ProtoCuti.js?id=rozaGetField(ROZA_ID)')"
}
```
------

# Landing File

<a name="createlandingfile"></a>

## Create Landing File

A landing file is a Javascript file where we define which screens' segments our UI should be placed. We could also define any function which will interact with our UI.

All landing file should be place in in **"dev/js"** folder. To place a UI, we call rozaSetTaskbar() or rozaSetPanel().

Sample:

```javascript
rozaSetTaskbar({
  ui: 3, //ui_id
  callback: taskbar //optional
});

rozaSetPanel({
  panel: 'leftPanel', //leftPanel, rightPanel, fullPanel
  ui: 2, //ui_id
  callback: uiReady //optional
});

function taskbar() {
  alert('Yea, ready to rock!');
}

function uiReady() {
  alert('Yea, ready to rock!');
}
```

### **rozaSetTaskbar()**

Only UI with element type = taskbar can be assigned here. See [Element: taskbar](#elementtaskbar)

### **rozaSetPanel()**

Beside element taskbar, the rest should goes here. ~~See [Case Study 1: Sharing UI](#case1)~~

------

<a name="calllandingfile"></a>

## Call Landing File

### rozaCallLandingFile()

To call a landing file, type this is your Javascript:

```javascript
rozaCallLandingFile('UI_ProtoTask.js');
```

Usually we call the landing file from menu or link. Either the it is called from HTML:

```html
<div @click="rozaCallLandingFile('UI_ProtoTask.js')">
```

Or declare in database in roza_menu table.

### rozaSetBreadcrumb()

In the landing file, if may need to change the breadcrumb:

```javascript
rozaSetBreadcrumb('<li class="breadcrumb-item"><a href="#">Human Resource</a></li><li class="breadcrumb-item"><a href="#">Task</a></li>');
```

------

# Build In Function

All build in function will not work in iframe.

------

## rozaGetParam()

You can get the page parameter using rozaGetParam(). In normal coding, it accept a string as parameter.

Javascript sample:
```javascript
alert(rozaGetParam('id'));
```
PHP Sample:
```php
echo rozaGetParam('id');
$sql = "SELECT ".rozaGetParam('globalUserName')."FROM DUAL";
rozaExecuteQuery("SELECT ? FROM DUAL", [rozaGetParam('globalUserName')]);
```

In SQL/JSON string, use without quote:

```json
[
  {
    "type": "standardlist",
    "source": "SELECT 'rozaGetParam(state)' state, ? myid FROM abc WHERE task_userid = ?",
    "sourceparam": ["Selangor", "rozaGetParam(globalUserId)"],
    "onclick": "rozaCallLandingFile('UI_ProtoCuti.js?id=rozaGetParam(nric)')"
  }
]
```

You cannot do this in JSON saved in the DB. Even you try, your DB client won't accept.

```json
{
  "type": "standardlist",
  "source": "SELECT "+rozaGetParam('globalUserName')+" FROM DUAL"
}
```

But this is allowed:

```json
{
  "type": "standardlist",
  "source": "SELECT 'rozaGetParam(globalUserName)' FROM DUAL"
}
```

However, its is better to use parametrized (source_param) to avoid SQL injection

------

## rozaGetField()

You can get the field's value from the SQL defined in the same JSON scope using rozaGetField(). Use without quote. It is CASE SENSITIVE:

```json
{
  "type": "standardlist",
  "source": "SELECT 'Selangor' sTAte task_category FROM DUAL",
  "onclick": "rozaCallLandingFile('TEMPLATE_Abc.js?state=rozaGetField(sTAte))"
}
```

You cannot use in SQL since it doesn't makes sense!

```json
{
  "source": "SELECT rozaGetField(name), task_category FROM DUAL"
}
```

------

## rozaSubmitData()

Submit all data to targeted PHP file in **"dev/php"** folder.
```
{
  "id": "send",
  "type": "button",
  "onclick": "rozaSubmitData('BL_ProtoSubmit.php')"
}
```
------

## rozaModal()

Modal = Alert = Popup. To open modal, use this in your Javascript:
```javascript
rozaModal({
  labelbm: 'Lorem Ipsum',
  labelbi: 'Lorem Ipsum',
  cancel: true, //optional
  action: 'okBeingClicked()' //optional
});
```
labelbm and labelbi can accept HTML markup.

Set cancel to true to display cancel button. Set to false or discard this property to hide cancel button.

If you want OK button that does nothing, set action to empty string or simply discard this property.

To close modal, call the same function without any options.

```
rozalModal();
```

------

# Predefine Variable

Just like requesting page parameter, you can use rozaGetParam() to get Roza's predefine variables.

| Description         | Variable       | Return Format             |
| ------------------- | -------------- | ------------------------- |
| Get login user ID   | globalUserId   | "1"                       |
| Get login user name | globalUserName | "Roza"                    |
| Get login user role | globalUserRole | "('admin', 'supervisor')" |

------

# Case Study

<a name="case1"></a>

## ~~Sharing UI~~

Lets say an employee want to make a leave application. The HR will view the same form with populated data with additional elements (eg process button).

We don't need to create separated UI. We need to create one full UI:

```
[
  {
    "type": data",
  	"source": "SELECT leave_name FROM leave WHERE leave_id=rozaGetParam(leave_id)",
  	apa kata guna source utk check condition disable bagai?
  },
  {
    "id": "emp_name",
    "type": "text",
    "conditional": {
      "disable": "SELECT 1 FROM leave WHERE 'new'!='rozaGetParam(process_type)'"
    }
  },
  {
    "id": "send",
    "type": "button",
    "onclick": "rozaSubmitData('BL_ProtoLeaveNew.php')"
  },
  {
    "id": "send",
    "type": "button",
    "onclick": "rozaSubmitData('BL_ProtoLeaveProcess.php')",
    "role"
  }
]
```



</div>