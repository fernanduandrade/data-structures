
const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

class Node {
  constructor(data){
    this.data = data
    this.next = null
  }
}

class LinkList {
  constructor(head = null) {
    this.head = head
  }
}

const node1 = new Node('Nodo 1')
const node2 = new Node('Nodo 2')
const node3 = new Node('Nodo 3')
const node5 = new Node('Nodo 5')
const node4 = new Node('Nodo 4')
const node6 = new Node('Nodo 6')
const node7 = new Node('Nodo 7')

node1.next = node2
node2.next = node3
node3.next = node5
node5.next = node4

let linkList = new LinkList(node1)

function positionOverlaps(left, top, width, height, existingPositions) {
  for (let i = 0; i < existingPositions.length; i++) {
    let pos = existingPositions[i];
    if (
      left < pos.left + pos.width &&
      left + width > pos.left &&
      top < pos.top + pos.height &&
      top + height > pos.top
    ) {
      return true;
    }
  }
  return false;
}

function getPosition(parentWidth, parentHeight, childWidth, childHeight, existingPositions) {
  const maxLeft = parentWidth - childWidth;
  const maxTop = parentHeight - childHeight;

  let randomLeft, randomTop;

  do {
    randomLeft = Math.floor(Math.random() * maxLeft);
    randomTop = Math.floor(Math.random() * maxTop);
  } while (positionOverlaps(randomLeft, randomTop, childWidth, childHeight, existingPositions));

  return { left: randomLeft, top: randomTop, width: childWidth, height: childHeight };
}

function calculateAngleBetweenNode(from, to) {
  const deltaX = from.x - to.x;
  const deltaY = from.y - to.y
  const angle = Math.atan2(deltaY, deltaX);
  return angle
}

function calculateDistanceBetwenNode(from, to) {
  const dx = to.left - from .x;
  const dy = to.top - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance
}

function getPositionAtCenter({top, left, width, height}) {
  return {
    x: left + width / 2,
    y: top + height / 2
  };
}

function getDistanceBetweenElements(a, b) {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);  
}

function drawLine(parentElement, from, to, color) {
  var line = document.createElement('canvas');
  const distance = Math.sqrt(Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2));
  const angle = calculateAngleBetweenNode(from, to)
  line.width = distance;
  line.height = 4
  line.style.border = "2px solid #333"
  line.style.backgroundColor = `${color}`
  
  line.style.width = distance  + "px";
  line.style.transform = "rotate(" + angle + "rad)";
  line.style.left = (((from.x + to.x) / 2) - 40) + "px";
  line.style.top = (((from.top + to.top) / 2) - 70) + "px";

  parentElement.appendChild(line);
}

const wrapper = document.getElementById('node-wrapper')

let curr = linkList.head
let createNodes = true

const existingPositions = [];

function dragEnd(evt, element) {
  element.target.style.top = evt.offY + 'px'
  element.target.style.left = evt.offX + 'px'
}

function makeDraggable(element) {
  let offsetX, offsetY

  element.setAttribute("draggable", true);

  element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
      e.dataTransfer.setData('text/plain', '');
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
  });

  element.addEventListener('drag', (e) => {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
  });

  element.addEventListener('dragend', (e) => {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
  });
}

function createNode(parentElement, currentNodeElement, elementsPosition) {
  const nodeWidth = 80;
  const nodeHeight = 80;
  const node = document.createElement('div')
  
  node.classList.add('node')
  const color = randomColor()
  node.style.backgroundColor = color
  const randomPosition= getPosition(parentElement.clientWidth, parentElement.clientHeight, nodeWidth, nodeHeight, existingPositions)
  node.style.top = `${Math.min(randomPosition.top, parentElement.clientHeight - nodeHeight)}px` 
  node.style.left = `${Math.min(randomPosition.left, parentElement.clientWidth - nodeWidth)}px`
  node.draggable = true
  makeDraggable(node)


  const text = document.createElement('span')
  node.appendChild(text)
  text.innerText =  currentNodeElement.data

  parentElement.appendChild(node)
  const { x, y, left, top, width, height } = node.getBoundingClientRect()

  const position = {
    left,
    top,
    width,
    height,
    x,
    y
  }

  elementsPosition.push(position);

  if (elementsPosition.length > 1 && currentNodeElement.next) {
    const prevNode = elementsPosition[elementsPosition.length - 2];
    drawLine(parentElement, prevNode, position, color);
  }

  return node
}

while(createNodes) {
  const node = createNode(wrapper, curr, existingPositions)

  wrapper.appendChild(node)

  if(!curr.next)
    createNodes = false  
  
  curr = curr.next
}
