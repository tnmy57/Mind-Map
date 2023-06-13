// Initialize variables
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let nodes = [];
let connections = [];
let selectedNode = null;
let isDragging = false;
let offset = { x: 0, y: 0 };

// Function to create a new node
function createNode(x, y, label) {
  let node = {
    x: x,
    y: y,
    label: label,
    color: '#4d8500', // Default color
    width: 100,
    height: 50,
    predecessors: [], // Array to store predecessor node indices
    successors: [] // Array to store successor node indices
  };
  nodes.push(node);
  
  // Connect the new node to its predecessor
  let predecessorSelect = document.getElementById('predecessor');
  let predecessorIndex = predecessorSelect.value;
  if (predecessorIndex !== "") {
    let predecessorNode = nodes[predecessorIndex];
    node.predecessors.push(predecessorIndex);
    predecessorNode.successors.push(nodes.indexOf(node));
    connections.push({ from: predecessorIndex, to: nodes.indexOf(node) });
  }
}

// Function to draw a node on the canvas
function drawNode(node) {
  context.fillStyle = node.color;
  context.fillRect(node.x, node.y, node.width, node.height);
  context.strokeStyle = '#000000'; // Border color
  context.lineWidth = 2; // Border width
  const cornerRadius = 5; // Radius for rounded corners
  context.beginPath();
  context.moveTo(node.x + cornerRadius, node.y);
  context.lineTo(node.x + node.width - cornerRadius, node.y);
  context.quadraticCurveTo(node.x + node.width, node.y, node.x + node.width, node.y + cornerRadius);
  context.lineTo(node.x + node.width, node.y + node.height - cornerRadius);
  context.quadraticCurveTo(node.x + node.width, node.y + node.height, node.x + node.width - cornerRadius, node.y + node.height);
  context.lineTo(node.x + cornerRadius, node.y + node.height);
  context.quadraticCurveTo(node.x, node.y + node.height, node.x, node.y + node.height - cornerRadius);
  context.lineTo(node.x, node.y + cornerRadius);
  context.quadraticCurveTo(node.x, node.y, node.x + cornerRadius, node.y);
  context.closePath();
  context.stroke();
  context.fillStyle = '#ffffff';
  context.font = "18px sans-serif";
  context.textAlign = 'center';
  context.textBaseline = 'middle'; // Align text vertically at the middle
  context.fillText(node.label, node.x + node.width / 2, node.y + node.height / 2);
}

// Function to draw a connection between two nodes
function drawConnection(connection) {
  let fromNode = nodes[connection.from];
  let toNode = nodes[connection.to];
  context.beginPath();
  context.moveTo(fromNode.x + fromNode.width, fromNode.y + fromNode.height / 2);
  context.lineTo(toNode.x, toNode.y + toNode.height / 2);
  context.strokeStyle = '#000000';
  context.lineWidth = 2;
  context.stroke();
}

// Function to redraw the canvas
function redraw() {
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  connections.forEach(connection => {
    drawConnection(connection);
  });

  // Draw nodes
  nodes.forEach(node => {
    drawNode(node);
  });
}

// Function to add a node
function addNode() {
  let nodeLabelInput = document.getElementById('node-label');

  let nodeLabel = nodeLabelInput.value.trim();

  if (nodeLabel !== '') {
    let nodeX = Math.random() * (canvas.width - 100); // Random x position
    let nodeY = Math.random() * (canvas.height - 40); // Random y position

    createNode(nodeX, nodeY, nodeLabel);

    redraw();

    nodeLabelInput.value = '';
    nodeLabelInput.focus();
  }
}

// Function to populate the predecessor select dropdown
function populatePredecessorSelect() {
  let predecessorSelect = document.getElementById('predecessor');
  predecessorSelect.innerHTML = '<option value="">None</option>';

  nodes.forEach((node, index) => {
    let option = document.createElement('option');
    option.value = index;
    option.textContent = node.label;
    predecessorSelect.appendChild(option);
  });
}

// Event listener for mouse down
canvas.addEventListener('mousedown', function(event) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  // Check if clicked inside a node
  let clickedNode = null;
  nodes.forEach(node => {
    if (
      mouseX >= node.x &&
      mouseX <= node.x + node.width &&
      mouseY >= node.y &&
      mouseY <= node.y + node.height
    ) {
      clickedNode = node;
    }
  });

  if (clickedNode !== null) {
    // Select the clicked node
    selectedNode = clickedNode;
    isDragging = true;
    offset.x = mouseX - selectedNode.x;
    offset.y = mouseY - selectedNode.y;
  }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', function() {
  isDragging = false;
});

// Event listener for mouse move
canvas.addEventListener('mousemove', function(event) {
  if (isDragging && selectedNode !== null) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    // Update the position of the selected node
    selectedNode.x = mouseX - offset.x;
    selectedNode.y = mouseY - offset.y;

    // Redraw the canvas
    redraw();
  }
});

// Event listener for "Add Node" button click
let addNodeBtn = document.getElementById('add-node-btn');
addNodeBtn.addEventListener('click', function() {
  addNode();
  populatePredecessorSelect();
});

// Event listener for "Clear Canvas" button click
let clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', function() {
  nodes = [];
  connections = [];
  redraw();
  populatePredecessorSelect();
});

// Populate the predecessor select dropdown initially
populatePredecessorSelect();
