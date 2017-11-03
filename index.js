var fs = require('fs')
var filename = process.argv[2]
var text = fs.readFileSync(filename, 'utf8')
var marked = require('marked')
var render = new marked.Renderer()


function unescape(html) {
  return h('div', {innerHTML:html}).innerText
}

var path = require('path')
var dirname = path.dirname(filename)
render.image = function (href, title, text) {
  return '<img src='+JSON.stringify(path.join(dirname, href))+
    ' title="'+title+'" />'
}

render.html = function (html) {
  return html //unescaped
}
var _code = render.code
render.code = function (code, lang) {
//  if(lang == 'js!') {
//    console.log('executable js', code)
//    document.body.appendChild(h('script', {innerHTML: code}))
//    return '<script>'+code+'</script>'
//  }
//  else
    return _code.call(this, code, lang)
}
//
//var para = render.paragraph
//render.paragraph = function (text) {
//  return '<p>'+unescape(text)+'</p>'
//}

marked.setOptions({
  renderer: render,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

//HACK to make require work in embedded javascript
//var M = require('module').id = path.resolve(filename)
//module.filename = path.resolve(filename)
//module.paths = []
var dir = path.resolve(dirname)
var paths = []
do  {
  paths.push(path.join(dir, 'node_modules'))
  dir = path.dirname(dir)
} while (dir != '/' && dir)

var h = require('hyperscript')

document.head.appendChild(h('link', {
  rel: 'stylesheet', href: path.join(__dirname, 'style.css')
}))

var slides = text.split(/---+\n/)
.map(function (source, i) {
  return h('div.slide#slide_'+i, {
    innerHTML: marked(source)
  })
})

document.body.appendChild(h('div#content', slides))

document.head.appendChild(h('script', 
'module.filename = "'+path.resolve(filename)+'";'+ 
'module.paths = '+JSON.stringify(paths)
))

function findParent(el, test) {
  if(!el) return
  if(test(el)) console.log('found:', el)
  if(test(el)) return el
  return findParent(el.parentNode, test)
}

var exec = document.querySelectorAll('.lang-js_exe')
var live = window.demos = []

for(var i = 0; i < exec.length; i++) {
  var source = exec[i].innerText
  var slide = findParent(exec[i], function (el) {
    return el.className === 'slide'
  })

  var j = parseInt(slide.id.replace(/\w+_/,''))
  var script = h('script', 'document.querySelector("#slide_'+j+'").appendChild(demos['+j+']=(function () {;'+source+'})())')

  slide.replaceChild(script, exec[i].parentNode)
}

var prev = -1
function update (n) {
  if(n === prev) return
  //check if this slide has a javascript embed
  if(n != prev && demos[prev])
    demos[prev].dispatchEvent(new CustomEvent('blur', {target: demos[prev], updated: n}))
  else if(demos[n])
    demos[n].dispatchEvent(new CustomEvent('focus', {target: demos[n], updated: n}))
  prev = n

  slides.forEach(function (el, i) {
    el.style.display = i == n ? 'block' : 'none'
  })
}

UPDATE = update

var slide = 0
update(0)
window.onkeydown = function (ev) {
  var key = ev.keyCode

  slide = slide + (key == 37 ? -1 : key == 39 ? 1 : 0)

  slide = Math.max(Math.min(slide, slides.length-1), 0)

  update(slide)
}

