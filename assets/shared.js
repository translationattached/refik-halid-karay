
const changeColor = (col, amt) => {
  let num = parseInt(col, 16)
  let r = (num >> 16) + amt
  let b = ((num >> 8) & 0x00FF) + amt
  let g = (num & 0x0000FF) + amt
  let newColor = g | (b << 8) | (r << 16)
  return newColor.toString(16)
}

let toRemoveLater = []
const removeAllLayers = () => {
  console.log("removing");
  audio.pause()
  audio.currentTime = 0
  toRemoveLater.forEach(layer => {
    map.removeLayer(layer)
  })
}
const animatedMarkerCallback = () => { 
  console.log("called!");
  toggleZoom(true) 
  inAnimation = false
  myFullpage.setAllowScrolling(true)
  menu.classList.remove('disabled')
}
const animatedMarkerCallbackI = () => {
  setTimeout(animatedMarkerCallback, 100)
}

const haltCallback = () => { console.log("haltCallback") }
const runAnimation = x => { if (x) { x(haltCallback) } }

let fp = document.querySelector('#fullpage')
let menu = document.querySelector('#menu')
data.forEach((d,i) => {
  let j = i + 1
  menu.innerHTML += `
  <li id="${j}" data-menuanchor="${j}"><a href="#${j}">${j}</a></li>
  `

  fp.innerHTML += `
  <div class="section">
    <h1>${d.title}</h1>
    <p>${d.desc}</p>
  </div>
  `
})


let colors = ["F9F2E7"] 
let anchors = ["1"] 
let num = document.querySelectorAll('#fullpage .section').length
for(let i = 0; i < num - 1; i++) {
  colors.push(changeColor(colors[i], -10))
  anchors.push(`${i+2}`)
}
colors = colors.map(x => `#${x}`)

//fullpage initialisation
let myFullpage = new fullpage('#fullpage', {
    sectionsColor: colors,
    anchors: anchors,
    // menu: '#menu',
    onLeave: function(origin, destination, direction){
      // console.log(origin, destination, direction)
      let o = data[destination.index]
      removeAllLayers()
      console.log("locking");
      inAnimation = true
      toggleZoom(false)
      myFullpage.setAllowScrolling(false)
      menu.classList.add('disabled')
      console.log("flying");
      map.flyTo(o.pos, o.zoom)

      map.on('zoomend', function() {
        runAnimation(o.animation)
        map.off('zoomend')
      })
    },
    onSlideLeave: function(section, origin, destination, direction){
    },
    afterRender: function(){
    },
    afterResize: function(width, height){
    },
    afterSlideLoad: function(section, origin, destination, direction){
    },
    afterLoad: function(origin, destination, direction){
    }
})
