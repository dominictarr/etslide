
# etslide

electron based markdown slides

---

```
#markdown

separate slides with "---"

```

---

insert your javascript demos with an iframe
<h1> hello </h1>

---

``` js_exe
require('path')
console.log('DEMO', process.memoryUsage())
console.log('DEMO', require('os').networkInterfaces())
require('./test')
var h = require('hyperscript')

var h1 = h('h1', "HELLO FROM HYPERSCRIPT")

h1.addEventListener('focus', function (ev) {
  console.log('focus', ev)
})
h1.addEventListener('blur', function (ev) {
  console.log('blur', ev)
})

return h1
```

